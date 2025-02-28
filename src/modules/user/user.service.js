import User from "../../DB/models/user.model.js";
import cloudinary from "../../utils/file uploading/cloudinary.config.js";
import {
  defaultPublicID_coverPic,
  defaultPublicID_profilePic,
  defaultSecureURL_coverPic,
  defaultSecureURL_profilePic,
} from "../../utils/constants/cloudinaryConstants.js";
import { compareHash } from "../../utils/hashing/hash.js";

// Update user account (mobileNumber, DOB, firstName, lastName, gender)
export const updateUser = async (req, res, next) => {
  const { mobileNumber, DOB, firstName, lastName, gender } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  if (mobileNumber) user.mobileNumber = mobileNumber;
  if (DOB) user.DOB = DOB;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (gender) user.gender = gender;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    results: { user },
  });
};

// Get login user account data
export const getLoginUserProfile = async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById({
    _id: userId,
    isLoggedIn: true,
    freezed: false,
  }).select("-password -__v");
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  return res.status(200).json({
    success: true,
    results: { user },
  });
};

// Get profile data for another user (userName, mobileNumber, profilePic, coverPic)
export const getUserProfileById = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById({
    _id: userId,
    isLoggedIn: true,
    freezed: false,
  }).select("firstName lastName mobileNumber profilePic coverPic");
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  const profileData = {
    username: `${user.firstName} ${user.lastName}`,
    mobileNumber: user.mobileNumber,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
  };

  return res.status(200).json({
    success: true,
    results: { profileData },
  });
};

// Update user password
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return next(new Error("User not found!"), { cause: 404 });

  if (!compareHash({ plainText: oldPassword, hash: user.password }))
    return next(new Error("Old password is incorrect!"), { cause: 400 });

  user.password = newPassword;
  user.isLoggedIn = false;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

// Upload profile picture
export const uploadProfilePic = async (req, res, next) => {
  const userId = req.user._id;
  const { file } = req;

  if (!file) return next(new Error("No file uploaded!", { cause: 400 }));

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  if (user.profilePic?.public_id) {
    await cloudinary.uploader.destroy(user.profilePic.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/users/${userId}/profilePicture`,
    }
  );

  user.profilePic = {
    secure_url: secure_url,
    public_id: public_id,
  };

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    results: { profilePic: user.profilePic },
  });
};

// Upload cover picture
export const uploadCoverPic = async (req, res, next) => {
  const userId = req.user._id;
  const { file } = req;

  if (!file) return next(new Error("No file uploaded!", { cause: 400 }));

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  if (user.coverPic?.public_id) {
    await cloudinary.uploader.destroy(user.coverPic.public_id);
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/users/${userId}/coverPicture`,
    }
  );

  user.coverPic = {
    secure_url: secure_url,
    public_id: public_id,
  };
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Cover picture uploaded successfully",
    results: { coverPic: user.coverPic },
  });
};

// Delete profile picture
export const deleteProfilePic = async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  if (user.profilePic?.public_id) {
    await cloudinary.uploader.destroy(user.profilePic.public_id);
  }

  user.profilePic = {
    secure_url: defaultSecureURL_profilePic,
    public_id: defaultPublicID_profilePic,
  };
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile picture deleted successfully",
  });
};

// Delete cover picture
export const deleteCoverPic = async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  if (user.coverPic?.public_id) {
    await cloudinary.uploader.destroy(user.coverPic.public_id);
  }

  user.coverPic = {
    secure_url: defaultSecureURL_coverPic,
    public_id: defaultPublicID_coverPic,
  };
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Cover picture deleted successfully",
  });
};

//Soft delete user account
export const softDeleteUser = async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  user.deletedAt = new Date();
  user.isLoggedIn = false;
  user.isActivated = false;
  user.freezed = true;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User account soft deleted successfully",
  });
};

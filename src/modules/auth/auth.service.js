import User from "../../DB/models/user.model.js";
import { OTP_TYPES } from "../../utils/constants/authConstants.js";
import randomstring from "randomstring";
import { eventEmitter } from "../../utils/emails/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { subjects } from "../../utils/constants/appConstants.js";

// Register a new user
export const signup = async (req, res, next) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new Error("User already exists!"), { cause: 409 });

  const OTP = randomstring.generate({ length: 6, charset: "alphanumeric" });
  eventEmitter.emit("SIGNUP", email, OTP, subjects.signUp);

  const hashedOTP = hash({ plainText: OTP });

  const user = await User.create({
    ...req.body,
    isActivated: true,
    OTP: [
      {
        code: hashedOTP,
        type: OTP_TYPES.CONFIRM_EMAIL,
        expiresIn: new Date(Date.now() + 10 * 60 * 1000),
      },
    ],
  });

  return res.status(201).json({
    success: true,
    results: { user },
  });
};

// Confirm OTP
export const confirmOTP = async (req, res, next) => {
  const { email, otp, type } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found!"), { cause: 404 });

  const otpRecord = user.OTP.find(
    (otp) => otp.type === type && otp.expiresIn > new Date()
  );

  if (!otpRecord) {
    return next(new Error("Invalid or expired OTP!", { cause: 400 }));
  }

  if (!compareHash({ plainText: otp, hash: otpRecord.code })) {
    return next(new Error("Invalid OTP!", { cause: 400 }));
  }

  if (type === OTP_TYPES.CONFIRM_EMAIL) {
    user.isConfirmed = true;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "OTP confirmed successfully.",
  });
};

// Sign in a user (only for system provider)
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid email!"), { cause: 400 });

  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new Error("Invalid password!"), { cause: 400 });

  user.isLoggedIn = true;
  await user.save();

  return res.status(200).json({
    success: true,
    access_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    refresh_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    }),
  });
};

export const signupOrLoginWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new Error("ID token is required!", { cause: 400 }));
  }

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email_verified, email, name, picture } = payload;

  if (!email_verified) {
    return next(new Error("Invalid email!", { cause: 400 }));
  }

  const [firstName, ...lastNameParts] = name.split(" ");
  const lastName = lastNameParts.join(" ");

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      firstName,
      lastName,
      email,
      profilePic: {
        secure_url: picture,
        public_id: null,
      },
      isActivated: true,
      isLoggedIn: true,
      provider: providers.google,
    });
  } else {
    user.isLoggedIn = true;
    await user.save();
  }

  return res.status(200).json({
    success: true,
    access_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    refresh_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    }),
  });
};

// Send OTP for forget password
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isActivated: true, freezed: false });
  if (!user) return next(new Error("Invalid email!"), { cause: 404 });

  const OTP = randomstring.generate({ length: 6, charset: "numeric" });
  eventEmitter.emit("FORGOT_PASSWORD", email, OTP, subjects.forgetPassword);
  const hashedOTP = hash({ plainText: OTP });

  user.OTP.push({
    code: hashedOTP,
    type: OTP_TYPES.FORGET_PASSWORD,
    expiresIn: new Date(Date.now() + 10 * 60 * 1000),
  });

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Code sent successfully",
  });
};

// Reset password
export const resetPassword = async (req, res, next) => {
  const { otp, email, password } = req.body;

  const user = await User.findOne({ email, isActivated: true, freezed: false });
  if (!user) return next(new Error("Invalid email!", { cause: 404 }));

  const otpRecord = user.OTP.find(
    (otp) =>
      otp.type === OTP_TYPES.FORGET_PASSWORD && otp.expiresIn > new Date()
  );

  if (!otpRecord)
    return next(new Error("Invalid or expired OTP!", { cause: 400 }));

  if (!compareHash({ plainText: otp, hash: otpRecord.code })) {
    return next(new Error("Invalid OTP!", { cause: 400 }));
  }

  user.password = password;
  user.isLoggedIn = false;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};

// Refresh access token
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  const payload = verifyToken({ token: refreshToken });
  if (!payload)
    return next(new Error("Invalid refresh token!", { cause: 401 }));

  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User not found!", { cause: 404 }));

  const tokenIssuedAt = new Date(payload.iat * 1000);
  if (user.changeCredentialTime && user.changeCredentialTime > tokenIssuedAt) {
    return next(
      new Error("Token expired, please login again!", { cause: 401 })
    );
  }

  return res.status(200).json({
    success: true,
    access_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
  });
};

import { Schema, model, Types } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";
import { OTP_TYPES, providers } from "../../utils/constants/authConstants.js";
import { genders, roles } from "../../utils/constants/appConstants.js";
import {
  defaultPublicID_profilePic,
  defaultSecureURL_profilePic,
  defaultPublicID_coverPic,
  defaultSecureURL_coverPic,
} from "../../utils/constants/cloudinaryConstants.js";
import { dncrypt, encrypt } from "../../utils/encryption/encryption.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.SYSTEM ? true : false;
      },
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.SYSTEM,
    },
    gender: {
      type: String,
      enum: Object.values(genders),
      default: genders.MALE,
    },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const ageDifMs = Date.now() - value.getTime();
          const ageDate = new Date(ageDifMs);
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);
          return age >= 18;
        },
        message: "User must be at least 18 years old.",
      },
    },
    mobileNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    freezed: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    bannedAt: {
      type: Date,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: {
      type: Date,
    },
    profilePic: {
      secure_url: { type: String, default: defaultSecureURL_profilePic },
      public_id: { type: String, default: defaultPublicID_profilePic },
    },
    coverPic: {
      secure_url: { type: String, default: defaultSecureURL_coverPic },
      public_id: { type: String, default: defaultPublicID_coverPic },
    },
    OTP: [
      {
        code: String,
        type: { type: String, enum: Object.values(OTP_TYPES) },
        expiresIn: Date,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
  }
);

// Virtual for username
userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password and encrypt mobile number before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({ plainText: this.mobileNumber });
  }
  return next();
});

// Decrypt mobile number after fetching from database
userSchema.post("init", function (doc) {
  if (doc.mobileNumber) {
    doc.mobileNumber = dncrypt({ cipherText: doc.mobileNumber });
  }
});

const User = model("User", userSchema);
export default User;

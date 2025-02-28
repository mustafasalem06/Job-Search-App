import schedule from "node-schedule";
import User from "../../DB/models/user.model.js";
import { asyncHandler } from "./../error handling/asynchandler.js";

// Create a new CronJob
const deletingExpiredOTP = schedule.scheduleJob(
  "0 */6 * * *",
  asyncHandler(async () => {
    console.log("Cron Job started at:", new Date());

    const users = await User.find({
      OTP: { $exists: true, $not: { $size: 0 } },
    });

    if (users.length === 0) {
      console.log("No users found with OTP!");
      return;
    }

    console.log(`Found ${users.length} users with OTPs.`);

    for (const user of users) {
      const originalOTPCount = user.OTP.length;
      user.OTP = user.OTP.filter((otp) => otp.expiresIn > new Date());
      const newOTPCount = user.OTP.length;

      if (originalOTPCount !== newOTPCount) {
        console.log(
          `User ${user._id}: Deleted ${
            originalOTPCount - newOTPCount
          } expired OTPs.`
        );
      }

      await user.save();
    }

    console.log("Expired OTPs deleted successfully.");
  })
);

export default deletingExpiredOTP;
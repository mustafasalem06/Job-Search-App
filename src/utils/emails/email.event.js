import { EventEmitter } from "events";
import sendEmails from "./sendEmails.js";
import { forgetPasswordTemplate, resetPasswordTemplate, signupTemplate } from './generateHTML.js';

export const eventEmitter = new EventEmitter();

eventEmitter.on("SIGNUP", async (email, otp, subject) => {
  await sendEmails({
    to: email,
    subject,
    html: signupTemplate(otp, email),
  });
});

eventEmitter.on("FORGOT_PASSWORD", async (email, otp, subject) => {
  await sendEmails({
    to: email,
    subject,
    html: forgetPasswordTemplate(otp, email),
  });
});

eventEmitter.on("RESET_PASSWORD", async (email, otp, subject) => {
  await sendEmails({
    to: email,
    subject,
    html: resetPasswordTemplate(otp, email),
  });
});

eventEmitter.on("NEW_APPLICATION_STATUS", async (email, status, subject) => {
  await sendEmails({
    to: email,
    subject,
    html: `Your application has been ${status}.`,
  });
})
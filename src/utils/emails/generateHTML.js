export const signupTemplate = (otp, email) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background-color: crimson;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            font-size: 22px;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            background: crimson;
            color: white;
            padding: 10px 20px;
            display: inline-block;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">Verify Your Email</div>
        <p>Hello,</p>
        <p>We received a request to verify your email: <strong>${email}</strong>.</p>
        <p>Use the OTP below to complete the verification process:</p>
        <div class="otp-code">${otp}</div>
        <p>If you didn’t request this, you can safely disregard this email.</p>
        <p class="footer">&copy; 2025 Your Company. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const forgetPasswordTemplate = (otp, email) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background-color: crimson;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            font-size: 22px;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            background: crimson;
            color: white;
            padding: 10px 20px;
            display: inline-block;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">Verify Your Email</div>
        <p>Hello,</p>
        <p>We received a request to verify your email: <strong>${email}</strong>.</p>
        <p>Use the OTP below to complete the verification process:</p>
        <div class="otp-code">${otp}</div>
        <p>If you didn’t request this, you can safely disregard this email.</p>
        <p class="footer">&copy; 2025 Your Company. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const resetPasswordTemplate = (link) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background-color: crimson;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            font-size: 22px;
        }
        .button {
            font-size: 18px;
            font-weight: bold;
            background: crimson;
            color: white;
            padding: 10px 20px;
            display: inline-block;
            margin: 20px 0;
            border-radius: 5px;
            text-decoration: none;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">Reset Your Password</div>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${link}" class="button">Reset Password</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p class="footer">&copy; 2025 Your Company. All rights reserved.</p>
    </div>
</body>
</html>
`;

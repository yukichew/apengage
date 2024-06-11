const nodemailer = require('nodemailer');
const otplib = require('otplib');

exports.generateTOTP = () => {
  const secret = otplib.authenticator.generateSecret();
  const token = otplib.authenticator.generate(secret);
  return token;
};

exports.mailTransport = () =>
  nodemailer.createTransport({
    // host: 'smtp.mailgun.org',
    host: 'sandbox.smtp.mailtrap.io',
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

exports.generateEmailTemplate = (code, title, description) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>

      <body style="
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: #ffffff;
            font-size: 14px;
          ">
        <div style="
              max-width: 680px;
              margin: 0 auto;
              padding: 45px 30px 60px;
              background: #f4f7ff;
              font-size: 14px;
              color: #434343;
            ">
            <header style="text-align: center">
                <img src="https://res.cloudinary.com/dkhkqvqf0/image/upload/v1716989103/Black_xmcngn.svg"
                    style="width: 200px;" />
            </header>

            <main>
                <div style="
                  margin: 0;
                  margin-top: 30px;
                  padding: 92px 30px 115px;
                  background: #ffffff;
                  border-radius: 30px;
                  text-align: center;
                ">
                    <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                        <h1 style="
                      margin: 0;
                      font-size: 24px;
                      font-weight: 500;
                      color: #1f1f1f;
                    ">
                        ${title}
                        </h1>
                        <p style="
                      margin: 0;
                      margin-top: 17px;
                      font-weight: 500;
                      letter-spacing: 0.56px;
                    ">
                            ${description}
                        </p>
                        <p style="
                      margin: 0;
                      margin-top: 60px;
                      font-size: 30px;
                      font-weight: 600;
                      letter-spacing: 15px;
                      color: #ba3d4f;
                    ">
                            ${code}
                        </p>
                    </div>
                </div>
            </main>

            <footer style="
                width: 100%;
                max-width: 490px;
                margin: 20px auto 0;
                text-align: center;
                border-top: 1px solid #e6ebf1;
              ">
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                    Copyright © APEngage 2024. All rights reserved.
                </p>
            </footer>
        </div>
    </body>
  </html>`;
};

exports.plainEmailTemplate = (heading, message) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
    </head>

    <body style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        ">
      <div style="
            max-width: 680px;
            margin: 0 auto;
            padding: 45px 30px 60px;
            background: #f4f7ff;
            font-size: 14px;
            color: #434343;
          ">
          <header style="text-align: center">
              <img src="https://res.cloudinary.com/dkhkqvqf0/image/upload/v1716989103/Black_xmcngn.svg"
                  style="width: 200px;" />
          </header>
  
        <main>
          <div
            style="
              margin: 0;
              margin-top: 30px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                ${heading}
              </h1>
              <p
                style="

                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                ${message}
              </p>
            </div>
          </div>
        </main>

        <footer style="
              width: 100%;
              max-width: 490px;
              margin: 20px auto 0;
              text-align: center;
              border-top: 1px solid #e6ebf1;
            ">
              <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © APEngage 2024. All rights reserved.
              </p>
          </footer>
      </div>
  </body>
</html>`;
};

exports.generateResetPasswordEmailTemplate = (url, description) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
    </head>

    <body style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        ">
      <div style="
            max-width: 680px;
            margin: 0 auto;
            padding: 45px 30px 60px;
            background: #f4f7ff;
            font-size: 14px;
            color: #434343;
          ">
          <header style="text-align: center">
              <img src="https://res.cloudinary.com/dkhkqvqf0/image/upload/v1716989103/Black_xmcngn.svg"
                  style="width: 200px;" />
          </header>

          <main>
              <div style="
                margin: 0;
                margin-top: 30px;
                padding: 92px 30px 115px;
                background: #ffffff;
                border-radius: 30px;
                text-align: center;
              ">
                  <div style="width: 100%;
                  max-width: 489px;
                  margin: 0 auto;">
                      <h1 style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 500;
                    color: #1f1f1f;
                  ">
                          Trouble signing in?
                      </h1>
                      <p style="
                    margin: 0;
                    margin-top: 17px;
                    font-weight: 500;
                    letter-spacing: 0.56px;
                  ">
                          ${description}
                      </p>
                      <p style="padding-bottom: 16px">
                      <a href="${url}"
                        style="padding: 12px 24px;
                        border-radius: 4px;
                        color: #FFF;
                        background: #2B52F5;
                        display: inline-block;
                        margin: 0.5rem 0;
                        text-decoration: none">Reset Password</a>
                        </p>
                  </div>
              </div>
          </main>

          <footer style="
              width: 100%;
              max-width: 490px;
              margin: 20px auto 0;
              text-align: center;
              border-top: 1px solid #e6ebf1;
            ">
              <p style="margin: 0; margin-top: 16px; color: #434343;">
                  Copyright © APEngage 2024. All rights reserved.
              </p>
          </footer>
      </div>
  </body>
</html>`;
};

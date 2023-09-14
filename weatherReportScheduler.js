const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/User");
const fetchWeather = require("./utils/fetchWeather");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "YOUR_GMAIL_USERNAME",
    pass: "YOUR_GMAIL_PASSWORD",
  },
});

cron.schedule("0 */3 * * *", async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      const weatherData = await fetchWeather(user.location);

      const mailOptions = {
        from: "your@email.com",
        to: user.email,
        subject: "Hourly Weather Report",
        text: `Weather Report: ${JSON.stringify(weatherData)}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Email sending error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }
  } catch (error) {
    console.error("Error sending hourly weather reports:", error);
  }
});

console.log("Hourly weather report scheduler started.");

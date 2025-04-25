const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});
//for refresh again
app.post("/api/send-email", upload.single("file"), async (req, res) => {
  try {
    const { body, subject } = req.body;
    const file = req.file;
    // console.log(req.file);
    if (!body) {
      return res.status(400).json({ message: "Body is required" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "boostmysitescom@gmail.com",
      subject: subject,
      text: body,
    };
    const mailOptions1 = {
      from: process.env.EMAIL_USER,
      to: "ceo@boostmysites.com",
      subject: subject,
      text: body,
    };
    const mailOptions2 = {
      from: process.env.EMAIL_USER,
      to: "remeesreme4u@gmail.com",
      subject: subject,
      text: body,
    };

    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
      mailOptions1.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
      mailOptions2.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptions1);
    await transporter.sendMail(mailOptions2);

    res.json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email: " + error.message });
  }
});
app.post("/api/send-signup", upload.array("file", 10), async (req, res) => {
  try {
    const { body, subject } = req.body;
    const file = req.files;
    const emailMatch = body.match(/Email:\s*(\S+)/);
    const email = emailMatch ? emailMatch[1] : null;
    const nameMatch = body.match(/Name:\s*(\S+)/);
    const name = nameMatch ? nameMatch[1] : null;
    console.log(email);
    if (!body) {
      return res
        .status(400)
        .json({ success: false, message: "Body is required" });
    }
    function capitalizeFirstLetter(string) {
      if (!string) return "";
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    const capitalized = capitalizeFirstLetter(name);
    // Create HTML version of the client email
    const htmlMessageToClient = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Boostmysites</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #FFAB23;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-left: 1px solid #dddddd;
            border-right: 1px solid #dddddd;
          }
          .footer {
            background-color: #eeeeee;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 5px 5px;
            border: 1px solid #dddddd;
          }
          .button {
            display: inline-block;
            background-color: #FFAB23;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Boostmysites!</h1>
          </div>
          <div class="content">
            <p>Hi ${capitalized || "there"},</p>
            
            <p>You have been successfully signed up with Boostmysites for starting your AI company with us.</p>
            
            <p>We're excited to have you on board and can't wait to help you bring your AI vision to life!</p>
            
            <p>If you have any questions or need assistance, feel free to reply to this email.</p>
            
            <p>See you onboard soon!</p>
            
            <p>Regards,<br>
            <strong>The Boostmysites Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Boostmysites. All rights reserved.</p>
            <p>This email was sent to ${
              email || "you"
            } because you signed up for our services.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text fallback version
    const messageToClient = `
      Hi ${capitalized || "there"},
      
      You have been successfully signed up with Boostmysites for starting your AI company with us.
      
      We're excited to have you on board and can't wait to help you bring your AI vision to life!
      
      If you have any questions or need assistance, feel free to reply to this email.
      
      See you onboard soon!
      
      Regards,
      The Boostmysites Team
      
      © 2025 Boostmysites. All rights reserved.
          `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "boostmysitescom@gmail.com",
      subject: "Sign Up form details",
      text: body,
    };
    const mailOptions2 = {
      from: process.env.EMAIL_USER,
      to: "remeesreme4u@gmail.com",
      subject: "Sign Up form details",
      text: body,
    };
    const mailOptions4 = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${capitalized}, Welcome to Boostmysites – Your AI Journey Begins!`,
      text: messageToClient,
      html: htmlMessageToClient,
      // headers: {
      //   "List-Unsubscribe": `<mailto:unsubscribe@boostmysites.com?subject=unsubscribe-${email}>`,
      //   Precedence: "bulk",
      // },
    };

    if (file) {
      if (file && file.length > 0) {
        mailOptions.attachments = file.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
        }));
      }
      if (file && file.length > 0) {
        mailOptions2.attachments = file.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
        }));
      }
    }

    // Send the email
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptions2);
    await transporter.sendMail(mailOptions4);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: true,
      message: "Failed to send email: " + error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

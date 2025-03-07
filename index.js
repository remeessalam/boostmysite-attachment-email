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

    const messageToClient = `Hi ${name}, 

                You have been successfully signed up with Boostmysites for starting your AI company with us. 

                See you onboard soon! 

                Regards, 
                Boostmysites`;

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
      subject: "Welcome to Boostmysites – Your AI Journey Begins!",
      text: messageToClient,
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

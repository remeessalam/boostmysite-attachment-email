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

app.post("/api/send-email", upload.single("file"), async (req, res) => {
  try {
    const { body, subject } = req.body;
    const file = req.file;
    console.log(req.body);
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

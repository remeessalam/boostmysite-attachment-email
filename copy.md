const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 8080;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Configure nodemailer
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

// Test route
app.get("/", (req, res) => {
res.send("Hello from the server!");
});

// Email sending endpoint - Changed upload.single('attachment') to upload.single('file')
app.post(
"/api/send-email",
upload.single("file"),
// upload.none(),
async (req, res) => {
try {
const { body } = req.body;
console.log(req.body);
// const mailOptions1 = {
// from: process.env.EMAIL_USER,
// to: "mpranavprem@gmail.com",
// subject: "New Order from - Mudralanka",
// text: body,
// };

      // const mailOptions2 = {
      //   from: process.env.EMAIL_USER,
      //   to: "mahinstlucia@gmail.com",
      //   subject: "New Order from - Mudralanka",
      //   text: body,
      // };

      const mailOptions3 = {
        from: process.env.EMAIL_USER,
        to: "remeesreme4u@gmail.com",
        subject: "New Order from - Mudralanka",
        text: body,
      };

      // Add attachments if files are present
      if (req.files && req.files.length > 0) {
        mailOptions3.attachments = req.files.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
        }));
      }

      // await transporter.sendMail(mailOptions1);
      // await transporter.sendMail(mailOptions2);
      await transporter.sendMail(mailOptions3);

      res.json({
        message: "Email sent successfully!",
        // attachmentCount: req.files ? req.files.length : 0`
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ message: "Failed to send email: " + error.message });
    }

}
);

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const contactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Fill up all the details" });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: true },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Message from RentEase Contact Form",
      html: `
        <h1>Thank you for contacting us!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get
        back to you as soon as possible.</p>
        <p>Here is the message you sent us:</p>
        <p>${message}</p>
        <p>Best regards, RentEase Team</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "message sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send receipt",
      error: error.message,
    });
  }
};

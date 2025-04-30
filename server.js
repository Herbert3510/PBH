require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Root route for Render health check
app.get("/", (req, res) => {
    res.send("🚀 Passion Base Hotel backend is running.");
});

// ✅ Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Handle booking requests
app.post("/send-email", async (req, res) => {
    const { name, phone, email, checkInDate, checkOutDate, roomType } = req.body;

    const bookingDetails = `
        Booking Details:
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        Check-in Date: ${checkInDate}
        Check-out Date: ${checkOutDate}
        Room Type: ${roomType}
    `;

    try {
        // 📩 Email to hotel
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "passionbasehotel@gmail.com",
            subject: "New Booking Request",
            text: bookingDetails
        });

        // 📩 Confirmation email to guest
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Booking Confirmation - Passion Base Hotel",
            text: `Dear ${name},\n\nThank you for your booking at Passion Base Hotel! Here are your details:\n\n${bookingDetails}\n\nWe look forward to welcoming you!\n\nBest regards,\nPassion Base Hotel`
        });

        res.status(200).json({ message: "Emails sent successfully" });

    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Failed to send emails" });
    }
});

// ✅ Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

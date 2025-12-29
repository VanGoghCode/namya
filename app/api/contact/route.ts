import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Configure transporter
    // Note: User needs to provide EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD in .env.local
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: process.env.EMAIL_TO || "vrunda7103@gmail.com",
      subject: `New Inquiry from ${name} (Namya Mehndi)`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Inquiry from Namya Mehndi</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please check server configuration." },
      { status: 500 }
    );
  }
}

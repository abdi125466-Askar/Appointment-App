const nodemailer = require("nodemailer");

/* ======================================================
   CREATE TRANSPORTER (RAILWAY + GMAIL SAFE)
====================================================== */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // IMPORTANT for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // 🔥 IMPORTANT FOR RAILWAY
  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 10000, // avoid hanging
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

/* ======================================================
   VERIFY SMTP (SHOW REAL ERRORS IN LOGS)
====================================================== */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP CONFIG ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

/* ======================================================
   📩 1️⃣ REGISTRATION EMAIL
====================================================== */
const sendAppointmentRegistrationEmail = async ({
  email,
  fullName,
  serviceName,
  appointmentDate,
  appointmentId,
}) => {
  if (!email) return;

  const appName = process.env.APP_NAME || "Appointment System";

  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleString()
    : "";

  const html = `
    <div style="font-family:Arial; max-width:600px;">
      <h2 style="color:#2563EB;">Appointment Registered</h2>

      <p>Hello <strong>${fullName}</strong>,</p>

      <p>Your appointment for <strong>${serviceName}</strong> has been successfully created.</p>

      <p><strong>Date:</strong> ${formattedDate}</p>

      <hr/>

      <p><strong>Your Appointment ID:</strong></p>

      <div style="
        background:#f3f4f6;
        padding:14px;
        font-size:18px;
        font-weight:bold;
        border-radius:6px;
        display:inline-block;
      ">
        ${appointmentId}
      </div>

      <p>Please keep this ID for tracking.</p>

      <br/>
      <p>Regards,<br>${appName} Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Appointment Confirmation - ${appointmentId}`,
      html,
    });

    console.log("📨 Registration email sent to:", email);
  } catch (error) {
    console.error("❌ REGISTRATION EMAIL ERROR:", error);
  }
};

/* ======================================================
   📩 2️⃣ STATUS UPDATE EMAIL
====================================================== */
const sendAppointmentStatusEmail = async ({
  email,
  fullName,
  status,
  serviceName,
  appointmentDate,
  appointmentId,
}) => {
  if (!email) return;

  const appName = process.env.APP_NAME || "Appointment System";

  const statusMessages = {
    PENDING: "Your appointment is currently under review.",
    APPROVED: "Your appointment has been approved.",
    REJECTED: "Your appointment has been rejected.",
    COMPLETED: "Your appointment has been completed.",
    NO_SHOW: "You were marked as no-show.",
    ASSIGNED: "Your appointment has been assigned to an officer.",
  };

  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleString()
    : "";

  const html = `
    <div style="font-family:Arial; max-width:600px;">
      <h2 style="color:#2563EB;">Appointment Status Update</h2>

      <p>Hello <strong>${fullName}</strong>,</p>

      <p>Your appointment for <strong>${serviceName}</strong> has been updated.</p>

      <p><strong>Status:</strong> ${status}</p>
      <p>${statusMessages[status] || ""}</p>

      <p><strong>Date:</strong> ${formattedDate}</p>

      <hr/>

      <p><strong>Appointment ID:</strong></p>

      <div style="
        background:#f3f4f6;
        padding:14px;
        font-size:18px;
        font-weight:bold;
        border-radius:6px;
        display:inline-block;
      ">
        ${appointmentId}
      </div>

      <br/><br/>
      <p>Regards,<br>${appName} Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Appointment Status Updated - ${appointmentId}`,
      html,
    });

    console.log("📨 Status email sent to:", email);
  } catch (error) {
    console.error("❌ STATUS EMAIL ERROR:", error);
  }
};

module.exports = {
  sendAppointmentRegistrationEmail,
  sendAppointmentStatusEmail,
};
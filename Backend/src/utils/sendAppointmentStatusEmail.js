// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Verify once
// transporter.verify((error) => {
//   if (error) {
//     console.error("❌ SMTP configuration error:", error.message);
//   } else {
//     console.log("✅ SMTP server ready");
//   }
// });

// /* ======================================================
//    📩 1️⃣ REGISTRATION EMAIL (When creating appointment)
// ====================================================== */
// const sendAppointmentRegistrationEmail = async ({
//   email,
//   fullName,
//   serviceName,
//   appointmentDate,
//   appointmentId,
// }) => {
//   if (!email) return;

//   const appName = process.env.APP_NAME || "Appointment System";

//   const formattedDate = appointmentDate
//     ? new Date(appointmentDate).toLocaleString()
//     : "";

//   const html = `
//     <div style="font-family:Arial; max-width:600px;">
//       <h2 style="color:#4F46E5;">Appointment Registered</h2>

//       <p>Hello <strong>${fullName}</strong>,</p>

//       <p>Your appointment for <strong>${serviceName}</strong> has been successfully created.</p>

//       <p><strong>Date:</strong> ${formattedDate}</p>

//       <hr/>

//       <p><strong>Your Appointment ID:</strong></p>

//       <div style="
//         background:#f3f4f6;
//         padding:14px;
//         font-size:18px;
//         font-weight:bold;
//         border-radius:6px;
//         display:inline-block;
//       ">
//         ${appointmentId}
//       </div>

//       <p>Please keep this ID for tracking.</p>

//       <br/>
//       <p>Regards,<br>${appName} Team</p>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"${appName}" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: `Appointment Confirmation - ${appointmentId}`,
//     html,
//   });

//   console.log("📨 Registration email sent to:", email);
// };

// /* ======================================================
//    📩 2️⃣ STATUS UPDATE EMAIL
// ====================================================== */
// const sendAppointmentStatusEmail = async ({
//   email,
//   fullName,
//   status,
//   serviceName,
//   appointmentDate,
//   appointmentId,
// }) => {
//   if (!email) return;

//   const appName = process.env.APP_NAME || "Appointment System";

//   const statusMessages = {
//     PENDING: "Your appointment is currently under review.",
//     APPROVED: "Your appointment has been approved.",
//     REJECTED: "Your appointment has been rejected.",
//     COMPLETED: "Your appointment has been completed.",
//     NO_SHOW: "You were marked as no-show.",
//     ASSIGNED: "Your appointment has been assigned to an officer.",
//   };

//   const formattedDate = appointmentDate
//     ? new Date(appointmentDate).toLocaleString()
//     : "";

//   const html = `
//     <div style="font-family:Arial; max-width:600px;">
//       <h2 style="color:#4F46E5;">Appointment Status Update</h2>

//       <p>Hello <strong>${fullName}</strong>,</p>

//       <p>Your appointment for <strong>${serviceName}</strong> has been updated.</p>

//       <p><strong>Status:</strong> ${status}</p>
//       <p>${statusMessages[status] || ""}</p>

//       <p><strong>Date:</strong> ${formattedDate}</p>

//       <hr/>

//       <p><strong>Appointment ID:</strong></p>
//       <div style="
//         background:#f3f4f6;
//         padding:14px;
//         font-size:18px;
//         font-weight:bold;
//         border-radius:6px;
//         display:inline-block;
//       ">
//         ${appointmentId}
//       </div>

//       <br/><br/>
//       <p>Regards,<br>${appName} Team</p>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"${appName}" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: `Appointment Status Updated - ${appointmentId}`,
//     html,
//   });

//   console.log("📨 Status email sent to:", email);
// };

// module.exports = {
//   sendAppointmentRegistrationEmail,
//   sendAppointmentStatusEmail,
// };
const nodemailer = require("nodemailer");

/* ======================================================
   CREATE TRANSPORTER (NO verify() here)
====================================================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000, // prevent hanging
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

/* ======================================================
   INTERNAL SAFE SEND FUNCTION (NON-BLOCKING)
====================================================== */
const safeSendMail = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.error("❌ Email send error:", error.message);
  }
};

/* ======================================================
   📩 1️⃣ REGISTRATION EMAIL
====================================================== */
const sendAppointmentRegistrationEmail = ({
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
      <h2 style="color:#4F46E5;">Appointment Registered</h2>

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

  // 🔥 Non-blocking
  setImmediate(() => {
    safeSendMail({
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Appointment Confirmation - ${appointmentId}`,
      html,
    });
  });
};

/* ======================================================
   📩 2️⃣ STATUS UPDATE EMAIL
====================================================== */
const sendAppointmentStatusEmail = ({
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
      <h2 style="color:#4F46E5;">Appointment Status Update</h2>

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

  // 🔥 Non-blocking
  setImmediate(() => {
    safeSendMail({
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Appointment Status Updated - ${appointmentId}`,
      html,
    });
  });
};

module.exports = {
  sendAppointmentRegistrationEmail,
  sendAppointmentStatusEmail,
};
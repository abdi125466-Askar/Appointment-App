
// import React from "react";
// import ProtectedRoute from "./ProtectedRoute";

// // ================= USER PAGES =================
// import Login from "../pages/user/Login";
// import Profile from "../pages/user/Profile";
// import Users from "../pages/user/Users";

// // ================= CUSTOMER PAGES =================
// import Customers from "../pages/customer/Customers";
// import CreateAppointment from "../pages/customer/CreateAppointment";
// import PendingAppointments from "../pages/customer/PendingAppointments";
// import ApprovedAppointments from "../pages/customer/ApprovedAppointments";
// import CompletedAppointments from "../pages/customer/CompletedAppointments";

// // ================= SERVICE PAGES (DASHBOARD) =================
// import Services from "../pages/Service/Services";

// // ================= EMPLOYEE =================
// import EmployeeDashboard from "../pages/Employee/EmployeeDashboard";

// // ================= PUBLIC =================
// import PublicAppointmentPage from "../pages/Public/PublicAppointmentPage";
// import PublicLayout from "../layouts/PublicLayout";
// import LandingPage from "../pages/Public/LandingPage";
// import PublicServicesPage from "../pages/Public/PublicServicesPage";
// import PublicTrackPage from "../pages/Public/PublicTrackPage";
// import AboutPage from "../pages/Public/AboutPage";
// import PrivacyPage from "../pages/Public/PrivacyPage";
// import TermsPage from "../pages/Public/TermsPage";
// import SupportPage from "../pages/Public/SupportPage";
// import UnauthorizedPage from "../pages/Public/UnauthorizedPage";

// // ================= LAYOUT =================
// import DashboardLayout from "../layouts/DashboardLayout";
// import Dashboard from "../Components/Dashboard";

// const systemRoutes = [
//   /* ======================
//      🔓 PUBLIC ROUTES
//   ====================== */
//   {
//     element: <PublicLayout />,
//     children: [
//       { index: true, element: <LandingPage /> }, // "/"
//       { path: "/services", element: <PublicServicesPage /> },
//       { path: "/track", element: <PublicTrackPage /> },
//       { path: "/about", element: <AboutPage /> },

//       // Footer pages
//       { path: "/privacy", element: <PrivacyPage /> },
//       { path: "/terms", element: <TermsPage /> },
//       { path: "/support", element: <SupportPage /> },

//       // Booking
//       { path: "/book", element: <PublicAppointmentPage /> },

//       // Unauthorized
//       { path: "/unauthorized", element: <UnauthorizedPage /> },
//     ],
//   },

//   // Login (public)
//   { path: "/login", element: <Login /> },

//   /* ======================
//      🔐 PROTECTED ROUTES
//   ====================== */
//   {
//     element: (
//       <ProtectedRoute allowedRoles={["SUPERADMIN", "ADMIN", "STAFF", "USER"]} />
//     ),
//     children: [
//       {
//         path: "/dashboard",
//         element: <DashboardLayout />,
//         children: [
//           { index: true, element: <Dashboard /> },

//           // USER
//           { path: "profile", element: <Profile /> },
//           { path: "users", element: <Users /> },

//           // MANAGEMENT
//           { path: "customers", element: <Customers /> },
//           { path: "services", element: <Services /> },

//           // APPOINTMENTS
//           { path: "create-appointment", element: <CreateAppointment /> },
//           { path: "pending-appointments", element: <PendingAppointments /> },
//           { path: "approved-appointments", element: <ApprovedAppointments /> },
//           { path: "completed-appointments", element: <CompletedAppointments /> },

//           // STAFF
//           { path: "employee", element: <EmployeeDashboard /> },
//         ],
//       },
//     ],
//   },
// ];

// export default systemRoutes;

import React from "react";
import ProtectedRoute from "./ProtectedRoute";

// ================= USER PAGES =================
import Login from "../pages/user/Login";
import Profile from "../pages/user/Profile";
import Users from "../pages/user/Users";

// ================= CUSTOMER PAGES =================
import Customers from "../pages/customer/Customers";
import CreateAppointment from "../pages/customer/CreateAppointment";
import PendingAppointments from "../pages/customer/PendingAppointments";
import ApprovedAppointments from "../pages/customer/ApprovedAppointments";
import CompletedAppointments from "../pages/customer/CompletedAppointments";

// ✅ NEW PAGES
import RejectedAppointments from "../pages/customer/RejectedAppointments";
import NoShowAppointments from "../pages/customer/NoShowAppointments";

// ================= SERVICE PAGES (DASHBOARD) =================
import Services from "../pages/Service/Services";

// ================= EMPLOYEE =================
import EmployeeDashboard from "../pages/Employee/EmployeeDashboard";

// ================= PUBLIC =================
import PublicAppointmentPage from "../pages/Public/PublicAppointmentPage";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/Public/LandingPage";
import PublicServicesPage from "../pages/Public/PublicServicesPage";
import PublicTrackPage from "../pages/Public/PublicTrackPage";
import AboutPage from "../pages/Public/AboutPage";
import PrivacyPage from "../pages/Public/PrivacyPage";
import TermsPage from "../pages/Public/TermsPage";
import SupportPage from "../pages/Public/SupportPage";
import UnauthorizedPage from "../pages/Public/UnauthorizedPage";

// ================= LAYOUT =================
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../Components/Dashboard";
import UsersProgress from "../pages/user/UsersProgress";

const systemRoutes = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "/services", element: <PublicServicesPage /> },
      { path: "/track", element: <PublicTrackPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/support", element: <SupportPage /> },
      { path: "/book", element: <PublicAppointmentPage /> },
      { path: "/unauthorized", element: <UnauthorizedPage /> },
    ],
  },

  { path: "/login", element: <Login /> },

  {
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN", "ADMIN", "STAFF", "USER"]} />
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },

          { path: "profile", element: <Profile /> },
          { path: "users", element: <Users /> },
            { path: "progress", element: <UsersProgress /> },

          { path: "customers", element: <Customers /> },
          { path: "services", element: <Services /> },

          { path: "create-appointment", element: <CreateAppointment /> },
          { path: "pending-appointments", element: <PendingAppointments /> },
          { path: "approved-appointments", element: <ApprovedAppointments /> },
          { path: "completed-appointments", element: <CompletedAppointments /> },

          // ✅ NEW ROUTES
          { path: "rejected-appointments", element: <RejectedAppointments /> },
          { path: "no-show-appointments", element: <NoShowAppointments /> },

          { path: "employee", element: <EmployeeDashboard /> },
        ],
      },
    ],
  },
];

export default systemRoutes;


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

// // ================= SERVICE PAGES =================
// import Services from "../pages/Service/Services";

// // ================= EMPLOYEE =================
// import EmployeeDashboard from "../pages/Employee/EmployeeDashboard";

// // ================= PUBLIC =================
// import PublicAppointmentPage from "../pages/Public/PublicAppointmentPage";

// // ================= LAYOUT =================
// import DashboardLayout from "../layouts/DashboardLayout";
// import Dashboard from "../Components/Dashboard";

// const systemRoutes = [
//   /* =====================================================
//      🔓 PUBLIC ROUTES
//   ===================================================== */
//   {
//     path: "/",
//     element: <PublicAppointmentPage />, // ✅ FIRST PAGE
//   },

//   {
//     path: "/login",
//     element: <Login />, // ✅ LOGIN PAGE
//   },

//   /* =====================================================
//      🔐 PROTECTED ROUTES
//   ===================================================== */
//   {
//     element: (
//       <ProtectedRoute
//         allowedRoles={["SUPERADMIN", "ADMIN", "STAFF", "USER"]}
//       />
//     ),
//     children: [
//       {
//         path: "/dashboard",
//         element: <DashboardLayout />,
//         children: [
//           { index: true, element: <Dashboard /> },

//           // ✅ USER
//           { path: "profile", element: <Profile /> },
//           { path: "users", element: <Users /> },

//           // ✅ MANAGEMENT
//           { path: "customers", element: <Customers /> },
//           { path: "services", element: <Services /> },

//           // ✅ APPOINTMENTS
//           { path: "create-appointment", element: <CreateAppointment /> },
//           { path: "pending-appointments", element: <PendingAppointments /> },
//           { path: "approved-appointments", element: <ApprovedAppointments /> },
//           { path: "completed-appointments", element: <CompletedAppointments /> },

//           // ✅ STAFF
//           { path: "employee", element: <EmployeeDashboard /> },
//         ],
//       },
//     ],
//   },
// ];

// export default systemRoutes;

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

// ================= SERVICE PAGES (DASHBOARD) =================
import Services from "../pages/Service/Services";

// ================= EMPLOYEE =================
import EmployeeDashboard from "../pages/Employee/EmployeeDashboard";

// ================= PUBLIC (EXISTING) =================
import PublicAppointmentPage from "../pages/Public/PublicAppointmentPage";

// ✅ NEW PUBLIC PAGES + LAYOUT
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/Public/LandingPage";
import PublicServicesPage from "../pages/Public/PublicServicesPage";
import PublicTrackPage from "../pages/Public/PublicTrackPage";
import AboutPage from "../pages/Public/AboutPage";

// ================= LAYOUT =================
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../Components/Dashboard";

const systemRoutes = [
  /* =====================================================
     🔓 PUBLIC ROUTES
  ===================================================== */
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> }, // ✅ NEW LANDING "/"
      { path: "/services", element: <PublicServicesPage /> },
      { path: "/track", element: <PublicTrackPage /> },
      { path: "/about", element: <AboutPage /> },

      // ✅ OLD PublicAppointmentPage moved here
      { path: "/book", element: <PublicAppointmentPage /> },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  /* =====================================================
     🔐 PROTECTED ROUTES
  ===================================================== */
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

          // ✅ USER
          { path: "profile", element: <Profile /> },
          { path: "users", element: <Users /> },

          // ✅ MANAGEMENT
          { path: "customers", element: <Customers /> },
          { path: "services", element: <Services /> },

          // ✅ APPOINTMENTS
          { path: "create-appointment", element: <CreateAppointment /> },
          { path: "pending-appointments", element: <PendingAppointments /> },
          { path: "approved-appointments", element: <ApprovedAppointments /> },
          { path: "completed-appointments", element: <CompletedAppointments /> },

          // ✅ STAFF
          { path: "employee", element: <EmployeeDashboard /> },
        ],
      },
    ],
  },
];

export default systemRoutes;

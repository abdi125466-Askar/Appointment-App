// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const { token, user, loading } = useSelector((state) => state.auth);

//   // ⏳ Wait until auth bootstrap finishes
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   // 🔐 Not logged in
//   if (!token || !user) {
//     return <Navigate to="/" replace />;
//   }

//   // 🛑 Role-based protection
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const { token, user, loading } = useSelector((state) => state.auth);

//   /* ⏳ Wait for auth rehydration */
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   /* 🔐 Not authenticated */
//   if (!token || !user) {
//     return <Navigate to="/" replace />;
//   }

//   /* 🛂 Role-based authorization */
//   if (
//     Array.isArray(allowedRoles) &&
//     !allowedRoles.includes(user.role)
//   ) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   /* ✅ Access granted */
//   return <Outlet />;
// };

// export default ProtectedRoute;



import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { token, user, loading } = useSelector((state) => state.auth);

  // ⏳ Wait for auth rehydration
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200 font-semibold">
        Loading...
      </div>
    );
  }

  // 🔐 Not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🛂 Role-based authorization
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = user?.role;
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ Access granted
  return <Outlet />;
}
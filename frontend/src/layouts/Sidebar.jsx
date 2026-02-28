// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   UserSquare2,
//   Wrench,
//   PlusCircle,
//   Clock,
//   CheckCircle,
//   CheckCircle2,
//   IdCardLanyard,
//   X,
//   LogOut,
// } from "lucide-react";

// export default function Sidebar({
//   mobileOpen,
//   setMobileOpen,
//   isAdmin,
//   isStaff,
//   isUser,
//   unreadCounts,
//   handleNavClick,
//   handleLogout,
// }) {
//   return (
//     <>
//       {mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
//         />
//       )}

//       <aside
//         className={`
//           fixed lg:sticky top-0 left-0 z-40
//           w-72 bg-slate-900 text-slate-300
//           flex flex-col h-screen shadow-2xl shadow-slate-900/50
//           transform transition-transform duration-300 ease-in-out
//           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0 border-r border-slate-800
//         `}
//       >
//         {/* LOGO HEADER */}
//         <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
//               <CheckCircle className="text-white" size={24} />
//             </div>
//             <h1 className="text-xl font-black text-white tracking-tight">
//               Appoint<span className="text-blue-500">ify</span>
//             </h1>
//           </div>

//           <button
//             className="lg:hidden text-slate-400 hover:text-white transition-colors"
//             onClick={() => setMobileOpen(false)}
//           >
//             <X />
//           </button>
//         </div>

//         {/* NAVIGATION SCROLL AREA */}
//         <nav className="flex-1 p-4 space-y-6 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {isAdmin && (
//             <>
//               <Section title="Management">
//                 <NavItem
//                   to="/dashboard"
//                   icon={<LayoutDashboard size={20} />}
//                   label="Dashboard"
//                   onNav={() => handleNavClick(null)}
//                 />
//                 <NavItem
//                   to="/dashboard/users"
//                   icon={<Users size={20} />}
//                   label="Users"
//                   onNav={() => handleNavClick(null)}
//                 />
//                 <NavItem
//                   to="/dashboard/customers"
//                   icon={<UserSquare2 size={20} />}
//                   label="Customers"
//                   badge={unreadCounts.CUSTOMERS}
//                   onNav={() => handleNavClick("CUSTOMERS")}
//                 />
//                 <NavItem
//                   to="/dashboard/services"
//                   icon={<Wrench size={20} />}
//                   label="Services"
//                   badge={unreadCounts.SERVICES}
//                   onNav={() => handleNavClick("SERVICES")}
//                 />
//               </Section>

//               <Section title="Appointments">
//                 <NavItem
//                   to="/dashboard/create-appointment"
//                   icon={<PlusCircle size={20} />}
//                   label="New Booking"
//                   badge={unreadCounts.BOOKINGS}
//                   onNav={() => handleNavClick("BOOKINGS")}
//                 />

//                 <NavItem
//                   to="/dashboard/pending-appointments"
//                   icon={<Clock size={20} />}
//                   label="Pending"
//                   badge={unreadCounts.PENDING}
//                   onNav={() => handleNavClick("PENDING")}
//                 />

//                 <NavItem
//                   to="/dashboard/approved-appointments"
//                   icon={<CheckCircle size={20} />}
//                   label="Approved"
//                   badge={unreadCounts.APPROVED}
//                   onNav={() => handleNavClick("APPROVED")}
//                 />

//                 <NavItem
//                   to="/dashboard/completed-appointments"
//                   icon={<CheckCircle2 size={20} />}
//                   label="Completed"
//                   badge={unreadCounts.COMPLETED}
//                   onNav={() => handleNavClick("COMPLETED")}
//                 />
//               </Section>

//               <Section title="Staff">
//                 <NavItem
//                   to="/dashboard/employee"
//                   icon={<IdCardLanyard size={20} />}
//                   label="Employee Dashboard"
//                   onNav={() => handleNavClick(null)}
//                 />
//               </Section>
//             </>
//           )}

//           {isStaff && (
//             <Section title="Staff Area">
//               <NavItem
//                 to="/dashboard/customers"
//                 icon={<UserSquare2 size={20} />}
//                 label="Customers"
//                 onNav={() => handleNavClick(null)}
//               />
//               <NavItem
//                 to="/dashboard/create-appointment"
//                 icon={<PlusCircle size={20} />}
//                 label="New Booking"
//                 onNav={() => handleNavClick(null)}
//               />
//               <NavItem
//                 to="/dashboard/employee"
//                 icon={<IdCardLanyard size={20} />}
//                 label="Employee Dashboard"
//                 onNav={() => handleNavClick(null)}
//               />
//             </Section>
//           )}

//           {isUser && (
//             <Section title="My Area">
//               <NavItem
//                 to="/dashboard/employee"
//                 icon={<Clock size={20} />}
//                 label="My Dashboard"
//                 onNav={() => handleNavClick(null)}
//               />
//             </Section>
//           )}
//         </nav>

//         {/* FOOTER */}
//         <div className="p-4 border-t border-slate-800 bg-slate-900">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold transition-all duration-200 group"
//           >
//             <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
//             Sign Out
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// /* --- Styled Helpers --- */
// function Section({ title, children }) {
//   return (
//     <div>
//       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-4">
//         {title}
//       </p>
//       <div className="space-y-1">{children}</div>
//     </div>
//   );
// }

// function NavItem({ to, label, icon, onNav, badge }) {
//   return (
//     <NavLink
//       to={to}
//       onClick={onNav}
//       end
//       className={({ isActive }) =>
//         `relative flex items-center justify-between gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300
//         ${
//           isActive
//             ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
//             : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
//         }`
//       }
//     >
//       <div className="flex items-center gap-4">
//         <span>{icon}</span>
//         {label}
//       </div>

//       {typeof badge === "number" && badge > 0 && (
//         <span className="min-w-[24px] h-6 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center bg-rose-500 text-white shadow-sm border border-slate-900">
//           {badge}
//         </span>
//       )}
//     </NavLink>
//   );
// }

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Wrench,
  PlusCircle,
  Clock,
  CheckCircle,
  CheckCircle2,
  IdCardLanyard,
  X,
  LogOut,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  isAdmin,
  isStaff,
  isUser,
  unreadCounts,
  handleNavClick,
  handleLogout,
}) {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          w-72 bg-slate-900 text-slate-300
          flex flex-col h-screen shadow-2xl shadow-slate-900/50
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 border-r border-slate-800
        `}
      >
        {/* LOGO HEADER */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <CheckCircle className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Appoint<span className="text-blue-500">ify</span>
            </h1>
          </div>

          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isAdmin && (
            <>
              <Section title="Management">
                <NavItem
                  to="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  onNav={() => handleNavClick(null)}
                />
                <NavItem
                  to="/dashboard/users"
                  icon={<Users size={20} />}
                  label="Users"
                  onNav={() => handleNavClick(null)}
                />
                        <NavItem
                  to="/dashboard/progress"
                  icon={<Users size={20} />}
                  label="User-Progress"
                  onNav={() => handleNavClick(null)}
                />
                <NavItem
                  to="/dashboard/customers"
                  icon={<UserSquare2 size={20} />}
                  label="Customers"
                  badge={unreadCounts.CUSTOMERS}
                  onNav={() => handleNavClick("CUSTOMERS")}
                />
                <NavItem
                  to="/dashboard/services"
                  icon={<Wrench size={20} />}
                  label="Services"
                  badge={unreadCounts.SERVICES}
                  onNav={() => handleNavClick("SERVICES")}
                />
              </Section>

              <Section title="Appointments">
                <NavItem
                  to="/dashboard/create-appointment"
                  icon={<PlusCircle size={20} />}
                  label="New Booking"
                  badge={unreadCounts.BOOKINGS}
                  onNav={() => handleNavClick("BOOKINGS")}
                />

                <NavItem
                  to="/dashboard/pending-appointments"
                  icon={<Clock size={20} />}
                  label="Pending"
                  badge={unreadCounts.PENDING}
                  onNav={() => handleNavClick("PENDING")}
                />

                <NavItem
                  to="/dashboard/approved-appointments"
                  icon={<CheckCircle size={20} />}
                  label="Approved"
                  badge={unreadCounts.APPROVED}
                  onNav={() => handleNavClick("APPROVED")}
                />

                <NavItem
                  to="/dashboard/completed-appointments"
                  icon={<CheckCircle2 size={20} />}
                  label="Completed"
                  badge={unreadCounts.COMPLETED}
                  onNav={() => handleNavClick("COMPLETED")}
                />

                {/* ✅ NEW */}
                <NavItem
                  to="/dashboard/rejected-appointments"
                  icon={<XCircle size={20} />}
                  label="Rejected"
                  badge={unreadCounts.REJECTED}
                  onNav={() => handleNavClick("REJECTED")}
                />

                <NavItem
                  to="/dashboard/no-show-appointments"
                  icon={<AlertTriangle size={20} />}
                  label="No Show"
                  badge={unreadCounts.NO_SHOW}
                  onNav={() => handleNavClick("NO_SHOW")}
                />
              </Section>

              <Section title="Staff">
                <NavItem
                  to="/dashboard/employee"
                  icon={<IdCardLanyard size={20} />}
                  label="Employee Dashboard"
                  onNav={() => handleNavClick(null)}
                />
              </Section>
            </>
          )}

          {isStaff && (
            <Section title="Staff Area">
              <NavItem
                to="/dashboard/customers"
                icon={<UserSquare2 size={20} />}
                label="Customers"
                onNav={() => handleNavClick(null)}
              />
              <NavItem
                to="/dashboard/create-appointment"
                icon={<PlusCircle size={20} />}
                label="New Booking"
                onNav={() => handleNavClick(null)}
              />
              <NavItem
                to="/dashboard/employee"
                icon={<IdCardLanyard size={20} />}
                label="Employee Dashboard"
                onNav={() => handleNavClick(null)}
              />
            </Section>
          )}

          {isUser && (
            <Section title="My Area">
              <NavItem
                to="/dashboard/employee"
                icon={<Clock size={20} />}
                label="My Dashboard"
                onNav={() => handleNavClick(null)}
              />
            </Section>
          )}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-4">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ to, label, icon, onNav, badge }) {
  return (
    <NavLink
      to={to}
      onClick={onNav}
      end
      className={({ isActive }) =>
        `relative flex items-center justify-between gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300
        ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        }`
      }
    >
      <div className="flex items-center gap-4">
        <span>{icon}</span>
        {label}
      </div>

      {typeof badge === "number" && badge > 0 && (
        <span className="min-w-[24px] h-6 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center bg-rose-500 text-white shadow-sm border border-slate-900">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
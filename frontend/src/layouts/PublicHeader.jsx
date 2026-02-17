// import { NavLink, Link } from "react-router-dom";
// import { Bell } from "lucide-react";

// const navClass = ({ isActive }) =>
//   `px-3 py-2 rounded-lg text-sm font-semibold transition ${
//     isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
//   }`;

// export default function PublicHeader() {
//   return (
//     <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
//       <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">

//         {/* 🔥 Logo + Brand (Perfect Alignment) */}
//         {/* 🔥 Logo + Brand */}
// <Link to="/" className="flex items-center">

//   <img
//     src="/logo.png"
//     alt="Logo"
//     className="h-20 w-auto object-contain"
//   />

//   <span className="-ml-2 relative -top-[3px] text-xl md:text-2xl font-black text-slate-900 leading-none">
//     Appoint<span className="text-emerald-500">ify</span>
//   </span>

// </Link>

//         {/* Navigation */}
//         <nav className="hidden md:flex items-center gap-2">
//           <NavLink to="/" className={navClass}>Home</NavLink>
//           <NavLink to="/services" className={navClass}>Services</NavLink>
//           <NavLink to="/track" className={navClass}>Track</NavLink>
//           <NavLink to="/about" className={navClass}>About Us</NavLink>
//         </nav>

//         {/* Right Side */}
//         <div className="flex items-center gap-3">
//           <button
//             className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white/60 hover:bg-white transition"
//           >
//             <Bell className="text-slate-500" size={18} />
//           </button>

//           <Link
//             to="/login"
//             className="px-5 py-2 rounded-xl bg-blue-600 text-white font-black text-sm shadow-md hover:brightness-95 transition"
//           >
//             Admin Login
//           </Link>
//         </div>

//       </div>
//     </header>
//   );
// }

import { NavLink, Link } from "react-router-dom";
import { Bell } from "lucide-react";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-semibold transition ${
    isActive ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
  }`;

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-auto object-contain"
          />
          <span className="-ml-2 relative -top-[3px] text-xl md:text-2xl font-black text-slate-900 leading-none">
            Appoint<span className="text-emerald-500">ify</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/services" className={navClass}>Services</NavLink>
          <NavLink to="/track" className={navClass}>Track</NavLink>
          <NavLink to="/about" className={navClass}>About Us</NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex w-10 h-10 rounded-xl border border-slate-200 bg-white/60 hover:bg-white">
            <Bell size={18} className="text-slate-500" />
          </button>

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-black text-sm shadow-md hover:brightness-95"
          >
            Admin Login
          </Link>
        </div>

      </div>
    </header>
  );
}


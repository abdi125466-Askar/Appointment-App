import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/slices/userSlices/authSlice";
import axios from "axios";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

// Import extracted components
import Sidebar from "./Sidebar";
import Header from "./Header";

const SEEN_KEY = "appointment_app_seen_counts_v1";

/* =========================
  LocalStorage helpers
========================= */
function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}
function writeSeen(obj) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(obj));
  } catch {}
}

/* =========================
  Time ago helper
========================= */
function timeAgo(input) {
  if (!input) return "Just now";
  if (typeof input === "string" && /ago|just now/i.test(input)) return input;

  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "Just now";

  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);

  if (sec < 10) return "Just now";
  if (sec < 60) return `${sec}s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

/* =========================
  Notification mapping
========================= */
function defaultTitle(status) {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return "New pending appointment";
    case "APPROVED":
      return "Appointment approved";
    case "COMPLETED":
      return "Appointment completed";
    case "CUSTOMERS":
      return "New customer added";
    case "BOOKINGS":
      return "New booking created";
    case "SERVICES":
      return "Service provided";
    default:
      return "New update";
  }
}

function defaultDesc(status) {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return "Appointment cusub ayaa yimid oo pending ah.";
    case "APPROVED":
      return "Mid ka mid ah appointments waa la approved gareeyay.";
    case "COMPLETED":
      return "Appointment ayaa la completed gareeyay.";
    case "CUSTOMERS":
      return "Customer cusub ayaa la diiwaan geliyay.";
    case "BOOKINGS":
      return "Booking cusub ayaa la sameeyay.";
    case "SERVICES":
      return "Customer ayaa service la siiyay.";
    default:
      return "Update cusub ayaa yimid.";
  }
}

function defaultTo(status) {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return "/dashboard/pending-appointments";
    case "APPROVED":
      return "/dashboard/approved-appointments";
    case "COMPLETED":
      return "/dashboard/completed-appointments";
    case "CUSTOMERS":
      return "/dashboard/customers";
    case "BOOKINGS":
      return "/dashboard/create-appointment";
    case "SERVICES":
      return "/dashboard/services";
    default:
      return "/dashboard";
  }
}

function getInitials(name) {
  const n = (name || "").trim();
  if (!n) return "U";
  const parts = n.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user, loading } = useSelector((state) => state.auth);

  const API_BASE =
    import.meta?.env?.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000";

  /* ✅ Hooks before any return */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // ✅ profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  /* =========================
    Counts from backend (TOTALS)
  ========================= */
  const [serverCounts, setServerCounts] = useState({
    PENDING: 0,
    APPROVED: 0,
    COMPLETED: 0,
    CUSTOMERS: 0,
    BOOKINGS: 0,
    SERVICES: 0,
  });

  /* =========================
    Seen counts (local)
  ========================= */
  const [seenCounts, setSeenCounts] = useState(() => readSeen());

  /* =========================
    Dropdown updates from backend (admin only)
  ========================= */
  const [notifications, setNotifications] = useState([]);

  /* ✅ Safe returns after hooks */
  if (loading) return null;
  if (!token || !user) return <Navigate to="/" replace />;

  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
  const isStaff = user.role === "STAFF";
  const isUser = user.role === "USER";

  const displayName = user.fullName || user.name || user.username || "User";
  const initials = getInitials(displayName);

  // ✅ avatar url
  const avatarUrl = useMemo(() => {
    const v = user?.avatarUrl || "";
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    // if backend returns "/uploads/avatars/xxx.png"
    return `${API_BASE}${v}`;
  }, [user?.avatarUrl, API_BASE]);

  /* =========================
    Unread = max(server - seen, 0)
  ========================= */
  const unreadCounts = useMemo(() => {
    const keys = [
      "PENDING",
      "APPROVED",
      "COMPLETED",
      "CUSTOMERS",
      "BOOKINGS",
      "SERVICES",
    ];

    const out = {};
    for (const k of keys) {
      const s = Number(serverCounts[k] || 0);
      const seen = Number(seenCounts[k] || 0);
      out[k] = Math.max(s - seen, 0);
    }
    return out;
  }, [serverCounts, seenCounts]);

  const totalUnread = useMemo(() => {
    return (
      (unreadCounts.PENDING || 0) +
      (unreadCounts.APPROVED || 0) +
      (unreadCounts.COMPLETED || 0) +
      (unreadCounts.CUSTOMERS || 0) +
      (unreadCounts.BOOKINGS || 0) +
      (unreadCounts.SERVICES || 0)
    );
  }, [unreadCounts]);

  /* =========================
    Mark as seen helper
  ========================= */
  const markSeen = useCallback(
    (key) => {
      setSeenCounts((prev) => {
        const next = {
          ...prev,
          [key]: Number(serverCounts[key] || 0),
        };
        writeSeen(next);
        return next;
      });
    },
    [serverCounts]
  );

  /* =========================
    ✅ Fetch counts + updates (ADMIN only)
  ========================= */
  const fetchCounts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/dashboard/counts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (data?.success && data?.data) {
        setServerCounts((prev) => ({
          ...prev,
          PENDING: Number(data.data.PENDING || 0),
          APPROVED: Number(data.data.APPROVED || 0),
          COMPLETED: Number(data.data.COMPLETED || 0),
          CUSTOMERS: Number(data.data.CUSTOMERS || prev.CUSTOMERS || 0),
          BOOKINGS: Number(data.data.BOOKINGS || prev.BOOKINGS || 0),
          SERVICES: Number(data.data.SERVICES || prev.SERVICES || 0),
        }));
      }
    } catch (err) {
      console.log("Counts error:", err?.response?.data || err?.message);
    }
  }, [API_BASE, token]);

  const fetchUpdates = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/dashboard/updates`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const arr = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      const normalized = arr.map((n, idx) => {
        const status = (n.status || n.type || "").toUpperCase() || "PENDING";
        const createdAt = n.createdAt || n.updatedAt || n.time || n.date;
        return {
          id: n.id || n._id || `${status}-${idx}`,
          status,
          title: n.title || defaultTitle(status),
          desc: n.desc || n.message || defaultDesc(status),
          time: timeAgo(createdAt),
          to: n.to || n.link || defaultTo(status),
        };
      });

      setNotifications(normalized);
    } catch {
      setNotifications([]);
    }
  }, [API_BASE, token]);

  /* =========================
    ✅ POLLING (ADMIN only)
  ========================= */
  useEffect(() => {
    if (!token) return;
    if (!isAdmin) return;

    fetchCounts();
    fetchUpdates();

    const id = setInterval(() => {
      fetchCounts();
      fetchUpdates();
    }, 10000);

    return () => clearInterval(id);
  }, [token, isAdmin, fetchCounts, fetchUpdates]);

  /* =========================
    ✅ Bell open => refresh (ADMIN only)
  ========================= */
  useEffect(() => {
    if (!token) return;
    if (!isAdmin) return;
    if (notifOpen) {
      fetchCounts();
      fetchUpdates();
    }
  }, [notifOpen, token, isAdmin, fetchCounts, fetchUpdates]);

  /* =========================
    Auto mark as seen when user visits page
  ========================= */
  useEffect(() => {
    if (!isAdmin) return;

    const path = location.pathname;
    const matchAndMark = (key, match) => {
      if (path.includes(match)) markSeen(key);
    };

    matchAndMark("PENDING", "/dashboard/pending-appointments");
    matchAndMark("APPROVED", "/dashboard/approved-appointments");
    matchAndMark("COMPLETED", "/dashboard/completed-appointments");
    matchAndMark("CUSTOMERS", "/dashboard/customers");
    matchAndMark("BOOKINGS", "/dashboard/create-appointment");
    matchAndMark("SERVICES", "/dashboard/services");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, serverCounts, markSeen, isAdmin]);

  /* =========================
    Close profile dropdown on outside click / Esc
  ========================= */
  useEffect(() => {
    const onDown = (e) => {
      if (!profileOpen) return;
      if (e.key === "Escape") setProfileOpen(false);
    };

    const onClick = (e) => {
      if (!profileOpen) return;
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("mousedown", onClick);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const handleNotifClick = (to, status) => {
    setNotifOpen(false);
    if (status) markSeen(status);
    navigate(to);
  };

  const handleNavClick = (key) => {
    if (key) markSeen(key);
    setMobileOpen(false);
  };

  const goProfile = () => {
    setProfileOpen(false);
    navigate("/dashboard/profile");
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isAdmin={isAdmin}
        isStaff={isStaff}
        isUser={isUser}
        unreadCounts={unreadCounts}
        handleNavClick={handleNavClick}
        handleLogout={handleLogout}
      />

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        <Header
          location={location}
          setMobileOpen={setMobileOpen}
          isAdmin={isAdmin}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          totalUnread={totalUnread}
          notifications={notifications}
          handleNotifClick={handleNotifClick}
          profileRef={profileRef}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          displayName={displayName}
          user={user}
          avatarUrl={avatarUrl}
          initials={initials}
          goProfile={goProfile}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
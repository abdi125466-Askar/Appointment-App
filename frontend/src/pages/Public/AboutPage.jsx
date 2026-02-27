import React from "react";
import {
  ShieldCheck,
  Clock3,
  Users,
  CheckCircle2,
  Sparkles,
  BarChart3,
  MapPin,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ---------- Small Components ---------- */

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md transition hover:shadow-lg">
    <div className="flex items-center gap-4">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-bold text-blue-700">{value}</div>
      </div>
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md transition hover:shadow-lg">
    <div className="flex items-start gap-4">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-bold text-blue-700">{title}</div>
        <p className="mt-1 text-sm text-gray-600 leading-6">{desc}</p>
      </div>
    </div>
  </div>
);

const Step = ({ index, title, desc }) => (
  <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md">
    <div className="flex items-start gap-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white font-bold">
        {index}
      </div>
      <div>
        <div className="font-bold text-blue-700">{title}</div>
        <p className="mt-1 text-sm text-gray-600 leading-6">{desc}</p>
      </div>
    </div>
  </div>
);

/* ---------- Main Page ---------- */

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Users Served", value: "24/7 Access" },
    { icon: Clock3, label: "Time Efficiency", value: "Faster Process" },
    { icon: ShieldCheck, label: "Data Protection", value: "Secure System" },
    { icon: BarChart3, label: "Transparency", value: "Real-Time Tracking" },
  ];

  const features = [
    {
      icon: BadgeCheck,
      title: "Easy Appointment Booking",
      desc: "Select a service, submit your request, and receive confirmation instantly.",
    },
    {
      icon: MapPin,
      title: "Scheduled Time & Location",
      desc: "Avoid long queues with organized scheduling and precise time slots.",
    },
    {
      icon: Sparkles,
      title: "Track with Appointment ID",
      desc: "Monitor your request status anytime using your unique tracking ID.",
    },
    {
      icon: CheckCircle2,
      title: "Structured Workflow",
      desc: "Requests move through clear stages: Pending → Approved → Completed.",
    },
  ];

  const steps = [
    {
      title: "Choose a Service",
      desc: "Select the service you need from the available list.",
    },
    {
      title: "Submit Your Request",
      desc: "Fill out the form and provide the required information.",
    },
    {
      title: "Track Progress",
      desc: "Use your Appointment ID to monitor status updates.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
            About Appointify
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Appointify is a modern digital appointment system designed to make
            public service booking simple, efficient, and transparent.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((s) => (
            <Stat key={s.label} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>

        {/* FEATURES */}
        <div className="grid gap-6 md:grid-cols-2 mb-20">
          {features.map((f) => (
            <Feature key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-blue-700">
              How It Works
            </h2>
            <p className="text-gray-600 mt-2">
              Three simple steps to complete your appointment process.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((st, i) => (
              <Step key={st.title} index={i + 1} title={st.title} desc={st.desc} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-md"
            >
              Explore Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
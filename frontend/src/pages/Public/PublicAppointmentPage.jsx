import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, CheckCircle, User, Search, 
  Upload, FileText, X, AlertCircle, 
  ChevronRight, Loader2, ArrowRight,
  ShieldCheck, HelpCircle, Clock,
  MapPin, Phone, Mail, Award,
  Star, CreditCard, Bell, Settings
} from "lucide-react";

import {
  fetchActiveServices,
  checkServiceAvailability,
  createPublicAppointment,
  fetchAppointmentStatus,
  clearAvailability,
} from "../../Redux/slices/PublicSlice/publicAppointmentSlice";

export default function PublicAppointmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    services,
    servicesLoading,
    availability,
    availabilityLoading,
    creating,
    bookingSuccess,
    appointmentStatus,
    statusLoading,
    error,
  } = useSelector((state) => state.publicAppointment);

  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState({ fullName: "", phone: "", email: "", gender: "" });
  const [file, setFile] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [dateError, setDateError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(fetchActiveServices());
  }, [dispatch]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const day = new Date(selectedDate).getUTCDay();
    if (day === 5) {
      setDateError("Fridays are non-working days.");
      setDate("");
    } else {
      setDateError("");
      setDate(selectedDate);
      dispatch(clearAvailability());
    }
  };

  const handleCheckAvailability = () => {
    if (!selectedService || !date) return;
    dispatch(checkServiceAvailability({ serviceId: selectedService._id, date }));
    setCurrentStep(3);
  };

  const handleCreateAppointment = () => {
    const formData = new FormData();
    Object.keys(customer).forEach(key => formData.append(key, customer[key]));
    formData.append("serviceId", selectedService._id);
    formData.append("appointmentDate", date);
    if (file) formData.append("file", file);
    dispatch(createPublicAppointment(formData));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200/50">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
              Appoint<span className="text-blue-600">Me</span>
            </span>
            <p className="text-[10px] font-medium text-slate-400 tracking-wider">SMART BOOKING SYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
          >
            <HelpCircle size={20} />
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
          >
            <User size={16} />
            Admin Login
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT SIDE: BOOKING FORM (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="max-w-2xl mx-auto space-y-8 pb-10">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      currentStep > step ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-3">Book an Appointment</h2>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Complete the steps below to secure your slot
              </p>
            </div>

            {/* STEP 1: SERVICE */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-100/60 hover:shadow-2xl transition-shadow">
              <label className="flex items-center gap-3 text-xs font-black text-blue-600 uppercase tracking-widest mb-6">
                <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-xs shadow-md">1</span>
                Select Service
              </label>
              
              {servicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <button
                      key={service._id}
                      onClick={() => { 
                        setSelectedService(service); 
                        dispatch(clearAvailability());
                        setCurrentStep(2);
                      }}
                      className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                        selectedService?._id === service._id 
                        ? "border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-lg shadow-blue-100" 
                        : "border-transparent bg-gradient-to-br from-slate-50 to-white hover:border-slate-200 hover:shadow-md"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                        selectedService?._id === service._id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100'
                      }`}>
                        <Award size={20} />
                      </div>
                      <p className={`font-bold text-lg mb-1 ${
                        selectedService?._id === service._id ? "text-blue-700" : "text-slate-700"
                      }`}>{service.name}</p>
                      <p className="text-xs text-slate-400">{service.duration} mins</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 2: DATE */}
            {selectedService && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-100/60 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-2xl transition-shadow">
                <label className="flex items-center gap-3 text-xs font-black text-blue-600 uppercase tracking-widest mb-6">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-xs shadow-md">2</span>
                  Select Date & Time
                </label>
                
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={handleDateChange}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-xl px-4 py-4 pl-12 focus:ring-0 outline-none font-medium transition-all"
                      />
                      <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                    </div>
                    <button
                      onClick={handleCheckAvailability}
                      disabled={!date || availabilityLoading}
                      className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:from-black hover:to-slate-900 transition-all disabled:from-slate-200 disabled:to-slate-200 disabled:cursor-not-allowed shadow-lg shadow-slate-200 flex items-center justify-center gap-2 min-w-[180px]"
                    >
                      {availabilityLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Check Availability
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {dateError && (
                    <div className="p-4 bg-red-50 rounded-xl flex items-center gap-2 text-red-600 font-medium">
                      <AlertCircle size={18} />
                      {dateError}
                    </div>
                  )}
                  
                  {availability && (
                    <div className={`mt-6 p-6 rounded-xl ${
                      availability.available 
                        ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100" 
                        : "bg-gradient-to-r from-red-50 to-orange-50 border border-red-100"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          availability.available ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                          {availability.available 
                            ? <CheckCircle className="text-emerald-600" size={24} />
                            : <X className="text-red-600" size={24} />
                          }
                        </div>
                        <div>
                          <p className={`font-black text-lg ${
                            availability.available ? 'text-emerald-700' : 'text-red-700'
                          }`}>
                            {availability.available 
                              ? `${availability.remaining} Slots Available` 
                              : "Fully Booked"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {formatDate(date)}
                          </p>
                        </div>
                      </div>
                      
                      {availability.available && availability.timeSlots && (
                        <div className="mt-4 pt-4 border-t border-emerald-200">
                          <p className="text-xs font-bold text-emerald-600 mb-3">AVAILABLE TIME SLOTS</p>
                          <div className="flex flex-wrap gap-2">
                            {availability.timeSlots.map((slot, idx) => (
                              <button
                                key={idx}
                                className="px-4 py-2 bg-white rounded-lg border border-emerald-200 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-all"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS & UPLOAD */}
            {availability?.available && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-100/60 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 hover:shadow-2xl transition-shadow">
                <label className="flex items-center gap-3 text-xs font-black text-blue-600 uppercase tracking-widest mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-xs shadow-md">3</span>
                  Your Information
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      placeholder="Full Name" 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-xl pl-12 pr-4 py-4 focus:ring-0 outline-none transition-all"
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      placeholder="Phone Number" 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-xl pl-12 pr-4 py-4 focus:ring-0 outline-none transition-all"
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      placeholder="Email Address" 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-xl pl-12 pr-4 py-4 focus:ring-0 outline-none transition-all"
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <select 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-xl px-4 py-4 focus:ring-0 outline-none appearance-none transition-all"
                      onChange={(e) => setCustomer({ ...customer, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                    Required Document (PDF)
                  </label>
                  
                  {!file ? (
                    <div className="relative border-3 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="text-slate-300 group-hover:text-blue-500 mb-3 transition-colors" size={32} />
                      <p className="text-sm font-bold text-slate-600 mb-1">Drop your PDF here or click to browse</p>
                      <p className="text-xs text-slate-400">Maximum file size: 10MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                          <FileText className="text-blue-700" size={20} />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-700 truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFile(null)} 
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateAppointment}
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-5 rounded-2xl hover:from-blue-700 hover:to-blue-800 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 mt-6 text-lg"
                >
                  {creating ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  By booking, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: SIMPLIFIED TRACKER ONLY */}
        <div className="w-full lg:w-[380px] bg-white lg:h-full p-6 lg:p-8 overflow-y-auto border-l border-slate-200">
          <div className="max-w-md mx-auto">
            {/* TRACKING CARD */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Search size={18} className="text-blue-600" />
                Track Your Appointment
              </h3>
              
              <div className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., APP-2024-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full px-4 py-3 pl-10 text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
                </div>

                {/* Track Button */}
                <button
                  onClick={() => dispatch(fetchAppointmentStatus(searchId))}
                  disabled={!searchId || statusLoading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {statusLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Checking...
                    </>
                  ) : (
                    <>
                      Track Status
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Status Result */}
              {appointmentStatus && (
                <div className="mt-5 p-4 bg-white rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-600">Appointment Found</p>
                      <p className="text-xs font-mono text-slate-500">{appointmentStatus.appointmentId}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Service</span>
                      <span className="font-medium text-slate-800">{appointmentStatus.service?.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Date</span>
                      <span className="font-medium text-slate-800">
                        {new Date(appointmentStatus.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Customer</span>
                      <span className="font-medium text-slate-800">{appointmentStatus.customer?.fullName}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        appointmentStatus.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : appointmentStatus.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {appointmentStatus.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <p className="text-xs text-slate-400 text-center mt-4">
                Enter the tracking ID you received after booking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
              <CheckCircle size={48} />
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Your appointment has been successfully scheduled</p>
            
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 mb-8">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Tracking ID</p>
              <p className="text-3xl font-mono font-black text-slate-900 tracking-wider">{bookingSuccess.appointmentId}</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-black shadow-lg hover:from-black hover:to-slate-900 transition-all"
              >
                Book Another Appointment
              </button>
              
              <button 
                onClick={() => window.print()}
                className="w-full py-4 bg-white text-slate-700 rounded-2xl font-bold border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Download Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">Need Help?</h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Customer Support
                </h4>
                <p className="text-slate-600">+1 (800) 123-4567</p>
                <p className="text-slate-500 text-sm">Mon-Fri, 9am-6pm</p>
              </div>
              
              <div className="p-5 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email Support
                </h4>
                <p className="text-slate-600">support@appointme.com</p>
                <p className="text-slate-500 text-sm">24/7 response within 24h</p>
              </div>
              
              <div className="p-5 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-700 mb-2">Frequently Asked Questions</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">How do I reschedule?</p>
                    <p className="text-xs text-slate-500">Contact us at least 24h before your appointment</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">What documents do I need?</p>
                    <p className="text-xs text-slate-500">Valid ID and any relevant medical documents</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
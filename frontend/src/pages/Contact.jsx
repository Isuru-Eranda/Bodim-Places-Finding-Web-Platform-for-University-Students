import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { sendContactMessage } from "../services/api";

const SUBJECTS = [
  "General Inquiry",
  "Listing / Property Support",
  "Booking Issue",
  "Account & Login Help",
  "Report a Problem",
  "Partnership Opportunity",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, subject, message } = form;
    if (!name.trim() || !email.trim() || !subject || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await sendContactMessage(form);
      setSuccess(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1F2937] to-[#374151] py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get in <span className="text-orange-400">Touch</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Have a question or need help? We're here for you. Send us a message
          and we'll respond as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
              Contact Information
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Email Us</p>
                  <a
                    href="mailto:support@bodimfinder.lk"
                    className="text-[#1F2937] font-semibold hover:text-orange-500 transition-colors"
                  >
                    support@bodimfinder.lk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Call Us</p>
                  <a
                    href="tel:+94771234567"
                    className="text-[#1F2937] font-semibold hover:text-orange-500 transition-colors"
                  >
                    +94 77 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">
                    Our Office
                  </p>
                  <p className="text-[#1F2937] font-semibold">
                    Colombo 07, Western Province,
                    <br />
                    Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Office hours */}
          <div className="bg-[#F9FAFB] rounded-xl p-5 border border-gray-100">
            <h3 className="text-[#1F2937] font-semibold mb-3">Office Hours</h3>
            <ul className="space-y-1 text-sm text-[#6B7280]">
              <li className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="font-medium text-[#1F2937]">9 AM – 6 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-[#1F2937]">10 AM – 3 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-[#1F2937]">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
            Send Us a Message
          </h2>

          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#374151] mb-1"
                >
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#374151] mb-1"
                >
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Subject <span className="text-orange-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              >
                <option value="" disabled>
                  Select a subject
                </option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Message <span className="text-orange-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ strip */}
      <div className="bg-[#F9FAFB] border-t border-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-bold text-[#1F2937] mb-2">
            Looking for quick answers?
          </h3>
          <p className="text-[#6B7280] text-sm mb-5">
            Check our frequently asked questions before reaching out.
          </p>
          <Link
            to="/browse"
            className="inline-block border border-orange-400 text-orange-500 hover:bg-orange-50 font-medium px-6 py-2 rounded-lg text-sm transition-colors"
          >
            Browse Listings Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  MessageCircle,
  Users,
  Camera,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  updateProfile,
  changePassword,
  updateContactDetails,
  uploadProfilePicture,
} from "../services/api";

const TABS = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "contact", label: "Contact Details", icon: Phone },
];

function Alert({ type, message }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-5 ${
        isError
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
      }`}
    >
      {isError ? <AlertCircle size={16} /> : <Check size={16} />}
      {message}
    </div>
  );
}

function InputField({ label, icon: Icon, type = "text", value, onChange, placeholder, suffix, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-9" : "pl-3"} ${suffix ? "pr-20" : "pr-3"} py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed`}
        />
        {suffix}
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
          <Lock size={16} />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile tab state
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password tab state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Contact tab state
  const [contactForm, setContactForm] = useState({
    contactNumber: user?.contactNumber || "",
    whatsapp: user?.whatsapp || "",
    guardianMobile: user?.guardianMobile || "",
  });
  const [contactStatus, setContactStatus] = useState({ type: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);

  // Profile picture
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // --- Profile Picture ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setAvatarStatus({ type: "error", message: "Only JPEG, PNG and WebP images are allowed." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarStatus({ type: "error", message: "Image must be under 2 MB." });
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", file);
    setAvatarLoading(true);
    setAvatarStatus({ type: "", message: "" });
    try {
      const { data } = await uploadProfilePicture(formData);
      updateUser(data);
      setAvatarStatus({ type: "success", message: "Profile picture updated." });
    } catch (err) {
      setAvatarStatus({ type: "error", message: err.response?.data?.message || "Upload failed." });
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  // --- Profile Details ---
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileStatus({ type: "error", message: "Name and email are required." });
      return;
    }
    setProfileLoading(true);
    setProfileStatus({ type: "", message: "" });
    try {
      const { data } = await updateProfile({ name: profileForm.name, email: profileForm.email });
      updateUser(data);
      setProfileStatus({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      setProfileStatus({ type: "error", message: err.response?.data?.message || "Update failed." });
    } finally {
      setProfileLoading(false);
    }
  };

  // --- Change Password ---
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: "error", message: "All fields are required." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: "error", message: "New password must be at least 6 characters." });
      return;
    }
    setPasswordLoading(true);
    setPasswordStatus({ type: "", message: "" });
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordStatus({ type: "success", message: "Password changed successfully." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordStatus({ type: "error", message: err.response?.data?.message || "Password change failed." });
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Contact Details ---
  const handleContactSave = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus({ type: "", message: "" });
    try {
      const payload = {
        contactNumber: contactForm.contactNumber,
        whatsapp: contactForm.whatsapp,
        ...(user?.role === "student" && { guardianMobile: contactForm.guardianMobile }),
      };
      const { data } = await updateContactDetails(payload);
      updateUser(data);
      setContactStatus({ type: "success", message: "Contact details updated." });
    } catch (err) {
      setContactStatus({ type: "error", message: err.response?.data?.message || "Update failed." });
    } finally {
      setContactLoading(false);
    }
  };

  const apiBase = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  const avatarSrc = user?.profilePicture ? `${apiBase}${user.profilePicture}` : null;

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F9FAFB] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-orange-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-orange-500">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow transition disabled:opacity-60"
                title="Change profile picture"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-[#1F2937]">{user.name}</h1>
              <p className="text-sm text-[#6B7280]">{user.email}</p>
              <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-orange-100 text-orange-600">
                {user.role === "owner" ? "Bodim Owner" : user.role}
              </span>
            </div>
          </div>

          {/* Avatar status message */}
          {avatarStatus.message && (
            <div className="mt-4">
              <Alert type={avatarStatus.type} message={avatarStatus.message} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="flex border-b border-[#E5E7EB]">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
                    : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── Profile Details Tab ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} noValidate>
                <h2 className="text-base font-semibold text-[#1F2937] mb-4">Edit Profile Details</h2>
                <Alert type={profileStatus.type} message={profileStatus.message} />
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    icon={User}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                  <InputField
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Save size={15} />
                  {profileLoading ? "Saving…" : "Save Changes"}
                </button>
              </form>
            )}

            {/* ── Change Password Tab ── */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSave} noValidate>
                <h2 className="text-base font-semibold text-[#1F2937] mb-1">Change Password</h2>
                <p className="text-sm text-[#6B7280] mb-4">Enter your current password to set a new one.</p>
                <Alert type={passwordStatus.type} message={passwordStatus.message} />
                <div className="space-y-4">
                  <PasswordInput
                    label="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <PasswordInput
                    label="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                    placeholder="At least 6 characters"
                  />
                  <PasswordInput
                    label="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="Repeat new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Lock size={15} />
                  {passwordLoading ? "Updating…" : "Update Password"}
                </button>
              </form>
            )}

            {/* ── Contact Details Tab ── */}
            {activeTab === "contact" && (
              <form onSubmit={handleContactSave} noValidate>
                <h2 className="text-base font-semibold text-[#1F2937] mb-1">Contact Details</h2>
                <p className="text-sm text-[#6B7280] mb-4">
                  {user.role === "owner"
                    ? "Provide your contact details so students can reach you."
                    : "Provide your contact details for listings and booking communications."}
                </p>
                <Alert type={contactStatus.type} message={contactStatus.message} />

                <div className="space-y-4">
                  {/* Email – shown read-only, links to Profile Details */}
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#9CA3AF] bg-[#F9FAFB] cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      To change your email, update it in the{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className="text-orange-500 hover:underline"
                      >
                        Profile Details
                      </button>{" "}
                      tab.
                    </p>
                  </div>

                  <InputField
                    label="Contact Number"
                    icon={Phone}
                    type="tel"
                    value={contactForm.contactNumber}
                    onChange={(e) => setContactForm((f) => ({ ...f, contactNumber: e.target.value }))}
                    placeholder="+94 77 123 4567"
                  />

                  <InputField
                    label="WhatsApp Number"
                    icon={MessageCircle}
                    type="tel"
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="+94 77 123 4567"
                  />

                  {/* Guardian mobile – students only */}
                  {user.role === "student" && (
                    <InputField
                      label="Guardian Mobile Number"
                      icon={Users}
                      type="tel"
                      value={contactForm.guardianMobile}
                      onChange={(e) => setContactForm((f) => ({ ...f, guardianMobile: e.target.value }))}
                      placeholder="+94 71 987 6543"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Save size={15} />
                  {contactLoading ? "Saving…" : "Save Contact Details"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { motion, AnimatePresence } from "framer-motion";
const M = motion;
import { User, Settings, Edit, LogIn, LogOut, Eye, EyeOff, Save, XCircle, Check, X, AlertTriangle } from "lucide-react";
import zxcvbn from "zxcvbn";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AccountPage() {
  const {
    user, isAuthenticated, login, register, logout,
    loading: authLoading, error: authError, clearError,
    updateProfile, updatePassword, setup2FA, verify2FASetup, disable2FA, verify2FA
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("login");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [toast, setToast] = useState("");
  const [show2FALogin, setShow2FALogin] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FASetupOpen, setIs2FASetupOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [setupStep, setSetupStep] = useState(1); // 1: QR, 2: Backup Codes
  const [disable2FAPassword, setDisable2FAPassword] = useState("");
  const [isDisable2FAOpen, setIsDisable2FAOpen] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const hoverScale = {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 },
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Clear error when switching modes
  useEffect(() => {
    clearError();
  }, [mode]);

  // Sync settings state when user data changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      if (result.require2FA) {
        setPendingEmail(result.email);
        setShow2FALogin(true);
        // Don't close modal, just show 2FA screen
      } else {
        setShowModal(false);
        setToast("Signed in successfully");
        setEmail("");
        setPassword("");
      }
    }
  }

  async function handle2FAVerify(e) {
    e.preventDefault();
    const result = await verify2FA(pendingEmail, twoFactorToken);
    if (result.success) {
      setShowModal(false);
      setShow2FALogin(false);
      setToast("Signed in successfully");
      setEmail("");
      setPassword("");
      setTwoFactorToken("");
    }
  }

  function handleLogout() {
    logout();
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setToast("Logged out successfully");
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      return;
    }

    // Validate password policy before submitting
    const score = zxcvbn(password).score;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&_]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setToast("Password does not meet requirements");
      return;
    }

    // Optional: Enforce minimum score (e.g., must be Fair or better)
    if (score < 2) {
      setToast("Password is too weak");
      return;
    }

    const result = await register({ name, email, password, phone });
    if (result.success) {
      setShowModal(false);
      setToast("Account created successfully");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    const result = await updateProfile({ name: editName, phone: editPhone });
    if (result.success) {
      setIsSettingsOpen(false);
      setToast("Profile updated successfully");
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast("Passwords do not match");
      return;
    }
    const result = await updatePassword({ currentPassword, newPassword });
    if (result.success) {
      setIsChangePasswordOpen(false);
      setToast("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handleStart2FA() {
    const result = await setup2FA();
    if (result.success) {
      setQrCode(result.data.qrCode);
      setIs2FASetupOpen(true);
      setSetupStep(1);
    }
  }

  async function handleVerify2FASetup(e) {
    e.preventDefault();
    const result = await verify2FASetup(verificationCode);
    if (result.success) {
      setBackupCodes(result.backupCodes);
      setSetupStep(2);
      setToast("2FA logic verified");
    }
  }

  async function handleDisable2FA(e) {
    e.preventDefault();
    const result = await disable2FA(disable2FAPassword);
    if (result.success) {
      setIsDisable2FAOpen(false);
      setDisable2FAPassword("");
      setToast("2FA disabled successfully");
    }
  }

  return (
    <>
      <AnnoucementBar />
      <Navbar />

      <section className="bg-[#FCF8F2] border-b border-black">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <M.h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {isAuthenticated ? "Your Account" : mode === "login" ? "Welcome Back" : "Create Account"}
          </M.h1>
          <M.p
            className="mt-3 text-sm md:text-base text-black/70 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isAuthenticated
              ? "Manage your details and preferences in one place."
              : mode === "login"
                ? "Sign in to personalize your experience and manage your profile."
                : "Create your account to start your routine."}
          </M.p>
        </div>
      </section>

      <section className="bg-[#FCF8F2]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {isAuthenticated ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <M.div className="lg:col-span-1 bg-white rounded-2xl border border-black p-6" {...fadeIn}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                      <User size={28} />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide">Welcome</p>
                      <h3 className="text-xl">{user?.name || "User"}</h3>
                      <p className="text-xs text-black/60">{user?.email}</p>
                    </div>
                  </div>
                  <M.button className="w-full bg-white border border-black py-3 rounded-lg text-sm font-semibold tracking-wide" {...hoverScale} onClick={handleLogout}>
                    <span className="inline-flex items-center gap-2">
                      <LogOut size={18} />
                      Log out
                    </span>
                  </M.button>
                  <div className="grid grid-cols-1 gap-4">
                    <M.button
                      className="flex items-center justify-center gap-2 p-4 rounded-xl border border-black bg-white w-full"
                      {...hoverScale}
                      onClick={() => setIsSettingsOpen(true)}
                    >
                      <Settings size={20} />
                      <span className="text-sm font-semibold">Settings</span>
                    </M.button>
                  </div>
                </div>
              </M.div>

              <M.div className="lg:col-span-2 space-y-8" {...fadeIn}>
                <M.div className="rounded-2xl border border-black bg-white p-6" {...hoverScale}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg">Account Details</h3>
                      <p className="text-sm text-black/60">Your profile information</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-black p-4">
                      <p className="text-xs text-black/60">Name</p>
                      <p className="text-sm font-medium">{user?.name || "Not set"}</p>
                    </div>
                    <div className="rounded-xl border border-black p-4">
                      <p className="text-xs text-black/60">Email</p>
                      <p className="text-sm font-medium">{user?.email || "Not set"}</p>
                    </div>
                    <div className="rounded-xl border border-black p-4">
                      <p className="text-xs text-black/60">Phone</p>
                      <p className="text-sm font-medium">{user?.phone || "Not set"}</p>
                    </div>
                    <div className="rounded-xl border border-black p-4">
                      <p className="text-xs text-black/60">Role</p>
                      <p className="text-sm font-medium capitalize">{user?.role || "User"}</p>
                    </div>
                  </div>
                </M.div>

                <M.div className="rounded-2xl border border-black bg-white p-6" {...hoverScale}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg uppercase font-bold tracking-tight">Security & Access</h3>
                      <p className="text-sm text-black/60">Manage your password and security settings</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      className="px-6 py-3 rounded-lg bg-black text-white text-sm font-semibold tracking-wide hover:bg-black/90 transition-colors"
                      onClick={() => setIsChangePasswordOpen(true)}
                    >
                      Change Password
                    </button>
                    {user?.twoFactorEnabled ? (
                      <button
                        className="px-6 py-3 rounded-lg border border-red-200 text-red-600 text-sm font-semibold tracking-wide hover:bg-red-50 transition-colors"
                        onClick={() => setIsDisable2FAOpen(true)}
                      >
                        Disable 2FA
                      </button>
                    ) : (
                      <button
                        className="px-6 py-3 rounded-lg border border-black text-black text-sm font-semibold tracking-wide hover:bg-black/5 transition-colors"
                        onClick={handleStart2FA}
                      >
                        Enable 2FA
                      </button>
                    )}
                  </div>
                </M.div>
              </M.div>
            </div>
          ) : (
            <div className="min-h-[60vh] flex items-center justify-center">
              <M.div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl border border-black p-6 shadow-2xl" {...fadeIn}>
                <div className="h-1 w-full rounded-full bg-gradient-to-r from-black via-gray-500 to-black mb-4" />
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide">Welcome</p>
                    <h3 className="text-xl">Guest</h3>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <M.button className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md" {...hoverScale} onClick={() => { setMode("login"); setShowModal(true); }}>
                    <span className="inline-flex items-center gap-2">
                      <LogIn size={18} />
                      Sign in
                    </span>
                  </M.button>
                  <M.button className="w-full bg-white border border-black py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md" {...hoverScale} onClick={() => { setMode("signup"); setShowModal(true); }}>
                    <span className="inline-flex items-center gap-2">
                      <Edit size={18} />
                      Create account
                    </span>
                  </M.button>
                </div>
              </M.div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showModal && !isAuthenticated && (
          <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <M.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.25 }} className="w-full max-w-md md:max-w-lg bg-white rounded-2xl border border-black p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">
                  {show2FALogin ? "Verification Required" : mode === "login" ? "Sign in" : "Create account"}
                </h3>
                <button onClick={() => { setShowModal(false); clearError(); setShow2FALogin(false); }} className="text-sm underline">Close</button>
              </div>

              {show2FALogin ? (
                <form className="space-y-4" onSubmit={handle2FAVerify}>
                  <p className="text-sm text-black/60">Enter the 6-digit code from your authenticator app or a backup code.</p>
                  <input
                    type="text"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                    placeholder="Verification Code"
                    required
                    className="w-full border border-black rounded-lg px-4 py-3 text-sm text-center tracking-[1em] font-bold"
                  />
                  {authError && <p className="text-xs text-red-600">{authError}</p>}
                  <M.button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md"
                    {...hoverScale}
                    disabled={authLoading}
                  >
                    {authLoading ? "Verifying..." : "Verify & Login"}
                  </M.button>
                  <button
                    type="button"
                    className="w-full text-xs underline text-black/60"
                    onClick={() => setShow2FALogin(false)}
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={mode === "login" ? handleLogin : handleSignup}>
                  {mode === "signup" && (
                    <>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name *"
                        required
                        className="w-full border border-black rounded-lg px-4 py-3 text-sm"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone (optional)"
                        className="w-full border border-black rounded-lg px-4 py-3 text-sm"
                      />
                    </>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email *"
                    required
                    className="w-full border border-black rounded-lg px-4 py-3 text-sm"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password *"
                      required
                      minLength={6}
                      className="w-full border border-black rounded-lg px-4 py-3 text-sm pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Meter - Only shown during signup */}
                  {mode === "signup" && password.length > 0 && (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-black/10">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-black/60">Password Strength</span>
                        <span className={`font-bold ${zxcvbn(password).score < 2 ? "text-red-600" :
                            zxcvbn(password).score < 3 ? "text-yellow-600" :
                              "text-green-600"
                          }`}>
                          {["Weak", "Fair", "Good", "Strong", "Very Strong"][zxcvbn(password).score]}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5 mb-3">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-full flex-1 rounded-full transition-all duration-300 ${i < zxcvbn(password).score
                                ? i < 2 ? "bg-red-500" : i < 3 ? "bg-yellow-500" : "bg-green-500"
                                : "bg-gray-200"
                              }`}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-green-600" : "text-black/40"}`}>
                          {password.length >= 8 ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-green-600" : "text-black/40"}`}>
                          {/[A-Z]/.test(password) ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                          <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? "text-green-600" : "text-black/40"}`}>
                          {/[a-z]/.test(password) ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                          <span>One lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? "text-green-600" : "text-black/40"}`}>
                          {/[0-9]/.test(password) ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                          <span>One number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[@$!%*?&_]/.test(password) ? "text-green-600" : "text-black/40"}`}>
                          {/[@$!%*?&_]/.test(password) ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                          <span>One special char (@$!%*?&_)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {authError && <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> {authError}</p>}
                  <div className="flex gap-3">
                    <M.button
                      type="submit"
                      className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide disabled:opacity-60 shadow hover:shadow-md"
                      {...hoverScale}
                      disabled={authLoading}
                    >
                      {authLoading
                        ? (mode === "login" ? "Signing in..." : "Creating...")
                        : mode === "login" ? "Sign in" : "Create account"
                      }
                    </M.button>
                    <M.button
                      type="button"
                      className="flex-1 bg-white border border-black py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md"
                      {...hoverScale}
                      onClick={() => { setMode(mode === "login" ? "signup" : "login"); clearError(); }}
                    >
                      {mode === "login" ? "Create account" : "Have an account?"}
                    </M.button>
                  </div>
                </form>
              )}
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <M.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-lg bg-black text-white shadow">
              {toast}
            </div>
          </M.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <M.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-black p-6 shadow-2xl relative">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"
              >
                <XCircle size={24} />
              </button>

              <h3 className="text-xl font-bold uppercase tracking-tight mb-6">Edit Profile</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs uppercase font-bold text-black/60 mb-1 block px-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full border border-black rounded-lg px-4 py-3 text-sm bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-black/60 mb-1 block px-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border border-black rounded-lg px-4 py-3 text-sm bg-white"
                  />
                </div>

                <div className="pt-4">
                  <M.button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow hover:shadow-md"
                    {...hoverScale}
                  >
                    <Save size={18} />
                    Save Changes
                  </M.button>
                </div>
              </form>
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChangePasswordOpen && (
          <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <M.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="w-full max-w-md bg-[#FCF8F2] rounded-2xl border border-black p-6 shadow-2xl relative">
              <button onClick={() => setIsChangePasswordOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><XCircle size={24} /></button>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-6">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="w-full border border-black rounded-lg px-4 py-3 text-sm bg-white"
                  required
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full border border-black rounded-lg px-4 py-3 text-sm bg-white"
                  required
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full border border-black rounded-lg px-4 py-3 text-sm bg-white"
                  required
                />
                <div className="pt-4">
                  <M.button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md" {...hoverScale}>
                    Update Password
                  </M.button>
                </div>
              </form>
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {is2FASetupOpen && (
          <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <M.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="w-full max-w-md bg-white rounded-2xl border border-black p-6 shadow-2xl relative text-center">
              {setupStep === 1 ? (
                <>
                  <h3 className="text-xl font-bold uppercase mb-4">Setup 2FA</h3>
                  <p className="text-sm text-black/60 mb-6">Scan this QR code with your Authenticator app (Google Authenticator, Authy, etc.)</p>
                  <div className="bg-white p-4 border border-black rounded-xl inline-block mb-6">
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                  <form onSubmit={handleVerify2FASetup} className="space-y-4">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="6-digit PIN"
                      required
                      className="w-full border border-black rounded-lg px-4 py-3 text-sm text-center font-bold tracking-widest"
                    />
                    <M.button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md" {...hoverScale}>
                      Verify & Enable
                    </M.button>
                  </form>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Save size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase mb-4">2FA Enabled!</h3>
                  <p className="text-sm text-black/60 mb-6">Save these backup codes in a safe place. You can use them to log in if you lose access to your authenticator app.</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="bg-gray-100 border border-black/10 py-2 rounded font-mono text-sm">{code}</div>
                    ))}
                  </div>
                  <M.button onClick={() => setIs2FASetupOpen(false)} className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md" {...hoverScale}>
                    I've Saved Them
                  </M.button>
                </>
              )}
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDisable2FAOpen && (
          <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <M.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="w-full max-w-md bg-white rounded-2xl border border-black p-6 shadow-2xl relative">
              <button onClick={() => setIsDisable2FAOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"><XCircle size={24} /></button>
              <h3 className="text-xl font-bold uppercase mb-4 text-red-600">Disable 2FA</h3>
              <p className="text-sm text-black/60 mb-6 font-medium">To disable Two-Factor Authentication, please enter your password for verification.</p>
              <form onSubmit={handleDisable2FA} className="space-y-4">
                <input
                  type="password"
                  value={disable2FAPassword}
                  onChange={(e) => setDisable2FAPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full border border-black rounded-lg px-4 py-3 text-sm"
                  required
                />
                <M.button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg text-sm font-semibold tracking-wide shadow hover:shadow-md" {...hoverScale}>
                  Disable Security
                </M.button>
              </form>
            </M.div>
          </M.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

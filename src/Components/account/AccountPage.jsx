import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { motion, AnimatePresence } from "framer-motion";
const M = motion;
import { User, Package, MapPin, Heart, Settings, Edit, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AccountPage() {
  const { user, isAuthenticated, login, register, logout, loading: authLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("login");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

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

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      setShowModal(false);
      setToast("Signed in successfully");
      setEmail("");
      setPassword("");
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
              ? "Manage your details, orders, and preferences in one place."
              : mode === "login"
                ? "Sign in to view orders, saved addresses, and personalize your experience."
                : "Create your account to manage orders and addresses."}
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
                  <div className="grid grid-cols-2 gap-4">
                    <M.a href="#" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-black bg-white" {...hoverScale}>
                      <Package />
                      <span className="text-xs font-semibold">Orders</span>
                    </M.a>
                    <M.a href="#" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-black bg-white" {...hoverScale}>
                      <MapPin />
                      <span className="text-xs font-semibold">Addresses</span>
                    </M.a>
                    <M.a href="#" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-black bg-white" {...hoverScale}>
                      <Heart />
                      <span className="text-xs font-semibold">Wishlist</span>
                    </M.a>
                    <M.a href="#" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-black bg-white" {...hoverScale}>
                      <Settings />
                      <span className="text-xs font-semibold">Settings</span>
                    </M.a>
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
                      <h3 className="text-lg">Saved Addresses</h3>
                      <p className="text-sm text-black/60">Manage your delivery addresses</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    {user?.address?.street ? (
                      <div className="rounded-xl border border-black p-4">
                        <p className="text-sm font-medium">{user.address.street}</p>
                        <p className="text-xs text-black/60">
                          {user.address.city}, {user.address.state} - {user.address.pincode}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-black/60">No addresses saved yet.</p>
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
                <h3 className="text-lg">{mode === "login" ? "Sign in" : "Create account"}</h3>
                <button onClick={() => { setShowModal(false); clearError(); }} className="text-sm underline">Close</button>
              </div>
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  required
                  minLength={6}
                  className="w-full border border-black rounded-lg px-4 py-3 text-sm"
                />
                {authError && <p className="text-xs text-red-600">{authError}</p>}
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

      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Mode = "email" | "phone";

export function LoginForm() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithPhone } = useAuth();
  
  const [mode, setMode] = useState<Mode>("email");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email/Password state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Phone state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  async function saveUserToMongoDB(userData: any) {
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    } catch (err) {
      console.error("Failed to save user to MongoDB:", err);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const userCredential = await signUpWithEmail(email, password);
        // Save to MongoDB
        await saveUserToMongoDB({
          uid: userCredential.user.uid,
          name: name || email.split("@")[0],
          email,
          imageUrl: imageUrl || "",
          role: "user",
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithGoogle();
      // Save to MongoDB
      await saveUserToMongoDB({
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || "",
        email: userCredential.user.email || "",
        imageUrl: userCredential.user.photoURL || "",
        role: "user",
        createdAt: new Date().toISOString(),
      });
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!confirmationResult) {
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });
        }

        const result = await signInWithPhone(phone);
        setConfirmationResult(result);
        setError("OTP sent to your phone");
      } else {
        const userCredential = await confirmationResult.confirm(otp);
        // Save to MongoDB
        await saveUserToMongoDB({
          uid: userCredential.user.uid,
          name: name || phone,
          email: "",
          phone: userCredential.user.phoneNumber || phone,
          imageUrl: imageUrl || "",
          role: "user",
          createdAt: new Date().toISOString(),
        });
        router.push("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Phone authentication failed";
      setError(message);
      setConfirmationResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-[0.65rem] tracking-[0.4em] text-gold uppercase">Welcome</p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground">
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>
        </div>

        {/* Mode toggle */}
        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setMode("email")}
            className={`flex-1 px-4 py-2.5 text-xs tracking-widest uppercase transition-all ${
              mode === "email"
                ? "bg-gold text-black"
                : "border border-border-subtle text-foreground-muted hover:border-gold/50"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setMode("phone")}
            className={`flex-1 px-4 py-2.5 text-xs tracking-widest uppercase transition-all ${
              mode === "phone"
                ? "bg-gold text-black"
                : "border border-border-subtle text-foreground-muted hover:border-gold/50"
            }`}
          >
            Phone
          </button>
        </div>

        {/* Email/Password form */}
        {mode === "email" && (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                    Profile Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="admin-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-xs tracking-widest uppercase text-foreground-muted hover:text-gold transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </form>
        )}

        {/* Phone form */}
        {mode === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
            {!confirmationResult ? (
              <>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                    Profile Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="admin-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+8801234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="admin-input"
                  />
                  <p className="mt-1 text-xs text-foreground-muted">Include country code (e.g., +880)</p>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
                  Enter OTP
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="admin-input"
                />
              </div>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full"
            >
              {loading ? "Processing..." : confirmationResult ? "Verify OTP" : "Send OTP"}
            </button>

            {confirmationResult && (
              <button
                type="button"
                onClick={() => {
                  setConfirmationResult(null);
                  setOtp("");
                  setError("");
                }}
                className="w-full text-xs tracking-widest uppercase text-foreground-muted hover:text-gold transition-colors"
              >
                Change phone number
              </button>
            )}
          </form>
        )}

        {/* Google sign-in */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-foreground-muted tracking-widest">Or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 border border-border-subtle px-6 py-3 text-sm tracking-widest uppercase text-foreground-muted transition-all hover:border-gold/50 hover:text-gold disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div id="recaptcha-container" />
      </div>
    </main>
  );
}

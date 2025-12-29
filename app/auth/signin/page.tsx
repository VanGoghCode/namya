"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/Button";
import { Lock } from "lucide-react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#EAEAEA] relative z-10 mx-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#5D4037]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#5D4037]">
          <Lock size={28} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-[#5D4037]">
          Admin Login
        </h1>
        <p className="text-[#5D5D5D] mt-2">Secure access to Vrunda Portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-[#5D4037]"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A065]/50 bg-white transition-all"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-[#5D4037]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A065]/50 bg-white transition-all"
            placeholder="Enter password"
            required
          />
        </div>

        <Button className="w-full py-6 text-lg" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-[#C5A065] hover:underline">
          &larr; Back to Home
        </a>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C5A065]/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#5D4037]/5 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <Suspense fallback={<div className="text-[#5D4037]">Loading...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  );
}

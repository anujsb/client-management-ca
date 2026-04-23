// src/app/(auth)/signup/page.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupAction, loginAction } from "@/lib/actions/auth.actions";

export default function SignupPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        // Validate passwords match client-side
        if (formData.get("password") !== formData.get("confirmPassword")) {
            setError("Passwords do not match");
            return;
        }

        startTransition(async () => {
            // 1. Create account
            const signupResult = await signupAction(formData);
            if (!signupResult.success) {
                setError(signupResult.error);
                return;
            }

            // 2. Auto-login after signup
            const loginResult = await loginAction(formData);
            if (!loginResult.success) {
                // Account created but login failed — send to login page
                router.push("/login?message=account-created");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        });
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CA</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900">CAdoc</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                    <p className="text-slate-500 text-sm mt-1">Start automating your client follow-ups</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    {error && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Full name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="CA Rajesh Kumar"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Firm name
                                </label>
                                <input
                                    name="firmName"
                                    type="text"
                                    required
                                    placeholder="Kumar & Associates"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="ca@yourfirm.com"
                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="Min. 8 characters, 1 uppercase, 1 number"
                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Confirm password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
                        >
                            {isPending ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 font-medium hover:text-blue-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
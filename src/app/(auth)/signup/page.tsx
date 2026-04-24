"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupAction, loginAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);

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
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex items-center justify-center px-4 py-12">
            {/* Left side - Benefits */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start max-w-lg">
                <Link href="/" className="mb-8 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                        <span className="font-bold text-white text-sm">CA</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">DocFlow</span>
                </Link>
                <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-6">
                    Start automating your client workflows today
                </h1>

                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0 mt-0">
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Send WhatsApp Requests</p>
                            <p className="text-sm text-slate-600">Automate document requests directly to your clients</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0 mt-0">
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Real-Time Tracking</p>
                            <p className="text-sm text-slate-600">Monitor submissions and follow-ups instantly</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0 mt-0">
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Save Hours Every Week</p>
                            <p className="text-sm text-slate-600">Focus on your core audit work, not chasing documents</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="w-full max-w-md lg:w-1/2 lg:pl-8">
                <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
                    {/* Mobile header */}
                    <div className="lg:hidden mb-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                <span className="font-bold text-white text-sm">CA</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">DocFlow</span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Join hundreds of CAs automating their workflows
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <p className="font-medium">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Rajesh Kumar"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Firm Name
                                    </label>
                                    <input
                                        name="firmName"
                                        type="text"
                                        required
                                        placeholder="Kumar & Associates"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="ca@yourfirm.com"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 mt-6"
                                >
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {/* Step 2: Password */}
                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Min. 8 characters"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">At least 8 characters, including uppercase and numbers</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="flex-1 border-gray-300"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
                                    >
                                        {isPending ? "Creating..." : "Create Account"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

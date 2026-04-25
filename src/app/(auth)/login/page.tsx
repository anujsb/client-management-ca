"use client";

import { use } from "react";
import { loginAction } from "@/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const router = useRouter();

    // NEXT.JS 15 FIX: Unwrap the searchParams promise using React's use() hook
    const unwrappedParams = use(searchParams);

    // The robust Server Action
    const handleLogin = async (formData: FormData) => {
        const result = await loginAction(formData);
        if (result.success) {
            router.push("/dashboard");
            router.refresh();
        } else {
            // Error handling is managed by the searchParams check in the UI
            console.error(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-white flex items-center justify-center px-4 py-12">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start max-w-lg">
                <Link href="/" className="mb-8 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                        <span className="font-bold text-white text-sm">CA</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">DocFlow</span>
                </Link>
                <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
                    Welcome back to your CA dashboard
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    Access your document requests, client management, and automation tools in one secure platform.
                </p>
                <div className="space-y-4 text-slate-700">
                    <div className="flex gap-3 items-start">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm">✓</span>
                        </div>
                        <p className="text-sm">Send automated WhatsApp requests to clients</p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm">✓</span>
                        </div>
                        <p className="text-sm">Track document submissions in real-time</p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm">✓</span>
                        </div>
                        <p className="text-sm">Manage multiple clients and document types</p>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
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
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Access your dashboard and manage your clients
                        </p>
                    </div>

                    {unwrappedParams?.error === "CredentialsSignin" && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
                            <p className="font-medium">Invalid credentials</p>
                            <p>Please check your email and password and try again.</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form action={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5">
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-slate-600">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
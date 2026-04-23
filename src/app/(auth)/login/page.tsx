import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string };
}) {

    // The robust Server Action
    const handleLogin = async (formData: FormData) => {
        "use server";
        try {
            await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/dashboard",
            });
        } catch (error) {
            if (error instanceof AuthError) {
                // You could handle specific auth errors here if you wanted
                console.error("Auth Error:", error.type);
            }
            // CRITICAL: We MUST rethrow the error. 
            // Next.js uses errors to trigger redirects. If we swallow it, the redirect fails.
            throw error;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-sm border border-slate-200">

                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        CA Portal Login
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Enter your credentials to access the dashboard.
                    </p>
                </div>

                {searchParams?.error === "CredentialsSignin" && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-100 text-center">
                        Invalid email or password. Please try again.
                    </div>
                )}

                {/* Connect the form to the new action */}
                <form action={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                                placeholder="admin@ca.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                    >
                        Sign in
                    </button>
                </form>

            </div>
        </div>
    );
}
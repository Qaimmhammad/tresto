"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";
import { getCurrentUser } from "../api/auth/user";
import getUserAction from "./actions";

export default function LoginPage() {
    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            const user = await getUserAction();
            if (!user) {
                throw new Error("login Failed")
            }
            const role = user.role ; 
            if (role === "admin") {
                router.push("dashboard");
            }else if (role === "employee"){
                router.push("employee-dashboard");
            }else if (role === "branch_manager" ) {
                router.push("manager-dashboard");
            }

            
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء تسجيل الدخول"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            <Header />

            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold">
                            مرحبًا بعودتك
                        </h1>

                        <p className="mt-2 text-xl text-gray-700">
                            سجّل الدخول لإدارة مطعمك
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="text-xl font-medium mb-4"
                                >
                                    اسم المستخدم
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    placeholder="أدخل اسم المستخدم"
                                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-l outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-xl font-medium"
                                >
                                    كلمة المرور
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="أدخل كلمة المرور"
                                    className="mt-2  h-11 w-full rounded-lg border bg-background px-3 text-l outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full rounded-lg bg-primary px-4 text-xl font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "جارٍ تسجيل الدخول..."
                                    : "تسجيل الدخول"}
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />

                            <span className="text-l text-muted-foreground">
                                ليس لديك حساب؟
                            </span>

                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <Link
                            href="/restaurant-registration"
                            className="flex h-11 w-full items-center justify-center rounded-lg border border-primary px-4 text-xl font-medium text-primary transition hover:bg-primary/5"
                        >
                            سجّل مطعمك
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
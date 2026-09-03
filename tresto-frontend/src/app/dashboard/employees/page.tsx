"use client";

import { useEffect, useState } from "react";
import {
    User,
    Shield,
    Building2,
    Pencil,
    Trash2,
    Plus,
    Loader2,
} from "lucide-react";

import type UserModel from "@/models/user-model";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    createUserAction,
    deleteUserAction,
    getUsersAction,
    updateUserAction,
    getBranchesAction
} from "./action";

type Role = "admin" | "branch_manager" | "employee";

type UserForm = {
    name: string;
    userName: string;
    password: string;
    role: Role;
    branchId: string;
};

type Branch = {
    id: string;
    name: string;
};

const emptyForm: UserForm = {
    name: "",
    userName: "",
    password: "",
    role: "employee",
    branchId: "",
};

export default function UsersPage() {
    const [employees, setEmployees] = useState<UserModel[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    const [selectedUser, setSelectedUser] =
        useState<UserModel | null>(null);

    const [editingUser, setEditingUser] =
        useState<UserModel | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [form, setForm] = useState<UserForm>(emptyForm);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function loadUsers() {
        try {
            setIsLoading(true);

            const users = await getUsersAction();

            const branches = await getBranchesAction();
            setBranches(branches);

            setEmployees(users);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    function openAddDialog() {
        setForm(emptyForm);
        setIsAddDialogOpen(true);
    }

    function openEditDialog(user: UserModel) {
        setEditingUser(user);

        setForm({
            name: user.name,
            userName: user.userName,
            password: "",
            role: user.role,
            branchId: user.branch?.branchId ?? "",
        });
    }

    function closeDialogs() {
        setSelectedUser(null);
        setEditingUser(null);
        setIsAddDialogOpen(false);
        setForm(emptyForm);
    }

    async function handleCreateUser() {
        try {
            setIsSubmitting(true);

            await createUserAction({
                name: form.name,
                user_name: form.userName,
                password: form.password,
                role: form.role,
                branch_id: form.branchId || null,
            });

            closeDialogs();

            await loadUsers();
        } catch (error) {
            console.error("Failed to create user:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUpdateUser() {
        if (!editingUser) return;

        try {
            setIsSubmitting(true);

            await updateUserAction(editingUser.id, {
                name: form.name,
                userName: form.userName,
                role: form.role,
                branchId: form.branchId || null,
            });

            closeDialogs();

            await loadUsers();
        } catch (error) {
            console.error("Failed to update user:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteUser() {
        if (!selectedUser) return;

        // Never allow deleting the final user.
        if (employees.length <= 1) {
            setSelectedUser(null);
            return;
        }

        try {
            setIsSubmitting(true);

            await deleteUserAction(selectedUser.id);

            setSelectedUser(null);

            await loadUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateForm<K extends keyof UserForm>(
        field: K,
        value: UserForm[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-gray-50 p-4 pb-24 md:p-8"
        >
            <div className="mx-auto max-w-4xl space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
                        المستخدمون
                    </h1>
                </div>

                {/* Users */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-7 w-7 animate-spin text-gray-600" />
                    </div>
                ) : employees.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                        <User className="mx-auto h-10 w-10 text-gray-300" />

                        <p className="mt-4 text-base font-bold text-gray-800">
                            لا يوجد مستخدمون
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-500">
                            أضف أول مستخدم إلى مطعمك.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {employees.map((user) => {
                            const isAdmin = user.role === "admin";

                            return (
                                <div
                                    key={user.id}
                                    className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="space-y-3">

                                        {/* User header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-extrabold text-gray-950">
                                                    {user.name}
                                                </h3>

                                                <p
                                                    className="text-sm font-semibold text-gray-500"
                                                    dir="ltr"
                                                >
                                                    {user.userName}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    onClick={() => openEditDialog(user)}
                                                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-700"
                                                    title="تعديل"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    disabled={employees.length <= 1}
                                                    onClick={() => {
                                                        if (employees.length > 1) {
                                                            setSelectedUser(user);
                                                        }
                                                    }}
                                                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                                                    title={
                                                        employees.length <= 1
                                                            ? "لا يمكن حذف المستخدم الوحيد"
                                                            : "حذف"
                                                    }
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">

                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 font-bold text-blue-800">
                                                <Shield size={14} />
                                                {user.role}
                                            </span>

                                            {!isAdmin && user.branch && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 font-bold text-gray-800">
                                                    <Building2 size={14} />
                                                    {user.branch.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add button */}
                <div className="flex justify-start pt-4">
                    <button
                        type="button"
                        onClick={openAddDialog}
                        className="inline-flex hover:cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors "
                    >
                        <Plus size={18} />
                        إضافة مستخدم جديد
                    </button>
                </div>
            </div>

            {/* ====================================================== */}
            {/* Delete Dialog */}
            {/* ====================================================== */}

            <Dialog
                open={selectedUser !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedUser(null);
                    }
                }}
            >
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-gray-950">
                            حذف المستخدم
                        </DialogTitle>

                        <DialogDescription className="font-medium text-gray-600">
                            هل أنت متأكد أنك تريد حذف المستخدم{" "}
                            <span className="font-extrabold text-gray-950">
                                {selectedUser?.name}
                            </span>
                            ؟ لا يمكن التراجع عن هذا الإجراء.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setSelectedUser(null)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-100 disabled:opacity-50"
                        >
                            إلغاء
                        </button>

                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleDeleteUser}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            حذف المستخدم
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ====================================================== */}
            {/* Add User Dialog */}
            {/* ====================================================== */}

            <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAddDialogOpen(false);
                        setForm(emptyForm);
                    }
                }}
            >
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-gray-950">
                            إضافة مستخدم جديد
                        </DialogTitle>

                        <DialogDescription className="font-medium text-gray-600">
                            أدخل معلومات المستخدم الجديد.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                الاسم
                            </label>

                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    updateForm("name", e.target.value)
                                }
                                placeholder="اسم المستخدم"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                اسم المستخدم
                            </label>

                            <input
                                type="text"
                                dir="ltr"
                                value={form.userName}
                                onChange={(e) =>
                                    updateForm("userName", e.target.value)
                                }
                                placeholder="username"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                كلمة المرور
                            </label>

                            <input
                                type="password"
                                dir="ltr"
                                value={form.password}
                                onChange={(e) =>
                                    updateForm("password", e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                الدور
                            </label>

                            <select
                                value={form.role}
                                onChange={(e) =>
                                    updateForm("role", e.target.value as Role)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="employee">موظف</option>
                                <option value="branch_manager">مدير فرع</option>
                                <option value="admin">مدير النظام</option>
                            </select>
                        </div>

                        {/* Branch */}
                        {form.role !== "admin" && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    الفرع
                                </label>

                                <select
                                    value={form.branchId}
                                    onChange={(e) =>
                                        updateForm("branchId", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        "اختر الفرع"
                                    </option>

                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setIsAddDialogOpen(false);
                                setForm(emptyForm);
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                        >
                            إلغاء
                        </button>

                        <button
                            type="button"
                            disabled={
                                isSubmitting ||
                                !form.name ||
                                !form.userName ||
                                !form.password
                            }
                            onClick={handleCreateUser}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            إضافة المستخدم
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ====================================================== */}
            {/* Edit User Dialog */}
            {/* ====================================================== */}

            <Dialog
                open={editingUser !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingUser(null);
                        setForm(emptyForm);
                    }
                }}
            >
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold text-gray-950">
                            تعديل المستخدم
                        </DialogTitle>

                        <DialogDescription className="font-medium text-gray-600">
                            تعديل معلومات{" "}
                            <span className="font-extrabold text-gray-950">
                                {editingUser?.name}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                الاسم
                            </label>

                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    updateForm("name", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                اسم المستخدم
                            </label>

                            <input
                                type="text"
                                dir="ltr"
                                value={form.userName}
                                onChange={(e) =>
                                    updateForm("userName", e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                الدور
                            </label>

                            <select
                                value={form.role}
                                onChange={(e) =>
                                    updateForm("role", e.target.value as Role)
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="employee">موظف</option>
                                <option value="branch_manager">مدير فرع</option>
                                <option value="admin">مدير النظام</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">
                                كلمة المرور الجديدة
                            </label>

                            <input
                                type="password"
                                dir="ltr"
                                value={form.password}
                                onChange={(e) =>
                                    updateForm("password", e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />

                            <p className="text-xs font-medium text-gray-500">
                                اترك الحقل فارغاً إذا كنت لا تريد تغيير كلمة المرور.
                            </p>
                        </div>

                        {/* Branch */}
                        {form.role !== "admin" && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    الفرع
                                </label>

                                <select
                                    value={form.branchId}
                                    onChange={(e) =>
                                        updateForm("branchId", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        "اختر الفرع"
                                    </option>

                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                setEditingUser(null);
                                setForm(emptyForm);
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                        >
                            إلغاء
                        </button>

                        <button
                            type="button"
                            disabled={
                                isSubmitting ||
                                !form.name ||
                                !form.userName
                            }
                            onClick={handleUpdateUser}
                            className="inline-flex bg-primary items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            حفظ التعديلات
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
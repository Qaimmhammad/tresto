"use client";

import { useEffect, useState } from "react";
import {
    Building2,
    Pencil,
    Trash2,
    Plus,
    Loader2,
    MapPin,
} from "lucide-react";

import type Branch from "@/models/branch-model";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    getBranchesAction,
    createBranchAction,
    updateBranchAction,
    deleteBranchAction,
} from "./action";

type BranchForm = {
    name: string;
    address: string;
};

const emptyForm: BranchForm = {
    name: "",
    address: "",
};

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);

    const [selectedBranch, setSelectedBranch] =
        useState<Branch | null>(null);

    const [editingBranch, setEditingBranch] =
        useState<Branch | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] =
        useState(false);

    const [form, setForm] = useState<BranchForm>(emptyForm);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --------------------------------------------------
    // Load branches
    // --------------------------------------------------

    async function loadBranches() {
        try {
            setIsLoading(true);

            const data = await getBranchesAction();

            setBranches(data);
        } catch (error) {
            console.error("Failed to load branches:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadBranches();
    }, []);


    function updateForm<K extends keyof BranchForm>(
        field: K,
        value: BranchForm[K],
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    // --------------------------------------------------
    // Open dialogs
    // --------------------------------------------------

    function openAddDialog() {
        setForm(emptyForm);
        setIsAddDialogOpen(true);
    }

    function openEditDialog(branch: Branch) {
        setEditingBranch(branch);

        setForm({
            name: branch.name,
            address: branch.address ?? "",
        });
    }

    // --------------------------------------------------
    // Close dialogs
    // --------------------------------------------------

    function closeAddDialog() {
        setIsAddDialogOpen(false);
        setForm(emptyForm);
    }

    function closeEditDialog() {
        setEditingBranch(null);
        setForm(emptyForm);
    }

    // --------------------------------------------------
    // Create
    // --------------------------------------------------

    async function handleCreateBranch() {
        if (!form.name.trim()) return;

        try {
            setIsSubmitting(true);

            await createBranchAction({
                name: form.name.trim(),
                address: form.address.trim(),
            });

            closeAddDialog();

            await loadBranches();
        } catch (error) {
            console.error("Failed to create branch:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // --------------------------------------------------
    // Update
    // --------------------------------------------------

    async function handleUpdateBranch() {
        if (!editingBranch) return;

        if (!form.name.trim()) return;

        try {
            setIsSubmitting(true);

            await updateBranchAction(editingBranch.id, {
                name: form.name.trim(),
                address: form.address.trim(),
            });

            closeEditDialog();

            await loadBranches();
        } catch (error) {
            console.error("Failed to update branch:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    async function handleDeleteBranch() {
        if (!selectedBranch) return;

        // Don't allow deleting the only branch.
        if (branches.length <= 1) {
            setSelectedBranch(null);
            return;
        }

        try {
            setIsSubmitting(true);

            await deleteBranchAction(selectedBranch.id);

            setSelectedBranch(null);

            await loadBranches();
        } catch (error) {
            console.error("Failed to delete branch:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-gray-50 p-4 pb-24 md:p-8"
        >
            <div className="mx-auto max-w-4xl space-y-6">

                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
                        الفروع
                    </h1>

                    <button
                        type="button"
                        onClick={openAddDialog}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        <Plus size={18} />

                        إضافة فرع
                    </button>
                </div>

                {/* ================================================= */}
                {/* Loading */}
                {/* ================================================= */}

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-7 w-7 animate-spin text-gray-600" />
                    </div>
                ) : branches.length === 0 ? (

                    /* ================================================= */
                    /* Empty state */
                    /* ================================================= */

                    <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
                        <Building2 className="mx-auto h-10 w-10 text-gray-300" />

                        <p className="mt-4 text-base font-extrabold text-gray-900">
                            لا توجد فروع
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-500">
                            أضف أول فرع إلى مطعمك.
                        </p>

                        <button
                            type="button"
                            onClick={openAddDialog}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white"
                        >
                            <Plus size={17} />

                            إضافة فرع
                        </button>
                    </div>
                ) : (

                    /* ================================================= */
                    /* Branches */
                    /* ================================================= */

                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">

                                    {/* Branch info */}
                                    <div className="flex min-w-0 items-start gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                            <Building2
                                                size={21}
                                                className="text-blue-700"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-extrabold text-gray-950">
                                                {branch.name}
                                            </h3>

                                            {branch.address && (
                                                <div className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-gray-500">
                                                    <MapPin
                                                        size={15}
                                                        className="mt-0.5 shrink-0"
                                                    />

                                                    <span>{branch.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-1">

                                        {/* Edit */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditDialog(branch)
                                            }
                                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-700"
                                            title="تعديل"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            disabled={branches.length <= 1}
                                            onClick={() => {
                                                if (branches.length > 1) {
                                                    setSelectedBranch(branch);
                                                }
                                            }}
                                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                                            title={
                                                branches.length <= 1
                                                    ? "لا يمكن حذف الفرع الوحيد"
                                                    : "حذف"
                                            }
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ================================================= */}
                {/* Add Dialog */}
                {/* ================================================= */}

                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            closeAddDialog();
                        }
                    }}
                >
                    <DialogContent dir="rtl">

                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold text-gray-950">
                                إضافة فرع جديد
                            </DialogTitle>

                            <DialogDescription className="font-semibold text-gray-600">
                                أدخل معلومات الفرع الجديد.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    اسم الفرع
                                </label>

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        updateForm("name", e.target.value)
                                    }
                                    placeholder="مثال: فرع الحلة"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    العنوان
                                </label>

                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) =>
                                        updateForm("address", e.target.value)
                                    }
                                    placeholder="عنوان الفرع"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={closeAddDialog}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-100 disabled:opacity-50"
                            >
                                إلغاء
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isSubmitting ||
                                    !form.name.trim()
                                }
                                onClick={handleCreateBranch}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                إضافة الفرع
                            </button>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ================================================= */}
                {/* Edit Dialog */}
                {/* ================================================= */}

                <Dialog
                    open={editingBranch !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            closeEditDialog();
                        }
                    }}
                >
                    <DialogContent dir="rtl">

                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold text-gray-950">
                                تعديل الفرع
                            </DialogTitle>

                            <DialogDescription className="font-semibold text-gray-600">
                                تعديل معلومات الفرع{" "}
                                <span className="font-extrabold text-gray-950">
                                    {editingBranch?.name}
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    اسم الفرع
                                </label>

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        updateForm("name", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">
                                    العنوان
                                </label>

                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) =>
                                        updateForm("address", e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={closeEditDialog}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-100 disabled:opacity-50"
                            >
                                إلغاء
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isSubmitting ||
                                    !form.name.trim()
                                }
                                onClick={handleUpdateBranch}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                حفظ التعديلات
                            </button>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ================================================= */}
                {/* Delete Dialog */}
                {/* ================================================= */}

                <Dialog
                    open={selectedBranch !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedBranch(null);
                        }
                    }}
                >
                    <DialogContent dir="rtl">

                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold text-gray-950">
                                حذف الفرع
                            </DialogTitle>

                            <DialogDescription className="font-semibold text-gray-600">
                                هل أنت متأكد أنك تريد حذف الفرع{" "}
                                <span className="font-extrabold text-gray-950">
                                    {selectedBranch?.name}
                                </span>
                                ؟ لا يمكن التراجع عن هذا الإجراء.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="gap-2">

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() =>
                                    setSelectedBranch(null)
                                }
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-100 disabled:opacity-50"
                            >
                                إلغاء
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleDeleteBranch}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                            >
                                {isSubmitting && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                حذف الفرع
                            </button>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
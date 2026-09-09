import PageLayout from '@/components/layout/PageLayout';
import { CustomCalendar, CustomInput, CustomNumberInput, CustomSelect, CustomTextarea } from '@/components/forms';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import EditModal from '@/components/shared/customs/EditModal';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Edit2Icon, Layers3, PlusIcon, Trash } from 'lucide-react';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';
import type { ICategory, ITransaction, CategoryPayload, TransactionPayload } from './types';
import useGetCategories from './hooks/useGetCategories';
import useCreateCategory from './hooks/useCreateCategory';
import useUpdateCategory from './hooks/useUpdateCategory';
import useDeleteCategory from './hooks/useDeleteCategory';
import useGetTransactions from './hooks/useGetTransactions';
import useCreateTransaction from './hooks/useCreateTransaction';
import useUpdateTransaction from './hooks/useUpdateTransaction';
import useDeleteTransaction from './hooks/useDeleteTransaction';

type CategoryType = 'income' | 'expense';
type CategoryFormValues = { name: string; type: CategoryType };
type TransactionFormValues = { category_id: string; amount: unknown; transaction_date: Date; note: string };

const categorySchema = z.object({
    name: z.string().min(1, 'اسم الفئة مطلوب'),
    type: z.enum(['income', 'expense']),
});
const transactionSchema = z.object({
    category_id: z.string().min(1, 'نوع المعاملة مطلوب'),
    amount: z.coerce.number().positive('يجب أن يكون المبلغ أكبر من صفر'),
    transaction_date: z.date({ error: 'التاريخ مطلوب' }),
    note: z.string(),
});
const categoryTypeLabels: Record<CategoryType, string> = { income: 'إيراد (+)', expense: 'مصروف (-)' };

function FinancialPage() {
    const [activeTab, setActiveTab] = useState('categories');
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory>();
    const [editingTransaction, setEditingTransaction] = useState<ITransaction>();
    const [deletingCategory, setDeletingCategory] = useState<ICategory>();
    const [deletingTransaction, setDeletingTransaction] = useState<ITransaction>();

    // ── Queries ─────────────────────────────────────────────────────────────
    const { data: categories = [], isLoading: loadingCategories } = useGetCategories();
    const { data: transactions = [], isLoading: loadingTransactions } = useGetTransactions();

    // ── Category mutations ──────────────────────────────────────────────────
    const createCategory = useCreateCategory({ onSuccess: () => { setIsCategoryFormOpen(false); } });
    const updateCategory = useUpdateCategory({ onSuccess: () => { setIsCategoryFormOpen(false); setEditingCategory(undefined); } });
    const deleteCategory = useDeleteCategory({ onSuccess: () => setDeletingCategory(undefined) });

    // ── Transaction mutations ───────────────────────────────────────────────
    const createTransaction = useCreateTransaction({ onSuccess: () => { setIsTransactionFormOpen(false); } });
    const updateTransaction = useUpdateTransaction({ onSuccess: () => { setIsTransactionFormOpen(false); setEditingTransaction(undefined); } });
    const deleteTransaction = useDeleteTransaction({ onSuccess: () => setDeletingTransaction(undefined) });

    const handleCategorySubmit = (values: CategoryFormValues) => {
        const payload: CategoryPayload = { name: values.name, type: values.type };
        if (editingCategory) {
            updateCategory.mutate({ id: editingCategory.id, values: payload });
        } else {
            createCategory.mutate(payload);
        }
    };

    const handleTransactionSubmit = (values: TransactionFormValues) => {
        const payload: TransactionPayload = {
            category_id: Number(values.category_id),
            amount: Number(values.amount),
            transaction_date: values.transaction_date instanceof Date
                ? values.transaction_date.toISOString().split('T')[0]
                : String(values.transaction_date),
            note: values.note,
        };
        if (editingTransaction) {
            updateTransaction.mutate({ id: editingTransaction.id, values: payload });
        } else {
            createTransaction.mutate(payload);
        }
    };

    const openCategoryForm = (category?: ICategory) => {
        setEditingCategory(category);
        setIsCategoryFormOpen(true);
    };
    const openTransactionForm = (transaction?: ITransaction) => {
        setEditingTransaction(transaction);
        setIsTransactionFormOpen(true);
    };

    // Close category form: clear editing state too
    const handleCategoryFormOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        const next = typeof value === 'function' ? value(isCategoryFormOpen) : value;
        if (!next) setEditingCategory(undefined);
        setIsCategoryFormOpen(next);
    };

    // Close transaction form: clear editing state too
    const handleTransactionFormOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        const next = typeof value === 'function' ? value(isTransactionFormOpen) : value;
        if (!next) setEditingTransaction(undefined);
        setIsTransactionFormOpen(next);
    };

    const categoryById = new Map(categories.map((c) => [c.id, c]));

    return (
        <PageLayout
            title='المالية'
            subtitle='إدارة الفئات والمعاملات المالية.'
            primaryLabel={
                <>
                    <PlusIcon className='text-white' />
                    {activeTab === 'categories' ? 'إضافة فئة' : 'إضافة معاملة'}
                </>
            }
            showPrimaryButton
            onPrimaryClick={() => activeTab === 'categories' ? openCategoryForm() : openTransactionForm()}
        >
            <Tabs
                defaultValue='categories'
                dir='rtl'
                onValueChange={setActiveTab}
            >
                <TabsList
                    className='h-auto self-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-1'
                    variant='line'
                >
                    <TabsTrigger
                        className='gap-2 rounded-md border-b-0 px-5 py-2.5 font-semibold text-neutral-500 data-active:bg-white data-active:text-primary-500 data-active:shadow-sm'
                        value='categories'
                    >
                        <Layers3 className='size-4' />
                        الفئات
                    </TabsTrigger>
                    <TabsTrigger
                        className='gap-2 rounded-md border-b-0 px-5 py-2.5 font-semibold text-neutral-500 data-active:bg-white data-active:text-primary-500 data-active:shadow-sm'
                        value='transactions'
                    >
                        <ClipboardList className='size-4' />
                        سجل المعاملات
                    </TabsTrigger>
                </TabsList>

                {/* ── Categories tab ──────────────────────────────────────── */}
                <TabsContent className='mt-6' value='categories'>
                    <div className='overflow-x-auto rounded border border-neutral-100 bg-white' dir='rtl'>
                        <div className='grid grid-cols-[1fr_180px_120px] border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-500'>
                            <span>اسم الفئة</span><span>نوع الفئة</span><span>الإجراءات</span>
                        </div>
                        {loadingCategories
                            ? <p className='px-5 py-10 text-center text-sm text-neutral-400'>جارٍ التحميل…</p>
                            : categories.length === 0
                                ? <p className='px-5 py-10 text-center text-sm text-neutral-400'>لا توجد فئات مضافة بعد.</p>
                                : categories.map((category) => (
                                    <div
                                        className='grid grid-cols-[1fr_180px_120px] items-center border-b border-neutral-100 px-5 py-4 last:border-b-0'
                                        key={category.id}
                                    >
                                        <span>{category.name}</span>
                                        <span className={category.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                                            {categoryTypeLabels[category.type]}
                                        </span>
                                        <FinancialActions
                                            onDelete={() => setDeletingCategory(category)}
                                            onEdit={() => openCategoryForm(category)}
                                        />
                                    </div>
                                ))
                        }
                    </div>
                </TabsContent>

                {/* ── Transactions tab ────────────────────────────────────── */}
                <TabsContent className='mt-6' value='transactions'>
                    <div className='overflow-x-auto rounded border border-neutral-100 bg-white' dir='rtl'>
                        <div className='grid grid-cols-[1fr_150px_150px_1.5fr_120px] border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-500'>
                            <span>نوع المعاملة</span><span>المبلغ</span><span>التاريخ</span><span>الملاحظات</span><span>الإجراءات</span>
                        </div>
                        {loadingTransactions
                            ? <p className='px-5 py-10 text-center text-sm text-neutral-400'>جارٍ التحميل…</p>
                            : transactions.length === 0
                                ? <p className='px-5 py-10 text-center text-sm text-neutral-400'>لا توجد معاملات مضافة بعد.</p>
                                : transactions.map((transaction) => (
                                    <div
                                        className='grid grid-cols-[1fr_150px_150px_1.5fr_120px] items-center border-b border-neutral-100 px-5 py-4 last:border-b-0'
                                        key={transaction.id}
                                    >
                                        <span>{transaction.category?.name ?? categoryById.get(transaction.category_id)?.name ?? '-'}</span>
                                        <span>{transaction.amount.toLocaleString('ar-EG')} ج.م</span>
                                        <span>{new Date(transaction.transaction_date).toLocaleDateString('ar-EG')}</span>
                                        <span className='text-neutral-500'>{transaction.note || '-'}</span>
                                        <FinancialActions
                                            onDelete={() => setDeletingTransaction(transaction)}
                                            onEdit={() => openTransactionForm(transaction)}
                                        />
                                    </div>
                                ))
                        }
                    </div>
                </TabsContent>
            </Tabs>

            {/* ── Forms ──────────────────────────────────────────────────── */}
            <CategoryForm
                category={editingCategory}
                isOpen={isCategoryFormOpen}
                onSubmit={handleCategorySubmit}
                setIsOpen={handleCategoryFormOpen}
                isPending={createCategory.isPending || updateCategory.isPending}
            />
            <TransactionForm
                categories={categories}
                isOpen={isTransactionFormOpen}
                onSubmit={handleTransactionSubmit}
                setIsOpen={handleTransactionFormOpen}
                transaction={editingTransaction}
                isPending={createTransaction.isPending || updateTransaction.isPending}
            />

            {/* ── Confirm dialogs ─────────────────────────────────────────── */}
            <ConfirmDialog
                open={!!deletingCategory}
                title='حذف الفئة'
                description={<p>هل أنت متأكد من رغبتك في حذف هذه الفئة؟</p>}
                confirmText='حذف'
                cancelText='إلغاء'
                mode='destructive'
                onConfirm={() => { if (deletingCategory) deleteCategory.mutate(deletingCategory.id); }}
                onCancel={() => setDeletingCategory(undefined)}
            />
            <ConfirmDialog
                open={!!deletingTransaction}
                title='حذف المعاملة'
                description={<p>هل أنت متأكد من رغبتك في حذف هذه المعاملة؟</p>}
                confirmText='حذف'
                cancelText='إلغاء'
                mode='destructive'
                onConfirm={() => { if (deletingTransaction) deleteTransaction.mutate(deletingTransaction.id); }}
                onCancel={() => setDeletingTransaction(undefined)}
            />
        </PageLayout>
    );
}

// ── Category Form ─────────────────────────────────────────────────────────────

type CategoryFormProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onSubmit: (values: CategoryFormValues) => void;
    category?: ICategory;
    isPending?: boolean;
};
function CategoryForm({ isOpen, setIsOpen, onSubmit, category, isPending }: CategoryFormProps) {
    const form = useLiveForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '', type: 'income' },
    });

    // Reset form values whenever the editing target changes or the modal opens
    useEffect(() => {
        form.reset({
            name: category?.name ?? '',
            type: category?.type ?? 'income',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, isOpen]);

    return (
        <Form {...form}>
            <form id='category-form' onSubmit={form.handleSubmit(onSubmit)}>
                <EditModal
                    formId='category-form'
                    isOpen={isOpen}
                    submitLabel={category ? 'حفظ التعديلات' : 'إضافة'}
                    title={category ? 'تعديل الفئة' : 'إضافة فئة'}
                    toggle={setIsOpen}
                    isLoading={isPending}
                >
                    <CustomInput control={form.control} label='اسم الفئة' name='name' placeholder='مثل: اشتراكات، كتب، إيجار' required />
                    <CustomSelect
                        control={form.control}
                        label='نوع الفئة'
                        name='type'
                        options={[{ value: 'income', label: 'إيراد (+)' }, { value: 'expense', label: 'مصروف (-)' }]}
                        placeholder='اختر نوع الفئة'
                        required
                    />
                </EditModal>
            </form>
        </Form>
    );
}

// ── Transaction Form ──────────────────────────────────────────────────────────

type TransactionFormProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onSubmit: (values: TransactionFormValues) => void;
    categories: ICategory[];
    transaction?: ITransaction;
    isPending?: boolean;
};
function TransactionForm({ isOpen, setIsOpen, onSubmit, categories, transaction, isPending }: TransactionFormProps) {
    const form = useLiveForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: { category_id: '', amount: 0, transaction_date: new Date(), note: '' },
    });

    // Reset form values whenever the editing target changes or the modal opens
    useEffect(() => {
        form.reset({
            category_id: transaction ? String(transaction.category_id) : '',
            amount: transaction?.amount ?? 0,
            transaction_date: transaction?.transaction_date
                ? new Date(transaction.transaction_date)
                : new Date(),
            note: transaction?.note ?? '',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction, isOpen]);

    return (
        <Form {...form}>
            <form id='transaction-form' onSubmit={form.handleSubmit(onSubmit)}>
                <EditModal
                    formId='transaction-form'
                    isOpen={isOpen}
                    submitLabel={transaction ? 'حفظ التعديلات' : 'إضافة'}
                    title={transaction ? 'تعديل المعاملة' : 'إضافة معاملة'}
                    toggle={setIsOpen}
                    isLoading={isPending}
                >
                    <CustomSelect
                        control={form.control}
                        label='نوع المعاملة'
                        name='category_id'
                        options={categories.map((c) => ({
                            value: String(c.id),
                            label: `${c.name} - ${categoryTypeLabels[c.type]}`,
                        }))}
                        placeholder='اختر الفئة'
                        required
                    />
                    <CustomNumberInput control={form.control} label='المبلغ' name='amount' placeholder='أدخل المبلغ' required />
                    <CustomCalendar control={form.control} label='التاريخ' name='transaction_date' placeholder='اختر التاريخ' required />
                    <CustomTextarea control={form.control} label='ملاحظات / البيان' name='note' optional placeholder='مثل: اشتراك شهر أغسطس أو صيانة تكييف' />
                </EditModal>
            </form>
        </Form>
    );
}

// ── Actions ───────────────────────────────────────────────────────────────────

type FinancialActionsProps = { onEdit: () => void; onDelete: () => void };
function FinancialActions({ onEdit, onDelete }: FinancialActionsProps) {
    return (
        <div className='flex items-center gap-0.5'>
            <Button aria-label='حذف' onClick={onDelete} size='sm' variant='ghost'><Trash className='size-4' /></Button>
            <Button aria-label='تعديل' onClick={onEdit} size='sm' variant='ghost'><Edit2Icon className='size-4.5' /></Button>
        </div>
    );
}

export default FinancialPage;

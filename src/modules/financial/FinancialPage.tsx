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
import { useState } from 'react';
import { z } from 'zod';

type CategoryType = 'income' | 'expense';
type Category = { id: number; name: string; type: CategoryType };
type Transaction = { id: number; categoryId: number; amount: number; date: Date; notes: string };
type CategoryFormValues = { name: string; type: CategoryType };
type TransactionFormValues = { categoryId: string; amount: unknown; date: Date; notes: string };

const categorySchema = z.object({
    name: z.string().min(1, 'اسم الفئة مطلوب'),
    type: z.enum(['income', 'expense']),
});
const transactionSchema = z.object({
    categoryId: z.string().min(1, 'نوع المعاملة مطلوب'),
    amount: z.coerce.number().positive('يجب أن يكون المبلغ أكبر من صفر'),
    date: z.date({ error: 'التاريخ مطلوب' }),
    notes: z.string(),
});
const categoryTypeLabels: Record<CategoryType, string> = { income: 'إيراد (+)', expense: 'مصروف (-)' };

const initialCategories: Category[] = [
    { id: 1, name: 'اشتراكات', type: 'income' },
    { id: 2, name: 'كتب ومذكرات', type: 'income' },
    { id: 3, name: 'إيجار', type: 'expense' },
    { id: 4, name: 'مرتبات معلمين', type: 'expense' },
    { id: 5, name: 'كهرباء', type: 'expense' },
];

const initialTransactions: Transaction[] = [
    { id: 1, categoryId: 1, amount: 1200, date: new Date(2026, 7, 1), notes: 'اشتراك شهر أغسطس' },
    { id: 2, categoryId: 2, amount: 350, date: new Date(2026, 7, 3), notes: 'شراء كتب للطلاب' },
    { id: 3, categoryId: 4, amount: 8500, date: new Date(2026, 7, 5), notes: 'مرتبات المعلمين' },
    { id: 4, categoryId: 5, amount: 740, date: new Date(2026, 7, 8), notes: 'فاتورة كهرباء المركز' },
];

function FinancialPage() {
    const [activeTab, setActiveTab] = useState('categories');
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [editingCategory, setEditingCategory] = useState<Category>();
    const [editingTransaction, setEditingTransaction] = useState<Transaction>();
    const [deletingCategory, setDeletingCategory] = useState<Category>();
    const [deletingTransaction, setDeletingTransaction] = useState<Transaction>();

    const addCategory = (values: CategoryFormValues) => {
        setCategories((current) => editingCategory
            ? current.map((category) => category.id === editingCategory.id ? { ...category, ...values } : category)
            : [...current, { ...values, id: Date.now() }]);
        setEditingCategory(undefined);
        setIsCategoryFormOpen(false);
    };
    const addTransaction = (values: TransactionFormValues) => {
        const transactionValues = {
            categoryId: Number(values.categoryId),
            amount: Number(values.amount),
            date: values.date,
            notes: values.notes,
        };
        setTransactions((current) => editingTransaction
            ? current.map((transaction) => transaction.id === editingTransaction.id ? { ...transaction, ...transactionValues } : transaction)
            : [...current, { id: Date.now(), ...transactionValues }]);
        setEditingTransaction(undefined);
        setIsTransactionFormOpen(false);
    };
    const openCategoryForm = (category?: Category) => {
        setEditingCategory(category);
        setIsCategoryFormOpen(true);
    };
    const openTransactionForm = (transaction?: Transaction) => {
        setEditingTransaction(transaction);
        setIsTransactionFormOpen(true);
    };
    const categoryById = new Map(categories.map((category) => [category.id, category]));

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
                <TabsContent className='mt-6' value='categories'>
                    <div
                        className='overflow-x-auto rounded border border-neutral-100 bg-white'
                        dir='rtl'
                    >
                        <div className='grid grid-cols-[1fr_180px_120px] border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-500'><span>اسم الفئة</span><span>نوع الفئة</span><span>الإجراءات</span></div>
                        {categories.length === 0 ? <p className='px-5 py-10 text-center text-sm text-neutral-400'>لا توجد فئات مضافة بعد.</p> : categories.map((category) => <div className='grid grid-cols-[1fr_180px_120px] items-center border-b border-neutral-100 px-5 py-4 last:border-b-0' key={category.id}><span>{category.name}</span><span className={category.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>{categoryTypeLabels[category.type]}</span><FinancialActions onDelete={() => setDeletingCategory(category)} onEdit={() => openCategoryForm(category)} /></div>)}
                    </div>
                </TabsContent>
                <TabsContent className='mt-6' value='transactions'>
                    <div
                        className='overflow-x-auto rounded border border-neutral-100 bg-white'
                        dir='rtl'
                    >
                        <div className='grid grid-cols-[1fr_150px_150px_1.5fr_120px] border-b border-neutral-100 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-500'><span>نوع المعاملة</span><span>المبلغ</span><span>التاريخ</span><span>الملاحظات</span><span>الإجراءات</span></div>
                        {transactions.length === 0 ? <p className='px-5 py-10 text-center text-sm text-neutral-400'>لا توجد معاملات مضافة بعد.</p> : transactions.map((transaction) => <div className='grid grid-cols-[1fr_150px_150px_1.5fr_120px] items-center border-b border-neutral-100 px-5 py-4 last:border-b-0' key={transaction.id}><span>{categoryById.get(transaction.categoryId)?.name}</span><span>{transaction.amount.toLocaleString('ar-EG')} ج.م</span><span>{transaction.date.toLocaleDateString('ar-EG')}</span><span className='text-neutral-500'>{transaction.notes || '-'}</span><FinancialActions onDelete={() => setDeletingTransaction(transaction)} onEdit={() => openTransactionForm(transaction)} /></div>)}
                    </div>
                </TabsContent>
            </Tabs>
            <CategoryForm category={editingCategory} isOpen={isCategoryFormOpen} onSubmit={addCategory} setIsOpen={setIsCategoryFormOpen} />
            <TransactionForm categories={categories} isOpen={isTransactionFormOpen} onSubmit={addTransaction} setIsOpen={setIsTransactionFormOpen} transaction={editingTransaction} />
            <ConfirmDialog open={!!deletingCategory} title='حذف الفئة' description={<p>هل أنت متأكد من رغبتك في حذف هذه الفئة؟</p>} confirmText='حذف' cancelText='إلغاء' mode='destructive' onConfirm={() => { if (deletingCategory) setCategories((current) => current.filter((category) => category.id !== deletingCategory.id)); setDeletingCategory(undefined); }} onCancel={() => setDeletingCategory(undefined)} />
            <ConfirmDialog open={!!deletingTransaction} title='حذف المعاملة' description={<p>هل أنت متأكد من رغبتك في حذف هذه المعاملة؟</p>} confirmText='حذف' cancelText='إلغاء' mode='destructive' onConfirm={() => { if (deletingTransaction) setTransactions((current) => current.filter((transaction) => transaction.id !== deletingTransaction.id)); setDeletingTransaction(undefined); }} onCancel={() => setDeletingTransaction(undefined)} />
        </PageLayout>
    );
}

type CategoryFormProps = { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; onSubmit: (values: CategoryFormValues) => void; category?: Category };
function CategoryForm({ isOpen, setIsOpen, onSubmit, category }: CategoryFormProps) {
    const form = useLiveForm<CategoryFormValues>({ resolver: zodResolver(categorySchema), defaultValues: { name: category?.name ?? '', type: category?.type ?? 'income' } });
    return <Form {...form}><form id='category-form' onSubmit={form.handleSubmit(onSubmit)}><EditModal formId='category-form' isOpen={isOpen} submitLabel={category ? 'حفظ التعديلات' : 'إضافة'} title={category ? 'تعديل الفئة' : 'إضافة فئة'} toggle={setIsOpen}><CustomInput control={form.control} label='اسم الفئة' name='name' placeholder='مثل: اشتراكات، كتب، إيجار' required /><CustomSelect control={form.control} label='نوع الفئة' name='type' options={[{ value: 'income', label: 'إيراد (+)' }, { value: 'expense', label: 'مصروف (-)' }]} placeholder='اختر نوع الفئة' required /></EditModal></form></Form>;
}

type TransactionFormProps = { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; onSubmit: (values: TransactionFormValues) => void; categories: Category[]; transaction?: Transaction };
function TransactionForm({ isOpen, setIsOpen, onSubmit, categories, transaction }: TransactionFormProps) {
    const form = useLiveForm<TransactionFormValues>({ resolver: zodResolver(transactionSchema), defaultValues: { categoryId: transaction ? String(transaction.categoryId) : '', amount: transaction?.amount ?? 0, date: transaction?.date ?? new Date(), notes: transaction?.notes ?? '' } });
    return <Form {...form}><form id='transaction-form' onSubmit={form.handleSubmit(onSubmit)}><EditModal formId='transaction-form' isOpen={isOpen} submitLabel={transaction ? 'حفظ التعديلات' : 'إضافة'} title={transaction ? 'تعديل المعاملة' : 'إضافة معاملة'} toggle={setIsOpen}><CustomSelect control={form.control} label='نوع المعاملة' name='categoryId' options={categories.map((category) => ({ value: String(category.id), label: `${category.name} - ${categoryTypeLabels[category.type]}` }))} placeholder='اختر الفئة' required /><CustomNumberInput control={form.control} label='المبلغ' name='amount' placeholder='أدخل المبلغ' required /><CustomCalendar control={form.control} label='التاريخ' name='date' placeholder='اختر التاريخ' required /><CustomTextarea control={form.control} label='ملاحظات / البيان' name='notes' optional placeholder='مثل: اشتراك شهر أغسطس أو صيانة تكييف' /></EditModal></form></Form>;
}

type FinancialActionsProps = { onEdit: () => void; onDelete: () => void };
function FinancialActions({ onEdit, onDelete }: FinancialActionsProps) {
    return <div className='flex items-center gap-0.5'><Button aria-label='حذف' onClick={onDelete} size='sm' variant='ghost'><Trash className='size-4' /></Button><Button aria-label='تعديل' onClick={onEdit} size='sm' variant='ghost'><Edit2Icon className='size-4.5' /></Button></div>;
}

export default FinancialPage;

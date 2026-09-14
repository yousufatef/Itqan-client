export type TRole = 'admin' | 'parent' | 'teacher';

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid';

export interface IFinancialInvoice {
    id: string;
    studentName: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
}

export interface IStudent {
    id: string;
    name: string;
    phone: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
}

// ── Categories ──────────────────────────────────────────────────────────────

export type CategoryType = 'income' | 'expense';

export interface ICategory {
    id: number;
    name: string;
    type: CategoryType;
}

export type CategoryPayload = {
    name: string;
    type: CategoryType;
};

// ── Transactions ─────────────────────────────────────────────────────────────

export interface ITransaction {
    id: number;
    category_id: number;
    amount: number;
    transaction_date: string;
    notes: string;
    category?: ICategory;
}

export type TransactionPayload = {
    category_id: number;
    amount: number;
    transaction_date: string;
    notes: string;
};
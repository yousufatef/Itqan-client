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
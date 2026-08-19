export type TRole = 'admin' | 'parent' | 'teacher';

export interface IStudent {
    id: string;
    name: string;
    phone: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
}
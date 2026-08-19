export type TRole = 'admin' | 'parent' | 'teacher';

export interface IUser {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: TRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
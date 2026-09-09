export type TRole = 'admin' | 'parent' | 'teacher';

export interface IStudent {
    id: number;
    name: string;
    phoneNumber: string;
    birthOfDate: string;
    parent: {
        id: number;
        parentName: string;
    };
    createdAt: string;
    updatedAt: string;
}
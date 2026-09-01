export type TRole = 'super_admin' | 'admin' | 'parent' | 'teacher';

export interface IUser {
    id: number;
    username: string;
    email: string;
    phoneNumber: string | null;
    userType: TRole;
    isActive: boolean;
    created_at: string;
}

export interface UsersResponse {
    isSuccess: boolean;
    message: string;
    errors: null | unknown;
    statusCode: number;
    result: {
        data: IUser[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface CreateUserFormValues {
    username: string;
    email: string;
    phoneNumber: string | null;
    userType: TRole;
    password: string;
    confirmPassword: string;
}
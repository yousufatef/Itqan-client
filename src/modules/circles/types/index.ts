export interface ITimeObject {
    hour: number;
    minute: number;
}

export interface ICircleStudent {
    id: number;
    name: string;
}

export interface ICircleTeacher {
    id: number;
    username: string;
    email?: string;
}

export interface ICircle {
    circleName: any;
    id: number | string;
    name: string;
    teacherId: number;
    teacherName?: string;
    teacher?: ICircleTeacher;
    studentIds?: number[];
    students?: ICircleStudent[];
    days: string[];
    timeFrom?: ITimeObject | string;
    timeTo?: ITimeObject | string;
    startTime?: ITimeObject | string;
    endTime?: ITimeObject | string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCirclePayload {
    name: string;
    teacherId: number;
    studentIds: number[];
    days: string[];
    startTime: string;
    endTime: string;
}

export interface UpdateCirclePayload {
    id?: number | string;
    name: string;
    teacherId: number;
    studentIds: number[];
    days: string[];
    startTime: string;
    endTime: string;
    isActive: boolean;
}

export type AttendanceStatusType = 'present' | 'absent' | 'PRESENT' | 'ABSENT';

export interface IDailyRecord {
    id?: number | string | null;
    recordId?: number | string | null;
    circleId?: number | string;
    studentId: number;
    studentName?: string;
    attendanceStatus?: AttendanceStatusType | null;
    evaluation?: string | null;
    notes?: string | null;
    date?: string;
    createdAt?: string;
}

export interface CreateDailyRecordItem {
    studentId: number;
    attendanceStatus: AttendanceStatusType;
    evaluation?: string;
    notes?: string;
}

export interface UpdateDailyRecordItem {
    attendanceStatus?: AttendanceStatusType;
    evaluation?: string;
    notes?: string;
}

export interface CirclesResponse {
    isSuccess?: boolean;
    message?: string;
    errors?: unknown;
    statusCode?: number;
    result: {
        data: ICircle[];
        totalCount: number;
        meta?: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface CircleSingleResponse {
    isSuccess?: boolean;
    message?: string;
    result: ICircle;
}

export interface DailyRecordsResponse {
    isSuccess?: boolean;
    message?: string;
    errors?: unknown;
    statusCode?: number;
    result?: {
        students?: IDailyRecord[];
    } | IDailyRecord[];
}

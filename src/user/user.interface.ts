export interface IUser {
    id: string;
    email: string;
    name?: string | null;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface IUserResponse {
    id: string;
    email: string;
    name?: string | null;
};

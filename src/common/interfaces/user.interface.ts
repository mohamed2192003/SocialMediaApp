import { GenderEnum, ProviderEnum, RoleEnum } from "../enums/index.js";
export interface IUser { 
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    profilePic?: string;
    profileCoverPic?: string[];
    gender?: GenderEnum;
    role?: RoleEnum;
    provider?: ProviderEnum;
    EmailConfirmation: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
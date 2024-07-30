import { Theme } from "./theme.interface";

export interface User {
    username: string;
    email: string;
    token?: string;
    subscriptions?: Theme[];
}
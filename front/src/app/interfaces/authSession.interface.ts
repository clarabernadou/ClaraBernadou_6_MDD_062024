export interface AuthToken {
    token: string;
}

export interface Session {
    isLogged: boolean;
    sessionInformation?: AuthToken;
}
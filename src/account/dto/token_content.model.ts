export class TokenContentModel{
    userID: string;
    accountID: string;
    sessionID?: string;
}

export class RefreshTokenModel {
    sessionID:string;
}

export class OneTimeAccessTokenModel {
    sessionID: string;
}
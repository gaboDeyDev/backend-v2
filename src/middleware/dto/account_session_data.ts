export class MinimalAccountSessionDataDto {
    id: string;
    attempts: number;
    active: boolean
    closed: boolean;
    lastAccess: string;
    expiresAt: string;
    closedReason: string;
    account: AccountData;
}

export class AccountData {
    id: string;
    active: boolean
    status: string;
    admin?: any;
    customer?: any;
}
import { Logger } from '@nestjs/common';
import { AccountAuthModel } from './account-auth.model';
export declare class AccountAuthService {
    private accountModel;
    constructor(accountModel: typeof AccountAuthModel);
    logger: Logger;
    findByUsername(username: string): Promise<AccountAuthModel | null>;
    createAccount(username: string, password: string): Promise<void>;
    login(username: string, password: string): Promise<boolean>;
}

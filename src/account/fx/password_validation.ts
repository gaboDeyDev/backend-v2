import * as bcrypt from 'bcryptjs';

export default (
    hash: string, 
    password: string
): boolean => bcrypt.compareSync(password, hash);
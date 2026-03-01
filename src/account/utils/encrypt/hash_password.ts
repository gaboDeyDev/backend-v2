import * as bcrypt from 'bcryptjs';

export default (text: string, salt:number) => {

    const saltGenerated = bcrypt.genSaltSync(salt);

    return bcrypt.hashSync(text, saltGenerated);
}
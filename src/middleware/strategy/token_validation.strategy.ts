import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TokenValidationStrategy extends PassportStrategy(Strategy, 'single-auth') {

    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET!,
        })
    }

    async validate(payload: any): Promise<any> {
        return payload;
    }

}
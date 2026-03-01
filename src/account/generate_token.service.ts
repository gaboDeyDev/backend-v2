import { OneTimeAccessTokenModel, RefreshTokenModel, TokenContentModel } from './dto/token_content.model';
import { TokenType } from './types/token.type';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GenerateTokenService {

    constructor(
        private readonly jwtService: JwtService,
    ){}

    async createToken(tokenType: TokenType,  data: TokenContentModel | RefreshTokenModel | OneTimeAccessTokenModel) {

        const type = tokenType === 'access' 
            ? 'ACCESS_TOKEN'
            : tokenType === 'refresh' ? 'REFRESH_TOKEN' : 'ACCESS_TOKEN';
        
        const secretToken = process.env.SECRET;

        return this.jwtService.signAsync(data, { 
            secret: secretToken,
            audience: 'dey',
            algorithm: 'HS512',
            expiresIn: tokenType === 'access' ? '15m' : tokenType === 'refresh' ? '7d' : '10d'
        });
    }
}

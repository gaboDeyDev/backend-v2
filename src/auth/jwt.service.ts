import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: any): string {
    const secret = this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
    
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as any,
    });
  }

  verifyToken(token: string): any {
    const secret = this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  type?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: Omit<User, 'googleId'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateGoogleUser(profile: {
    id: string;
    emails?: { value: string }[];
    displayName?: string;
  }): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || 'User';
    if (!email) throw new Error('Google profile missing email');
    return this.usersService.findOrCreateByGoogle(profile.id, email, name);
  }

  async login(user: User): Promise<TokenResponse> {
    const { access_token, refresh_token } = await this.issueTokenPair(user);
    const { googleId: _, ...safeUser } = user;
    return { access_token, refresh_token, user: safeUser };
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify<JwtPayload & { type: string }>(refreshToken);
      if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid refresh token');
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async issueTokenPair(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const accessPayload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(accessPayload);

    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
    const refresh_token = this.jwtService.sign(
      { ...accessPayload, type: 'refresh' },
      { expiresIn: refreshExpiresIn },
    );

    return { access_token, refresh_token };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    if (payload.type === 'refresh') return null;
    return this.usersService.findById(payload.sub);
  }
}

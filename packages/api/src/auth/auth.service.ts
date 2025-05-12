import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    // inicializa o cliente OAuth2 com o CLIENT_ID do Google
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID não definido');
    }
    this.googleClient = new OAuth2Client(clientId);
  }

  // valida idToken e retorna o usuário Prisma
  async loginWithGoogle(idToken: string) {
    let payload: TokenPayload;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.config.get<string>('GOOGLE_CLIENT_ID'),
      });
      payload = ticket.getPayload()!;
    } catch {
      throw new UnauthorizedException('ID token inválido');
    }

    const email = payload.email!;
    const name = payload.name;
    const image = payload.picture;

    // findOrCreate
    const user = await this.usersService.findOrCreateByGoogle(
      email,
      name,
      image,
    );

    // cria o JWT
    const jwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(jwtPayload);

    return { accessToken, user };
  }
}

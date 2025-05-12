import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModule,
  JwtModuleOptions,
  JwtModuleAsyncOptions,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>('JWT_SECRET')!,
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
    },
  }),
};

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}

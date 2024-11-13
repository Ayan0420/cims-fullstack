import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

/**
 *install: 
 npm install @nestjs/jwt @nestjs/passport passport bcryptjs passport-jwt passport-local 
 */

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // this is for jwt
        JwtModule.registerAsync({
            // to use env variables
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn: config.get<string | number>('JWT_EXPIRES'),
                    },
                };
            },
        }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    // this is to allow other modules to import this modules
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}

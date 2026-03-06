import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-me',
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        // Solo enviamos lo necesario a req.user
        const { password, ...result } = user;
        return result;
    }
}

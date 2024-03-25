import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/auth.entity';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('SECRET_KEY_JWT'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayloadInterface): Promise<User> {
        const { email } = payload;

        const user = await this.userRepository.findOneBy({ email });

        if (!user) throw new UnauthorizedException('Token is not valid');

        if (!user.isActive)
            throw new UnauthorizedException('User is not active');

        return user;
    }
}

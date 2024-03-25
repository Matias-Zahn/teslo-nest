import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepostory: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const user = this.userRepostory.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });

            await this.userRepostory.save(user);

            return {
                ...user,
                token: this.getJwtToken({ email: user.email }),
            };
        } catch (error) {
            console.error(error);

            this.handleError(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const { email, password } = loginUserDto;

            const user = await this.userRepostory.findOne({
                where: { email },
                select: { email: true, password: true },
            });

            if (!user)
                throw new UnauthorizedException(
                    'Credentials are not valid! (Email)',
                );

            const isValidPassword = bcrypt.compareSync(password, user.password);

            if (!isValidPassword)
                throw new UnauthorizedException(
                    'Credentials are not valid! (password',
                );

            return {
                ...user,
                token: this.getJwtToken({ email: user.email }),
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    private getJwtToken(payload: JwtPayloadInterface) {
        const token = this.jwtService.sign(payload);

        return token;
    }

    private handleError(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        console.log(error);

        throw new InternalServerErrorException('Something has been very worng');
    }
}

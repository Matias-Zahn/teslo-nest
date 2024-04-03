import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('check-auth-status')
    @Auth(ValidRoles.user)
    checkAuth(@GetUser() user: User) {
        return this.authService.checkAuth(user);
    }

    @Get('private')
    @UseGuards(AuthGuard())
    testingPrivateRoute(
        @GetUser() user: User,
        @RawHeaders() rawHeader: string[],
    ) {
        return {
            status: true,
            user,
            rawHeader,
        };
    }

    // @SetMetadata('roles', ['superUser', 'admin'])

    @Get('private2')
    @RoleProtected(ValidRoles.user)
    @UseGuards(AuthGuard(), UserRoleGuard) //TODO <------
    privateRoute2(@GetUser() user: User) {
        return {
            status: 'ok',
            user,
        };
    }

    @Get('private3')
    @Auth(ValidRoles.user)
    privateRoute3(@GetUser() user: User) {
        return {
            status: 'ok',
            user,
        };
    }
}

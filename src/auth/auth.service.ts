import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignupDto): Promise<{ token: string }> {
        const { name, email, password, role } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = this.jwtService.sign({
            id: user._id,
            role: user.role,
        });

        return { token };
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        // console.log(loginDto)
        const user = await this.userModel.findOne({ email });
        // console.log(email, password)
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.jwtService.sign({
            id: user._id,
            role: user.role,
        });

        return { token };
    }

    async getUserDetails(token: string): Promise<{ email: string, role: Role[] }> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userModel.findById(decoded.id).select('email role');
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            return { email: user.email, role: user.role };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    
}

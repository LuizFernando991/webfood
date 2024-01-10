import { Response } from 'express'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto, RegisterDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private createActivationToken(user: {
    name: string
    email: string
    password: string
    phone_number: string
  }) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()

    const token = this.jwtService.sign(
      {
        user,
        activationCode
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '5m'
      }
    )

    return { token, activationCode }
  }

  async register(registerDto: RegisterDto, response: Response) {
    const isUserAlreadyExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone_number: registerDto.phone_number }
        ]
      }
    })

    if (isUserAlreadyExists) {
      throw new BadRequestException('user already exists.')
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      phone_number: registerDto.phone_number
    }

    const { token: activationToken, activationCode } =
      this.createActivationToken(user)

    // Send email with code

    return { activationToken, response }
  }

  // async login(loginDto: LoginDto, response: Response) {
  //   await this.prisma.user.findMany()
  //   const user = {
  //     email: loginDto.email,
  //     password: loginDto.password
  //   }
  //   return user
  // }
}

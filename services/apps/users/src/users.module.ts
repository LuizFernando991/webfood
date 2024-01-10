import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { GraphQLModule } from '@nestjs/graphql'
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig
} from '@nestjs/apollo'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserResolver } from './users.resolver'
import { EmailModule } from './email/email.module'
import { PrismaModule } from '../../../prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      }
    }),
    EmailModule,
    PrismaModule
  ],
  providers: [UsersService, ConfigService, JwtService, UserResolver]
})
export class UsersModule {}

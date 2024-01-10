import { Response } from 'express'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { RegisterResponse } from './types/user.types'
import { RegisterDto } from './dto/user.dto'

@Resolver('user')
// @UseFilters()
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { response: Response }
  ): Promise<RegisterResponse> {
    const user = await this.usersService.register(registerDto, context.response)

    return { user }
  }
}

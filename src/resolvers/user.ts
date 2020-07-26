import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { UserService } from '../services'
import { AuthResult } from '../types/graphql'
import { User } from '../types/type-graphql'

@Resolver()
export class UserResolver {
  @Inject()
  service!: UserService

  @Query(() => User)
  @Authorized()
  async profile(@Ctx('user') user: User): Promise<User> {
    return user
  }

  @Mutation(() => AuthResult)
  signUp(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResult> {
    return this.service.signUp(name, email, password)
  }

  @Mutation(() => AuthResult)
  signIn(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResult> {
    return this.service.signIn(email, password)
  }
}

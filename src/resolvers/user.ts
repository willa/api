import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { UserService } from '../services'
import { AuthResult } from '../types/graphql'
import { User } from '../types/models'

@Resolver()
export class UserResolver {
  @Inject()
  service!: UserService

  @Authorized()
  @Query(() => User)
  profile(@Ctx('user') user: User): User {
    return user
  }

  @Mutation(() => AuthResult)
  signIn(@Arg('token') token: string): Promise<AuthResult> {
    return this.service.signIn(token)
  }
}

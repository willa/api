import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { AccountService } from '../services'
import { Account, User } from '../types/type-graphql'

@Resolver()
export class AccountResolver {
  @Inject()
  service!: AccountService

  @Query(() => [Account])
  @Authorized()
  async accounts(@Ctx('user') user: User): Promise<Account[]> {
    return this.service.accounts(user)
  }

  @Mutation(() => Account)
  @Authorized()
  createAccount(
    @Ctx('user') user: User,
    @Arg('name') name: string,
    @Arg('currency') currency: string
  ): Promise<Account> {
    return this.service.create(user, name, currency)
  }
}

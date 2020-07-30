import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { Roles } from '../lib'
import { AccountService } from '../services'
import { Account, User } from '../types/graphql'

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

  @Mutation(() => Account)
  @Authorized(Roles.MEMBER)
  updateAccount(
    @Arg('accountId') accountId: number,
    @Arg('name') name: string,
    @Arg('currency') currency: string
  ): Promise<Account> {
    return this.service.update(accountId, name, currency)
  }

  @Mutation(() => Boolean)
  @Authorized(Roles.MEMBER)
  deleteAccount(@Arg('accountId') accountId: number): Promise<boolean> {
    return this.service.remove(accountId)
  }
}

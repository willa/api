import { User } from '@prisma/client'
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'
import { Inject } from 'typedi'

import { AccountService } from '../services'
import { Roles } from '../types'
import { AccountInput } from '../types/graphql'
import { Account } from '../types/models'

@Resolver()
export class AccountResolver {
  @Inject()
  service!: AccountService

  @Authorized()
  @Query(() => [Account])
  async accounts(@Ctx('user') user: User): Promise<Account[]> {
    return this.service.fetch(user)
  }

  @Authorized()
  @Mutation(() => Account)
  async createAccount(
    @Ctx('user') user: User,
    @Arg('data') data: AccountInput
  ): Promise<Account> {
    return this.service.create(user, data)
  }

  @Authorized(Roles.ACCOUNT_MEMBER)
  @Mutation(() => Account)
  async updateAccount(
    @Arg('accountId', () => Int) accountId: number,
    @Arg('data') data: AccountInput
  ): Promise<Account> {
    return this.service.update(accountId, data)
  }

  @Authorized(Roles.ACCOUNT_MEMBER)
  @Mutation(() => Boolean)
  async deleteAccount(
    @Arg('accountId', () => Int) accountId: number
  ): Promise<boolean> {
    return this.service.delete(accountId)
  }

  @Authorized(Roles.ACCOUNT_MEMBER)
  @Mutation(() => Boolean)
  async resetAccount(
    @Arg('accountId', () => Int) accountId: number
  ): Promise<boolean> {
    return this.service.reset(accountId)
  }
}

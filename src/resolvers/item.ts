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

import { ItemService } from '../services'
import { Roles } from '../types'
import { ItemInput } from '../types/graphql'
import { Item } from '../types/models'

@Resolver()
export class ItemResolver {
  @Inject()
  service!: ItemService

  @Authorized(Roles.ACCOUNT_MEMBER)
  @Query(() => [Item])
  async items(@Arg('accountId', () => Int) accountId: number): Promise<Item[]> {
    return this.service.fetch(accountId)
  }

  @Authorized(Roles.ACCOUNT_MEMBER)
  @Mutation(() => Item)
  async createItem(
    @Ctx('user') user: User,
    @Arg('accountId', () => Int) accountId: number,
    @Arg('data') data: ItemInput
  ): Promise<Item> {
    return this.service.create(user, accountId, data)
  }

  @Authorized(Roles.ITEM_MEMBER)
  @Mutation(() => Item)
  async updateItem(
    @Arg('itemId', () => Int) itemId: number,
    @Arg('data') data: ItemInput
  ): Promise<Item> {
    return this.service.update(itemId, data)
  }

  @Authorized(Roles.ITEM_MEMBER)
  @Mutation(() => Boolean)
  async deleteItem(@Arg('itemId', () => Int) itemId: number): Promise<boolean> {
    return this.service.delete(itemId)
  }
}

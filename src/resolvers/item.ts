import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { Roles } from '../lib'
import { ItemService } from '../services'
import { Item } from '../types/type-graphql'

@Resolver()
export class ItemResolver {
  @Inject()
  service!: ItemService

  @Query(() => [Item])
  @Authorized(Roles.MEMBER)
  async items(@Arg('accountId') accountId: number): Promise<Item[]> {
    return this.service.items(accountId)
  }

  @Mutation(() => Item)
  @Authorized(Roles.MEMBER)
  createItem(
    @Arg('accountId') accountId: number,
    @Arg('amount') amount: number,
    @Arg('description') description: string,
    @Arg('type') type: string
  ): Promise<Item> {
    return this.service.create(accountId, amount, description, type)
  }

  @Mutation(() => Item)
  @Authorized(Roles.MEMBER)
  updateItem(
    @Arg('itemId') itemId: number,
    @Arg('amount') amount: number,
    @Arg('description') description: string,
    @Arg('type') type: string
  ): Promise<Item> {
    return this.service.update(itemId, amount, description, type)
  }
}

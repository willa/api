import { Service } from 'typedi'

import { db } from '..'
import { Item } from '../types/type-graphql'

@Service()
export class ItemService {
  async items(accountId: number): Promise<Item[]> {
    const items = db.item.findMany({
      where: {
        accountId
      }
    })

    return items
  }

  async create(
    accountId: number,
    amount: number,
    description: string,
    type: string
  ): Promise<Item> {
    const item = await db.item.create({
      data: {
        account: {
          connect: {
            id: accountId
          }
        },
        amount,
        description,
        type
      }
    })

    return item
  }

  async update(
    id: number,
    amount: number,
    description: string,
    type: string
  ): Promise<Item> {
    const item = await db.item.update({
      data: {
        amount,
        description,
        type
      },
      where: {
        id
      }
    })

    return item
  }

  async remove(id: number): Promise<boolean> {
    await db.item.delete({
      where: {
        id
      }
    })

    return true
  }
}

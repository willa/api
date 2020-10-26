import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { ItemInput } from '../types/graphql'
import { Item } from '../types/models'

@Service()
export class ItemService {
  async fetch(accountId: number, skip?: number): Promise<Item[]> {
    const items = await db.item.findMany({
      orderBy: {
        date: 'desc'
      },
      skip,
      take: 1,
      where: {
        accountId
      }
    })

    return items
  }

  async create(user: User, accountId: number, data: ItemInput): Promise<Item> {
    const item = await db.item.create({
      data: {
        ...data,
        account: {
          connect: {
            id: accountId
          }
        },
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })

    await db.account.update({
      data: {
        amount: {
          increment: item.amount
        }
      },
      where: {
        id: accountId
      }
    })

    return item
  }

  async update(id: number, data: ItemInput): Promise<Item> {
    const item = await db.item.findOne({
      where: {
        id
      }
    })

    if (!item) {
      throw new Error('Item not found')
    }

    const next = await db.item.update({
      data,
      where: {
        id
      }
    })

    await db.account.update({
      data: {
        amount: {
          increment: next.amount - item.amount
        }
      },
      where: {
        id: item.accountId
      }
    })

    return next
  }

  async delete(id: number): Promise<boolean> {
    const item = await db.item.delete({
      where: {
        id
      }
    })

    await db.account.update({
      data: {
        amount: {
          decrement: item.amount
        }
      },
      where: {
        id: item.accountId
      }
    })

    return true
  }
}

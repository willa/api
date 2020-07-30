import { Service } from 'typedi'

import { db } from '..'
import { Item, User } from '../types/graphql'

@Service()
export class ItemService {
  async items(user: User): Promise<Item[]> {
    const accounts = await db.account.findMany({
      where: {
        users: {
          some: {
            id: user.id
          }
        }
      }
    })

    const items = await db.item.findMany({
      include: {
        account: true
      },
      where: {
        account: {
          id: {
            in: accounts.map(({ id }) => id)
          }
        }
      }
    })

    return items
  }

  async itemsForAccount(accountId: number): Promise<Item[]> {
    const items = await db.item.findMany({
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

    this.updateAccount(item.accountId)

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

    this.updateAccount(item.accountId)

    return item
  }

  async remove(id: number): Promise<boolean> {
    const item = await db.item.delete({
      where: {
        id
      }
    })

    this.updateAccount(item.accountId)

    return true
  }

  private async updateAccount(id: number): Promise<void> {
    const items = await db.item.findMany({
      where: {
        accountId: id
      }
    })

    const amount = items.reduce((total, { amount }) => total + amount, 0)

    await db.account.update({
      data: {
        amount
      },
      where: {
        id
      }
    })
  }
}

import { Service } from 'typedi'

import { db } from '..'
import { Account, User } from '../types/graphql'

@Service()
export class AccountService {
  async accounts(user: User): Promise<Account[]> {
    const accounts = db.account.findMany({
      where: {
        users: {
          some: {
            id: user.id
          }
        }
      }
    })

    return accounts
  }

  async create(user: User, name: string, currency: string): Promise<Account> {
    const account = await db.account.create({
      data: {
        amount: 0,
        currency,
        name,
        users: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return account
  }

  async update(id: number, name: string, currency: string): Promise<Account> {
    const account = await db.account.update({
      data: {
        currency,
        name
      },
      where: {
        id
      }
    })

    return account
  }

  async remove(id: number): Promise<boolean> {
    await db.item.deleteMany({
      where: {
        accountId: id
      }
    })

    await db.account.delete({
      where: {
        id
      }
    })

    return true
  }
}

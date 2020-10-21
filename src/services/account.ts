import { User } from '@prisma/client'
import { Service } from 'typedi'

import { db } from '..'
import { AccountInput } from '../types/graphql'
import { Account } from '../types/models'

@Service()
export class AccountService {
  async fetch(user: User): Promise<Account[]> {
    const accounts = await db.account.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        users: {
          every: {
            id: user.id
          }
        }
      }
    })

    return accounts
  }

  async create(user: User, data: AccountInput): Promise<Account> {
    const account = await db.account.create({
      data: {
        ...data,
        users: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return account
  }

  async update(id: number, data: AccountInput): Promise<Account> {
    const account = await db.account.update({
      data,
      where: {
        id
      }
    })

    return account
  }

  async delete(id: number): Promise<boolean> {
    await db.account.delete({
      where: {
        id
      }
    })

    return true
  }
}

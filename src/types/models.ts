import Prisma from '@prisma/client'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'

// enums

export enum AccountType {
  EXPENSE = 'EXPENSE',
  SAVINGS = 'SAVINGS'
}

registerEnumType(AccountType, {
  name: 'AccountType'
})

// models

@ObjectType()
export class User implements Omit<Prisma.User, 'createdAt' | 'updatedAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  email!: string
}

@ObjectType()
export class Account implements Omit<Prisma.Account, 'createdAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  amount!: number

  @Field()
  currency!: string

  @Field(() => AccountType)
  type!: Prisma.AccountType

  @Field()
  updatedAt!: Date
}

@ObjectType()
export class Item
  implements
    Omit<Prisma.Item, 'accountId' | 'userId' | 'createdAt' | 'updatedAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  amount!: number

  @Field()
  date!: Date

  @Field()
  description!: string

  @Field()
  type!: string
}

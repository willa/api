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
export class User
  implements Omit<Prisma.User, 'firebaseId' | 'createdAt' | 'updatedAt'> {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  email!: string
}

@ObjectType()
export class Account implements Prisma.Account {
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
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

@ObjectType()
export class Item implements Omit<Prisma.Item, 'accountId' | 'userId'> {
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

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

import { Field, InputType, ObjectType } from 'type-graphql'

import { AccountType, User } from './models'

// objects

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

// inputs

@InputType()
export class UserInput {
  @Field()
  name!: string
}

@InputType()
export class AccountInput {
  @Field()
  name!: string

  @Field()
  currency!: string

  @Field(() => AccountType)
  type!: AccountType
}

@InputType()
export class ItemInput {
  @Field()
  amount!: number

  @Field()
  date!: Date

  @Field()
  description!: string

  @Field()
  type!: string
}

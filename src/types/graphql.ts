import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  email!: string

  password!: string

  @Field()
  createdAt!: Date
}

@ObjectType()
export class Account {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  amount!: number

  @Field()
  currency!: string

  @Field(() => [Item], {
    nullable: true
  })
  items?: Item[]

  @Field(() => [User], {
    nullable: true
  })
  users?: User[]

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

@ObjectType()
export class Item {
  @Field(() => Int)
  id!: number

  @Field(() => Account, {
    nullable: true
  })
  account?: Account

  @Field()
  amount!: number

  @Field()
  description!: string

  @Field()
  type!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

import { Field, ObjectType } from 'type-graphql'

import { User } from './type-graphql'

@ObjectType()
export class AuthResult {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

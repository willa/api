import { User } from './type-graphql'

export type AuthToken = {
  id: number
}

export type Context = {
  user?: User
}

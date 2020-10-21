import { User } from '@prisma/client'

export type AuthToken = {
  id: number
}

export type Context = {
  user?: User
}

export type FirebaseUser = {
  email?: string
  name?: string
}

export enum Roles {
  ACCOUNT_MEMBER = 'ACCOUNT_MEMBER',
  ITEM_MEMBER = 'ITEM_MEMBER'
}

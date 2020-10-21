import { AccountResolver } from './account'
import { ItemResolver } from './item'
import { UserResolver } from './user'

export const resolvers = [AccountResolver, ItemResolver, UserResolver] as const

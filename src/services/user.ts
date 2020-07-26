import { Service } from 'typedi'

import { db } from '..'
import { auth } from '../lib'
import { AuthResult } from '../types/graphql'

@Service()
export class UserService {
  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const exists = await db.user.findMany({
      where: {
        email
      }
    })

    if (exists.length > 0) {
      throw new Error('Email in use')
    }

    const user = await db.user.create({
      data: {
        email,
        name,
        password: await auth.hashPassword(password)
      }
    })

    const token = auth.createToken(user)

    return {
      token,
      user
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const [user] = await db.user.findMany({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error('Incorrect email')
    }

    if (!(await auth.comparePassword(user, password))) {
      throw new Error('Incorrect password')
    }

    const token = auth.createToken(user)

    return {
      token,
      user
    }
  }
}

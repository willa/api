const { TOKEN_SECRET } = process.env

import { User } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { Service } from 'typedi'

import { firebase } from '../lib'

@Service()
export class AuthService {
  async verifyToken(token: string): Promise<string | undefined> {
    const { email } = await firebase.auth().verifyIdToken(token)

    return email
  }

  createToken({ id }: User): string {
    return sign(
      {
        id
      },
      TOKEN_SECRET
    )
  }
}

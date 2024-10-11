import { UserDb } from '@prisma/client'
import { userCreateMatches } from '../utils/typeMatch'

export class UserService {

  private client

  constructor(postgres) {
    this.client = postgres
  }

  public async getOneUser({ email, username }: {
    email?: string,
    username?: string
  }): Promise<UserDb | null> {
    return await this.client.findOneUserDb({ email, username })
  }

  public async createOneUser(user: CreateUserInput): Promise<UserDb> {
    if (!userCreateMatches(user))
      throw 'Missing params to create user'

    try {
      return await this.client.createUserDb(user)
    } catch (_: unknown) {
      throw 'Could not create user ' + user.email
    }
  }
}

export interface CreateUserInput {
  name: string,
  username: string,
  email: string,
  password: string
}
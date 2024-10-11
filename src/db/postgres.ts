import * as db from '../config/prisma'
import { EnumSizeDb, OrderDb, UserDb } from '@prisma/client'

export class Database {
  db = db.prisma

  constructor() {
  }

  public async findManyOrderDb({ userId, username, email }: {
    userId?: string,
    username?: string,
    email?: string
  }): Promise<OrderDbSerialized[]> {
    const select = {
      id: true,
      name: true,
      value: true,
      size: true,
      user_id: true,
      createdAt: true,
      updatedAt: true,
    }

    if (email || username) {
      return await this.db.orderDb.findMany({
        select,
        where: {
          user: {
            email,
            username,
          },
        },
      })
    }

    if (userId) {
      return await this.db.orderDb.findMany({
        select,
        where: {
          user_id: userId,
        },
      })
    }

    return []
  }

  public async findOneOrderDb({ id }: { id?: string }): Promise<OrderDbSerialized | null> {
    if (id)
      return await this.db.orderDb.findUnique({
        where: {
          id: id,
        },
      })

    return null
  }

  public async findOneUserDb({ email, username }: {
    email?: string,
    username?: string
  }): Promise<{
    username: string,
    email: string,
    name: string,
  } | null> {
    const select = {
      id: true,
      username: true,
      email: true,
      name: true,
      password: true,
    }
    if (email)
      return await this.db.userDb.findUnique({
        select,
        where: { email, deleted: false },
      })
    if (username)
      return await this.db.userDb.findUnique({
        select,
        where: { username, deleted: false },
      })

    return null
  }

  public async createUserDb(user: Omit<UserDb, 'id'>): Promise<UserDb> {
    return await this.db.userDb.create({
      data: user,
    })
  }

  public async createOrderDb(order: CreateOrderDbInput): Promise<OrderDbSerialized> {
    return await this.db.orderDb.create({
      data: order,
    })
  }
}

export interface CreateOrderDbInput {
  name: string,
  size: EnumSizeDb,
  user_id: string,
  value: number
}

export type OrderDbSerialized = Omit<OrderDb, 'value'> & {
  value: number
}
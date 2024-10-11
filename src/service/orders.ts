import { EnumSizeDb } from '@prisma/client'
import { Database, OrderDbSerialized } from '../db/postgres'

export class OrdersService {

  private client: Database

  constructor(postgres: Database) {
    this.client = postgres
  }

  public async getManyOrders({ userId, id, email, username }: {
    userId?: string,
    id?: string
    email?: string
    username?: string
  }): Promise<OrderDbSerialized[]> {
    const results: OrderDbSerialized[] = []
    if (id) {
      const value = await this.client.findOneOrderDb({ id })
      if (value) results.push(value)
    }
    if (userId || email || username) {
      const values = await this.client.findManyOrderDb({ userId, email, username })
      if (values) results.push(...values)
    }

    return results
  }

  public async createOneOrder(order: CreateOrderInput): Promise<OrderDbSerialized> {
    try {
      const { name, size, userId: user_id, value } = order
      return await this.client.createOrderDb({ name, size, user_id, value })

    } catch (e: unknown) {
      throw 'Could not create order'
    }
  }
}

export interface CreateOrderInput {
  name: string,
  size: EnumSizeDb,
  userId: string,
  value: number
}
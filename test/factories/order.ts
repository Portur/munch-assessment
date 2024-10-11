import { EnumSizeDb } from '@prisma/client'
import { CreateOrderInput } from '../../src/service/orders'
import { v4 as uuidv4 } from 'uuid'

export function createPotentialOrder(params?: Partial<CreateOrderInput>): CreateOrderInput {
  return {
    userId: params?.userId || uuidv4(),
    value: params?.value || parseFloat((Math.random() * 100).toFixed(2)) * 100,
    name: params?.name || ('someName' + Math.floor(Math.random() * 10) + 1),
    size: params?.size || EnumSizeDb.Small,
  }
}

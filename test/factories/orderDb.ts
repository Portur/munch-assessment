import { EnumSizeDb, OrderDb } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

export function createOneOrderDb(params?: Partial<OrderDb>): OrderDb {
  return {
    id: params?.id || uuidv4(),
    value: params?.value || BigInt(parseFloat((Math.random() * 100).toFixed(2)) * 100),
    name: params?.name || 'someName',
    size: params?.size || EnumSizeDb.Small,
    user_id: params?.user_id || uuidv4(),
    createdAt: params?.createdAt || new Date(),
    updatedAt: params?.updatedAt || new Date(),
  }
}

export function createManyOrderDb(params?: Partial<OrderDb[]>): OrderDb[] {
  return (params || []).map(p => ({
    id: p?.id || uuidv4(),
    value: p?.value || BigInt(parseFloat((Math.random() * 100).toFixed(2)) * 100),
    name: p?.name || 'someName',
    size: p?.size || EnumSizeDb.Small,
    user_id: p?.user_id || uuidv4(),
    createdAt: p?.createdAt || new Date(),
    updatedAt: p?.updatedAt || new Date(),
  }))
}
import { UserDb } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

export function createOneUserDb(params?: Partial<UserDb>): UserDb {
  return {
    id: params?.id || uuidv4(),
    username: params?.username || 'someUsername',
    email: params?.email || 'someEmail',
    name: params?.name || 'someName',
    password: params?.password || 'somePassword',
    deleted: params?.deleted || false,
    createdAt: params?.createdAt || new Date(),
    updatedAt: params?.updatedAt || new Date(),
  }
}
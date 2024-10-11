import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

export const prisma = new PrismaClient()
  .$extends({
    query: {
      userDb: {
        // eslint-disable-next-line
        $allOperations({ operation, args, query }: { operation: any, args: any, query: any }) {
          if (['create', 'update', 'upsert'].includes(operation) && args.data['password']) {
            args.data['password'] = bcrypt.hashSync(args.data['password'], 10)
          }
          return query(args)
        },
      },
      orderDb: {
        // eslint-disable-next-line
        $allOperations({ operation, args, query }: { operation: any, args: any, query: any }) {
          if (['create', 'update', 'upsert'].includes(operation) && args.data['value']) {
            args.data['value'] = parseInt(String(args.data.value * 100))
          }
          return query(args)
        },
      },
    },
    result: {
      orderDb: {
        value: {
          needs: { value: true },
          compute(order) {
            return Number(order.value) / 100
          },
        },
      },
    },
  })

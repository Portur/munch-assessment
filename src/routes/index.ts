import { Router } from 'express'
import { Database } from '../db/postgres'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { UserService } from '../service/users'
import { OrdersService } from '../service/orders'
import { verifyToken as tokenProtected } from '../middleware/index'
import { orderCreateMatches, userCreateMatches, userLoginMatches } from '../utils/typeMatch'
import { EnumSizeDb } from '@prisma/client'

const router = Router()
const db = new Database()
const userService = new UserService(db)
const ordersService = new OrdersService(db)

router.get('/', async (req, res) => {
  res.status(301).redirect('/api-docs')
})

router.post('/auth/register', async (req, res) => {

  if (!userCreateMatches(req.body))
    res.status(400).json({ error: 'Missing required params' })
  else {
    try {
      const { name, username, email, password } = req.body
      const user = await userService.createOneUser({ name, username, email, password })
      res.status(201).json({ message: 'User registered successfully', user })
    } catch (e: unknown) {
      res.status(500).json({ error: e })
    }
  }
})

router.post('/auth/login', async (req, res) => {
  if (!userLoginMatches(req.body))
    res.status(400).json({ error: 'Missing required params' })
  else {
    const { username, email, password } = req.body
    const user = await userService.getOneUser({ username, email })
    if (!user) {
      res.status(401).json({ error: 'Authentication failed' })
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        res.status(401).json({ error: 'Authentication failed' })
      } else {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
          expiresIn: '1h',
        })
        res.status(200).json({ token: token, userId: user.id })
      }
    }
  }
})

router.get('/orders', tokenProtected, async (req, res) => {
  /* #swagger.security = [{
             "bearerAuth": []
     }] */

  // @ts-expect-error does exist
  const userId: string = req.userId
  const orders = await ordersService.getManyOrders({ userId })
  res.send({ orders })
})

router.post('/order', tokenProtected, async (req, res) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }]
      #swagger.parameters['size'] = {
           in: 'body',
           schema: {
               $ref: '#/components/schemas/orderSize'
           }
   } */

  if (!orderCreateMatches(req.body))
    res.status(400).json({ error: 'Invalid request' })
  else {
    try {

      // @ts-expect-error does exist
      const userId: string = req.userId
      const { name, size, value } = req.body as { name: string, size: EnumSizeDb, value: number }
      const order = await ordersService.createOneOrder({ name, size, userId, value })
      res.status(201).send({ order })
    } catch (e: unknown) {
      res.status(500).json({ error: e })
    }
  }
})

export default router
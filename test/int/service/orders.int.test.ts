import { createPotentialOrder } from '../../factories/order'

import { Database } from '../../../src/db/postgres'
import { OrdersService } from '../../../src/service/orders'
import { v4 as uuidv4 } from 'uuid'

const db = new Database()
const orderService = new OrdersService(db)

const somePotentialOrder = createPotentialOrder()
const userDbId = uuidv4()
const existingUserDbId = uuidv4()
const someOrderDb = createPotentialOrder({ ...somePotentialOrder, userId: userDbId })
const someExistingOrderDb = createPotentialOrder({ ...createPotentialOrder(), userId: existingUserDbId })

const mockedCreateOrderDb = jest.fn(() => someOrderDb)
const mockedFindManyOrderDb = jest.fn(() => [someExistingOrderDb])
jest.mock('../../../src/db/postgres', () => ({
  Database: jest.fn().mockImplementation(() =>
    ({
      findManyOrderDb: () => mockedFindManyOrderDb(),
      createOrderDb: () => mockedCreateOrderDb(),
    })),
}))


describe('ordersService', () => {

  beforeEach(() => {
    mockedCreateOrderDb.mockClear()
    mockedFindManyOrderDb.mockClear()
  })
  afterAll(async () => {
  })

  it('should create an order', async () => {
    // Arrange

    // Act
    const result = await orderService.createOneOrder(somePotentialOrder)

    // Assert
    expect(result).toBe(someOrderDb)
  })

  it('should get an existing order', async () => {
    // Arrange

    // Act
    const result = await orderService.getManyOrders({ userId: someExistingOrderDb.userId })

    // Assert
    expect(result).toStrictEqual([someExistingOrderDb])
  })

  it('should return [] for a non existing user_id', async () => {
    // Arrange
    mockedFindManyOrderDb.mockImplementationOnce(() => [])

    // Act
    const result = await orderService.getManyOrders({ userId: 'someInvalidUserId' })

    // Assert
    expect(result).toStrictEqual([])
  })
})


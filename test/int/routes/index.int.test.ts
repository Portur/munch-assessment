import request from 'supertest'
import app from '../../../src/config/server'
import { createPotentialUser } from '../../factories/user'
import { v4 as uuidv4 } from 'uuid'
import { createOneUserDb } from '../../factories/userDb'
import { createPotentialOrder } from '../../factories/order'
import { verifyToken } from '../../../src/middleware'

const somePotentialUser = createPotentialUser()
const userDbId = uuidv4()
const existingUserDbId = uuidv4()
const someUserDb = createOneUserDb({ ...somePotentialUser, id: userDbId })
const someExistingUserDb = createOneUserDb({ ...createPotentialUser(), id: existingUserDbId })

const somePotentialOrder = createPotentialOrder()
const someOrderDb = createPotentialOrder({ ...somePotentialOrder, userId: userDbId })
const someExistingOrderDb = createPotentialOrder({ ...createPotentialOrder(), userId: existingUserDbId })

const someJWTToken = 'SomeToken'
const mockedBcryptCompare = jest.fn(() => true)
jest.mock('bcrypt', () => ({
  compare: () => mockedBcryptCompare(),
}))

const mockedJWTSign = jest.fn().mockReturnValue(someJWTToken)
const mockedJWTVerify = jest.fn().mockReturnValue({
  exp: +(Math.random().toFixed()),
  int: +(Math.random().toFixed()),
  userId: userDbId,
})
jest.mock('jsonwebtoken', () => ({
  sign: () => mockedJWTSign(),
  verify: () => mockedJWTVerify(),
}))

const mockedCreateOneUser = jest.fn(() => someUserDb)
const mockedGetOneUser = jest.fn(() => someExistingUserDb)
jest.mock('../../../src/service/users', () => ({
  UserService: jest.fn().mockImplementation(() =>
    ({
      createOneUser: () => mockedCreateOneUser(),
      getOneUser: () => mockedGetOneUser(),
    })),
}))

const mockedCreateOneOrder = jest.fn(() => someOrderDb)
const mockedGetManyOrders = jest.fn(() => [someExistingOrderDb])
jest.mock('../../../src/service/orders', () => ({
  OrdersService: jest.fn().mockImplementation(() =>
    ({
      getManyOrders: () => mockedGetManyOrders(),
      createOneOrder: () => mockedCreateOneOrder(),
    })),
}))

jest.mock('../../../src/middleware/index')
const mockVerifyToken = jest.mocked(verifyToken)

describe('/auth', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('/auth/register', () => {
    it('creates a user successfully', async () => {
      // Arrange

      // Act
      await request(app)
        .post('/auth/register')
        .send(somePotentialUser)
        .set('Accept', 'application/json')
        // Assert
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => {
          expect(response.body).toStrictEqual({
            'message': 'User registered successfully',
            'user': {
              ...someUserDb,
              'id': expect.any(String),
              'createdAt': expect.any(String),
              'updatedAt': expect.any(String),
            },
          })
        })
    })

    it('fails to create a duplicate user', async () => {
      // Arrange
      mockedCreateOneUser.mockImplementationOnce(() => {
        throw 'User already exists'
      })

      // Act
      await request(app)
        .post('/auth/register')
        .send(somePotentialUser)
        .set('Accept', 'application/json')
        // Assert
        .expect('Content-Type', /json/)
        .expect(500)
        .then(response => {
          expect(response.body).toStrictEqual({
            'error': 'User already exists',
          })
        })
    })
  })

  describe('/auth/login', () => {
    it('logs in a user successfully', async () => {
      // Arrange

      // Act
      await request(app)
        .post('/auth/login')
        .send({
          'email': someExistingUserDb.email,
          'password': someExistingUserDb.password,
        })
        .set('Accept', 'application/json')
        // Assert
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toStrictEqual({
            'token': someJWTToken,
            userId: someExistingUserDb.id,
          })
        })
    })

    it('fails to log in a user on an invalid token', async () => {
      // Arrange
      // @ts-expect-error is null
      mockedGetOneUser.mockImplementationOnce(() => null)

      // Act
      await request(app)
        .post('/auth/login')
        .send({
          'email': 'someIncorrectEmail',
          'password': 'someIncorrectPassword',
        })
        .set('Accept', 'application/json')
        // Assert
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(401)
        .then(response => {
          expect(response.body).toStrictEqual({
            'error': 'Authentication failed',
          })
        })
    })
  })
})

describe('/order', () => {
  beforeEach(() => {
    mockVerifyToken.mockImplementation((req, res, next) => {
      next()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('creates an order successfully', async () => {
    // Arrange

    // Act
    await request(app)
      .post('/order')
      .send(somePotentialOrder)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer someValue')
      // Assert
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body).toStrictEqual({
          order: someOrderDb,
        })
      })
  })

  it('fails to create an order', async () => {
    // Arrange
    mockedCreateOneOrder.mockImplementationOnce(() => {
      throw 'Could not create order'
    })

    // Act
    await request(app)
      .post('/order')
      .send(somePotentialOrder)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer someValue')
      // Assert
      .expect('Content-Type', /json/)
      .expect(500)
      .then(response => {
        expect(response.body).toStrictEqual({
          'error': 'Could not create order',
        })
      })
  })

  it('fails to create an order with bad request', async () => {
    // Arrange
    const someInvalidPotentialOrder = { ...somePotentialOrder, value: -1 }

    // Act
    await request(app)
      .post('/order')
      .send(someInvalidPotentialOrder)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer someValue')
      // Assert
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body).toStrictEqual({
          'error': 'Invalid request',
        })
      })
  })
})

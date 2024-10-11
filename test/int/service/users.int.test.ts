import { UserService } from '../../../src/service/users'
import { Database } from '../../../src/db/postgres'
import { createOneUserDb } from '../../factories/userDb'
import { createPotentialUser } from '../../factories/user'
import { v4 as uuidv4 } from 'uuid'

const db = new Database()
const userService = new UserService(db)

const somePotentialUser = createPotentialUser()
const someOtherPotentialUser = createPotentialUser()
const userDbId = uuidv4()
const otherUserDbId = uuidv4()
const someUserDb = createOneUserDb({ ...somePotentialUser, id: userDbId })
const someOtherUserDb = createOneUserDb({ ...someOtherPotentialUser, id: otherUserDbId })

const mockedCreateUserDb = jest.fn(() => someUserDb)
const mockedFindOneUserDb = jest.fn(() => someOtherUserDb)
jest.mock('../../../src/db/postgres', () => ({
  Database: jest.fn().mockImplementation(() =>
    ({
      createUserDb: () => mockedCreateUserDb(),
      findOneUserDb: () => mockedFindOneUserDb(),
    })),
}))

describe('usersService', () => {
  beforeEach(() => {
    mockedCreateUserDb.mockClear()
    mockedFindOneUserDb.mockClear()
  })
  afterAll(async () => {
  })

  it('should create a user', async () => {
    // Arrange

    // Act
    const result = await userService.createOneUser(somePotentialUser)

    // Assert
    expect(result).toStrictEqual(someUserDb)
  })

  it('should get an existing user', async () => {
    // Arrange

    // Act
    const result = await userService.getOneUser({ email: someOtherUserDb.email })

    // Assert
    expect(result).toStrictEqual(someOtherUserDb)
  })

  it('should return null for a non existing user', async () => {
    // Arrange
    // @ts-expect-error is null
    mockedFindOneUserDb.mockImplementationOnce(() => null)

    // Act
    const result = await userService.getOneUser({ email: 'someInvalidEmail' })

    // Assert
    expect(result).toStrictEqual(null)
  })
})


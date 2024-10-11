import request from 'supertest'
import app from '../../../src/config/server'

import { createPotentialUser } from '../../factories/user'
import { v4 as uuidv4 } from 'uuid'
import { createOneUserDb } from '../../factories/userDb'
import { createPotentialOrder } from '../../factories/order'

const somePotentialUser = createPotentialUser()
const userDbId = uuidv4()
const existingUserDbId = uuidv4()
const someUserDb = createOneUserDb({ ...somePotentialUser, id: userDbId })
const someExistingUserDb = createOneUserDb({ ...createPotentialUser(), id: existingUserDbId })

const somePotentialOrder = createPotentialOrder()
const someOrderDb = createPotentialOrder({ ...somePotentialOrder, userId: userDbId })
const someExistingOrderDb = createPotentialOrder({ ...createPotentialOrder(), userId: existingUserDbId })

describe('/auth', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('/auth/register', () => {
    it('creates a user successfully', async () => {
      await request(app)
        .post('/auth/register')
        .send(somePotentialUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)

        .expect(201)
        .then(response => {
          expect(response.body).toStrictEqual({
            'message': 'User registered successfully',
            'user': {
              ...someUserDb,
              'password': expect.any(String),
              'createdAt': expect.any(String),
              'updatedAt': expect.any(String),
            },
          })
        })
    })

    it('fails to create a duplicate', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          'name': 'someName',
          'username': 'someUsername',
          'email': 'someEmail',
          'password': 'somePassword',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .then(response => {
          expect(response.body).toBe({
            'error': 'Could not create user someEmail',
          })
        })
    })
  })

  describe('/auth/login', () => {
    it('logs in a user successfully', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          'email': 'someEmail',
          'password': 'somePassword',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).toBe({
            'token': expect.any(String),
          })
        })
    })

    it('fails to log in a user on an invalid token', async () => {
      await request(app)
        .post('/auth/login')
        .send({
          'email': 'someIncorrectEmail',
          'password': 'someIncorrectPassword',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .then(response => {
          expect(response.body).toBe({
            'error': 'Could not create user someEmail',
          })
        })
    })
  })
})

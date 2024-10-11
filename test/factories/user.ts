import { CreateUserInput } from '../../src/service/users'

export function createPotentialUser(params?: Partial<CreateUserInput>): CreateUserInput {
  return {
    username: params?.username || ('someUsername' + Math.floor(Math.random() * 10) + 1),
    email: params?.email || ('someEmail' + Math.floor(Math.random() * 10) + 1),
    name: params?.name || ('someName' + Math.floor(Math.random() * 10) + 1),
    password: params?.password || ('somePassword' + Math.floor(Math.random() * 10) + 1),
  }
}
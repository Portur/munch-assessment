// eslint-disable-next-line
export function userCreateMatches(user?: any): boolean {
  return user.email && user.name && user.username && user.password
}

// eslint-disable-next-line
export function userLoginMatches(user?: any): boolean {
  return (user.email || user.username) && user.password
}

// eslint-disable-next-line
export function orderCreateMatches(order?: any): boolean {
  return order.name && order.size && typeof order.value === 'number' && order.value > 0
}

// eslint-disable-next-line
export function orderGetMatches(order?: any): boolean {
  return order.user_id && typeof order.user_id === 'string'
}
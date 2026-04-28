type MockUser = {
  id: string
  name: string
  email: string
  image: string | null
}

type MockSession = {
  data: { user: MockUser } | null
  isPending: boolean
}

const mockUser: MockUser = {
  id: 'mock-user-001',
  name: 'João Cardoso',
  email: 'cardosofiles@gmail.com',
  image: null,
}

const mockSession: MockSession = {
  data: { user: mockUser },
  isPending: false,
}

export type { MockUser, MockSession }
export { mockUser, mockSession }

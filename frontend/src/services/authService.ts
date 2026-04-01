import { supabase } from './supabaseClient'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  gender: string
  address: string
  phoneNumber: string
}

export const authService = {
  async login(credentials: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })
    if (error) throw error
    return data
  },

  async signup(payload: SignupPayload) {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: `${payload.firstName} ${payload.lastName}`,
          date_of_birth: payload.dateOfBirth,
          gender: payload.gender,
          address: payload.address,
          phone_number: payload.phoneNumber
        }
      }
    })
    if (error) throw error

    const user = data.user
    if (!user) {
      throw new Error('User created but no user returned')
    }

    const username = `${payload.firstName} ${payload.lastName}`.trim()

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        bio: '',
        city: '',
        area: '',
        is_private: false
      })

    if (profileError) throw profileError

    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  onAuthStateChange(callback: (session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
    return subscription
  }
}

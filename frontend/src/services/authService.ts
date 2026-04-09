import { supabase } from './supabaseClient'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignupPayload {
  username: string
  email: string
  password: string
  date_of_birth: string
  city: string
  area: string
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
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password
      })
      if (authError) {
        console.error('Supabase signup error:', authError)
        throw authError
      }

      // Create profile after auth signup
      if (authData.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: payload.username,
            date_of_birth: payload.date_of_birth,
            city: payload.city,
            area: payload.area,
            bio: '',
            is_private: false,
            tcg_interests: []
          })
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw profileError
        }
      }

      return authData
    } catch (err) {
      console.error('Signup error details:', err)
      throw err
    }
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

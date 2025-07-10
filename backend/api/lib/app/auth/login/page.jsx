// app/(auth)/login/page.jsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Middleware akan menangani redirect, tapi kita bisa lakukan secara eksplisit juga
      router.push('/dashboard')
      router.refresh() // Refresh untuk memastikan state server terupdate
    }
  }

  // Contoh untuk login dengan Google
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div>
      <h1>Masuk ke Azura Platform</h1>
      <form onSubmit={handleSignIn}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Masuk</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}>Lanjutkan dengan Google</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

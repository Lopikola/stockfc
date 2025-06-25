'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username,
        },
      },
    });

    if (error) {
      console.error(error);
      setMessage('❌ Signup failed. Please try again.');
      return;
    }

    setMessage('✅ Signup successful! Please check your email to confirm.');
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-sm bg-zinc-900 p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
          />
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
          />
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1 text-xs text-zinc-400"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full py-2 rounded text-white font-medium hover:bg-blue-700"
          >
            Sign Up
          </button>

          {message && <p className="text-sm text-yellow-400 text-center">{message}</p>}
        </form>

        <p className="text-sm text-center mt-6 text-zinc-400">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}






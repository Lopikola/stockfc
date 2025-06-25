'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage(): JSX.Element {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setMessage('Login failed. Please check your credentials.');
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      console.error('Failed to get user after login');
      setMessage('Something went wrong after login.');
      return;
    }

    // 1. Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // 2. If not, insert profile
    if (!existingProfile) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name ?? '',
        last_name: user.user_metadata?.last_name ?? '',
        username: user.user_metadata?.username ?? '',
      });

      if (insertError) {
        console.error('Profile creation failed:', insertError.message);
        setMessage('Login succeeded, but profile creation failed.');
        return;
      }
    }

    // ✅ Success
    router.push('/admin');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-sm bg-zinc-900 p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm" htmlFor="email">Email</label>
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
            <label className="block text-sm" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
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
            className="bg-green-600 w-full py-2 rounded text-white font-medium hover:bg-green-700"
          >
            Log In
          </button>

          {message && <p className="text-sm text-yellow-400 text-center">{message}</p>}
        </form>

        <p className="text-sm text-center mt-6 text-zinc-400">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}






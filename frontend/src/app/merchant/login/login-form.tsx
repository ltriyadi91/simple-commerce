'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/authContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { login, loading, checkProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const token = await login(data.email, data.password);
      if (token) {
        await checkProfile();
        router.push('/merchant/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email', { required: 'Email is required' })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Enter your email"
          disabled={loading}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">
            {errors.email?.message?.toString()}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register('password', { required: 'Password is required' })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Enter your password"
          disabled={loading}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password?.message?.toString()}
          </span>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button className="w-full mt-2" type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
}

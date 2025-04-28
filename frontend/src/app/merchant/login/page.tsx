'use client';
import { Card, CardFooter } from '@/components/ui/card';
import LoginForm from './login-form';
import { AuthProvider } from '../context/authContext';

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex justify-center items-start md:items-center p-8">
        <Card className="w-full max-w-sm pt-8">
          <CardFooter>
            <LoginForm />
          </CardFooter>
        </Card>
      </div>
    </AuthProvider>
  );
}

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const r = await login({ email: form.email, password: form.password });
        if (r.success) {
          toast.success('Welcome back');
          router.push(redirect);
        } else toast.error(r.error || 'Login failed');
      } else {
        const r = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || '+1000000000',
        });
        if (r.success) {
          toast.success('Account created');
          router.push(redirect);
        } else toast.error(r.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-20">
      <div
        className="glass-card p-10"
        style={{ background: 'rgba(5, 13, 28, 0.85)', border: '1px solid var(--border)' }}
      >
        <h1 className="text-3xl font-black mb-2">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className="text-text-muted text-sm mb-8">Secure access to bookings and live flight status.</p>
        <form onSubmit={submit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <span className="input-label">Full name</span>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
          )}
          <div>
            <span className="input-label">Email</span>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <span className="input-label">Password</span>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={8}
            />
          </div>
          {mode === 'register' && (
            <div>
              <span className="input-label">Phone (optional)</span>
              <input
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91xxxxxxxxxx"
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button type="button" className="text-primary font-bold" onClick={() => setMode('register')}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="text-primary font-bold" onClick={() => setMode('login')}>
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="text-center mt-4">
          <Link href="/" className="text-text-muted text-sm hover:text-primary">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="view active min-h-screen">
      <Header />
      <Suspense fallback={<div className="container py-20 text-center">Loading…</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}

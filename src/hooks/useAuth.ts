import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginAsRole, register, logout as doLogout } from '@/lib/auth';
import { toast } from 'sonner';
import type { User } from '@/types';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: User['role']) => {
    setLoading(true);
    try {
      const user = await loginAsRole(role);
      toast.success(`Logged in as ${user.name} (${role.replace('_', ' ')})`);
      navigate('/dashboard');
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: { name: string; email: string; password: string; role: string }) => {
    setLoading(true);
    try {
      const user = await register(data);
      toast.success(`Welcome to ValueUnlocked, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    doLogout();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  return { handleLogin, handleQuickLogin, handleRegister, handleLogout, loading };
}

'use client';

import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name?: string;
  email: string;
  mobile_no?: string;
  password: string;
  gender?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  state?: string;
  address?: string;
  country_code?: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>(); // Added reset
  const [message, setMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const res = await axios.post(endpoint, data);
      setMessage(res.data.message);
      reset(); // Reset form after submission
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Something went wrong');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    reset(); // Reset form when switching between Login & Signup
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          {isLogin ? 'Login to Your Account' : 'Create a New Account'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                {...register('name')}
                placeholder="Full Name"
                className="input-field"
                required
              />
              <input
                type="text"
                {...register('mobile_no')}
                placeholder="Mobile No"
                className="input-field"
                required
              />
              <select {...register('gender')} className="input-field" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                {...register('zipcode')}
                placeholder="Zipcode"
                className="input-field"
                required
              />
              <input
                type="text"
                {...register('city')}
                placeholder="City"
                className="input-field"
                required
              />
              <input
                type="text"
                {...register('country')}
                placeholder="Country"
                className="input-field"
                required
              />
              <input
                type="text"
                {...register('state')}
                placeholder="State"
                className="input-field"
                required
              />
              <input
                type="text"
                {...register('address')}
                placeholder="Address"
                className="input-field"
                required
              />
              <input
                type="text"
                {...register('country_code')}
                placeholder="Country Code"
                className="input-field"
                required
              />
            </>
          )}
          <input
            type="email"
            {...register('email')}
            placeholder="Email"
            className="input-field"
            required
          />
          <input
            type="password"
            {...register('password')}
            placeholder="Password"
            className="input-field"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        {message && <p className="text-center text-red-500 mt-3">{message}</p>}

        <button
          onClick={toggleAuthMode}
          className="w-full mt-4 text-black font-semibold hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}

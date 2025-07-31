import api from '@/api/axios-instance';
import { useMutation } from '@tanstack/react-query';
import type { Response } from '@/models/response';
import type { Login } from '@/models/login';
import { useAuthStore } from '@/store/auth-store';
import { useNavigate } from 'react-router-dom';
import { PathName } from '@/models/path-enums';

/**
 * API call to login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 *
 * @returns {Promise<Response<Login>>} - Promise resolving to the login response
 */

export const loginApi = async (
  email: string,
  password: string
): Promise<Response<Login>> => {
  try {
    const response = await api.post<Response<Login>>('/login', {
      email,
      password,
    });

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error('Login Failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to handle user login
 *
 * @returns {UseMutationResult<Response<Login>, Error, { email: string; password: string }>} - Mutation result for login
 *
 * @example
 * const { mutate: login } = useLogin();
 * login({ email: 'user@example.com', password: 'password123' });
 */

export const useLogin = () => {
  const { setToken, login, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data: Response<Login>) => {
      setToken(data.data.token); // Store the token in Zustand store
      login(data.data.token, data.data.user); // Update auth state with user info
      setUser(data.data.user); // Update user info in Zustand store
      navigate(PathName.HOMEPAGE); // Redirect to the home page
    },
  });
};

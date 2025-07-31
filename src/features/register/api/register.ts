import { useNavigate } from 'react-router-dom';

import api from '@/api/axios-instance';
import { PathName } from '@/models/path-enums';
import { useMutation } from '@tanstack/react-query';

import type { Response } from '@/models/response';
import type { User } from '@/models/login';
import type { RegisterSchemaType } from '@/features/register/schema/register-schema';

/**
 * Registers a new user.
 *
 * @param {Register} params - The parameters for registering a new user.
 * @param {RegisterSchemaType} params.query - The registration data including email, password, name, and password confirmation.
 *
 * @returns {Promise<Response<User>>} A promise that resolves to the registered user data.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const user = await registerApi({ query: { email: '<email>', password: '<password>', name: '<name>', password_confirmation: '<password_confirmation>' } });
 */

interface Register {
  query: RegisterSchemaType;
}

export const registerApi = async ({
  query,
}: Register): Promise<Response<User>> => {
  try {
    const response = await api.post<Response<User>>('/register', query);

    const data = response.data;

    if (data.status_code !== 201) {
      throw new Error('Register Failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Register failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to register a new user using React Query.
 *
 * @returns {UseMutationResult<Response<User>, Error, RegisterSchemaType>} The mutation result containing the registered user data or error.
 *
 * @example
 * const { mutateAsync: register } = useRegister();
 * await register({ email: '<email>', password: '<password>', name: '<name>', password_confirmation: '<password_confirmation>' });
 */

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: ({
      email,
      password,
      name,
      password_confirmation,
    }: {
      email: string;
      password: string;
      name: string;
      password_confirmation: string;
    }) =>
      registerApi({ query: { email, password, name, password_confirmation } }),
    onSuccess: () => {
      navigate(PathName.LOGIN); // Redirect to the login page
    },
  });
};

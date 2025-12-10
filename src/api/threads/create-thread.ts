import { useNavigate } from "react-router-dom";

import api from "@/api/axios-instance";
import { PathName } from "@/enums/path-enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Threads } from "@/types/threads";
import type { ResponseError, Response } from "@/types/response";
import type { CreateThreadSchemaType } from "@/features/threads/pages/create-thread/schema/create-thread-schema";

/**
 * Creates a new thread.
 *
 * @param {CreateThreadSchemaType} query - The data for creating a new thread.
 * @returns {Promise<Response<Threads>>} A promise that resolves to the created thread data.
 * @throws {Error} If the API request fails or returns an error response.
 * @example
 * const newThread = await createThread({ title: 'New Thread', content: 'Thread content' });
 */

export const createThread = async (
  query: CreateThreadSchemaType
): Promise<Response<Threads>> => {
  try {
    const response = await api.post<Response<Threads>>('/threads', query);

    const data = response.data;

    if (data.status_code !== 201) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Threads fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to create a new thread using React Query.
 *
 * @param {function} onSuccess - Optional callback function to be called on successful thread creation.
 * @returns {UseMutationResult<Response<Threads>, ResponseError, CreateThreadSchemaType>} The mutation result containing the created thread data or error.
 * @example
 * const { mutateAsync: createThread } = useCreateThread();
 * await createThread({ title: 'New Thread', content: 'Thread content' });
 */

export const useCreateThread = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Response<Threads>, ResponseError, CreateThreadSchemaType>({
    mutationKey: ['create-thread'],
    mutationFn: (params: CreateThreadSchemaType) => createThread(params),
    onSuccess: (data) => {
      // Invalidate threads query to refetch after creating a new thread
      queryClient.invalidateQueries({ queryKey: ["threads-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["one-thread"] });
      queryClient.invalidateQueries({
        queryKey: ["threads-protocols-infinite"],
      });

      onSuccess?.();
      navigate(`${PathName.THREADS}/${data.data.id}`);
    },
  });
};

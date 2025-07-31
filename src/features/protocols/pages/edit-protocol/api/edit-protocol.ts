import api from '@/api/axios-instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Response, ResponseError } from '@/models/response';
import type { Protocols } from '@/models/protocols';
import type { CreateProtocolSchemaType } from '@/features/protocols/pages/create-protocol/schema/create-protocol-schema';

/**
 * Edits an existing protocol by its ID.
 *
 * @param {string} protocolId - The ID of the protocol to edit.
 * @param {CreateProtocolSchemaType} query - The data to update the protocol with.
 * @returns {Promise<Response<Protocols>>} A promise that resolves to the updated protocol data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const updatedProtocol = await editProtocol('123', { title: 'New Title', content: 'Updated content' });
 */

export const editProtocol = async (
  protocolId: string,
  query: CreateProtocolSchemaType
): Promise<Response<Protocols>> => {
  try {
    const response = await api.put(`/protocols/${protocolId}`, query);

    const data = response.data;
    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Edit protocol failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to edit a protocol using React Query.
 *
 * @param {string} protocolId - The ID of the protocol to edit.
 * @param {function} onSuccess - Optional callback function to be called on successful edit.
 * @returns {UseMutationResult<Response<Protocols>, ResponseError, CreateProtocolSchemaType>} The mutation result.
 *
 * @example
 * const { mutateAsync: editProtocol } = useEditProtocol('123', onSuccess);
 */

export const useEditProtocol = (protocolId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<
    Response<Protocols>,
    ResponseError,
    CreateProtocolSchemaType
  >({
    mutationKey: ['edit-protocol', protocolId],
    mutationFn: (query: CreateProtocolSchemaType) =>
      editProtocol(protocolId, query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['one-protocol'] });
      onSuccess?.();
    },
  });
};

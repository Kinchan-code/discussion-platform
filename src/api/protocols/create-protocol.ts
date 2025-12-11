import { useNavigate } from "react-router-dom";

import api from "@/api/axios-instance";
import { PathName } from "@/enums/path-enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { slugify } from "@/lib/utils";

import type { Response, ResponseError } from "@/types/response";
import type { Protocols } from "@/types/protocols";
import type { CreateProtocolSchemaType } from "@/features/protocols/pages/create-protocol/schema/create-protocol-schema";

/**
 * Creates a new protocol.
 *
 * @param {CreateProtocolSchemaType} query - The data for the new protocol.
 * @returns {Promise<Response<Protocols>>} A promise that resolves to the created protocol data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const newProtocol = await createProtocol({ title: 'New Protocol', content: 'Protocol content' });
 */

export const createProtocol = async (
  query: CreateProtocolSchemaType
): Promise<Response<Protocols>> => {
  try {
    const response = await api.post("/protocols", query);

    const data = response.data;
    if (data.status_code !== 201) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create protocol failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to create a new protocol using React Query.
 *
 * @param {function} onSuccess - Optional callback function to be called on successful creation.
 * @returns {UseMutationResult<Response<Protocols>, ResponseError, CreateProtocolSchemaType>} The mutation result.
 *
 * @example
 * const { mutateAsync: createProtocol } = useCreateProtocol(onSuccess);
 */

export const useCreateProtocol = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<
    Response<Protocols>,
    ResponseError,
    CreateProtocolSchemaType
  >({
    mutationKey: ["create-protocol"],
    mutationFn: (query: CreateProtocolSchemaType) => createProtocol(query),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["protocols-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["one-protocol"] });
      onSuccess?.();
      navigate(
        `${PathName.PROTOCOLS}/${data.data.id}/${slugify(data.data.title)}`
      );
    },
  });
};

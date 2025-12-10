import api from "@/api/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * deleteProtocol
 *
 * @description Deletes a protocol by its ID from the server.
 *
 * components used:
 * - api (Axios instance)
 *
 * @param {string} protocolId - The ID of the protocol to delete.
 *
 * @returns {Promise<any>} The API response data if deletion is successful.
 * @throws {Error} If the response status is not 200 or the request fails.
 * @example
 * await deleteProtocol("456");
 */
export const deleteProtocol = async (protocolId: string) => {
  try {
    const response = await api.delete(`/protocols/${protocolId}`);
    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message || "Failed to delete protocol");
    }

    return data;
  } catch (error) {
    console.error("Error deleting protocol:", error);
    throw error;
  }
};

/**
 * useDeleteProtocol
 *
 * @description Custom React Query hook to delete a protocol and invalidate related queries.
 *
 * components used:
 * - useMutation (React Query)
 * - useQueryClient (React Query)
 *
 * @param {() => void} [onSuccess] Optional callback executed after a successful deletion.
 *
 * @returns {ReturnType<typeof useMutation>} A mutation object for triggering the deletion.
 *
 * @example
 * const deleteProtocol = useDeleteProtocol(() => {
 *   console.log('Protocol deleted successfully');
 * });
 * deleteProtocol.mutate(456);
 */
export const useDeleteProtocol = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-protocol"],
    mutationFn: (protocolId: string) => deleteProtocol(protocolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["one-protocol"] });
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] });
      onSuccess?.();
    },
  });
};

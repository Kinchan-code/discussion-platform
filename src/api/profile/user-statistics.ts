import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { type ResponseError, type Response } from "@/types/response";
import type { ProfileStatistics } from "@/types/profile";

/**
 * Fetches user statistics from the server.
 *
 * @returns {Promise<Response<ProfileStatistics>>} A promise that resolves to the user statistics data.
 * @throws {Error} If the API request fails or returns an error response.
 *
 * @example
 * const userStatistics = await getUserStatistics();
 */

export const getUserStatistics = async (): Promise<
  Response<ProfileStatistics>
> => {
  try {
    const response = await api.get<Response<ProfileStatistics>>(
      "/profile/statistics"
    );

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    // Handle network errors and API errors
    if (error instanceof Error) {
      throw new Error(`Statistics fetch failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Custom hook to fetch user statistics using React Query.
 *
 * @returns {UseQueryResult<Response<ProfileStatistics>, ResponseError>} The query result containing user statistics data or error.
 *
 * @example
 * const { data, error, isLoading } = useGetUserStatistics();
 */

export const useGetUserStatistics = () => {
  return useQuery<Response<ProfileStatistics>, ResponseError>({
    queryKey: ["user-statistics"],
    queryFn: getUserStatistics,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import type { Search } from "@/types/search";
import type { Response } from "@/types/response";

interface Query {
  q: string;
}

interface QueryParams {
  params: Query;
}

export const getSearchSuggestions = async ({
  params,
}: QueryParams): Promise<Response<Search>> => {
  try {
    const response = await api.get<Response<Search>>(`/search/suggestions`, {
      params,
    });

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Search suggestions fetch failed: ${error}`);
    }
    throw error;
  }
};

export const useGetSearchSuggestions = ({ params }: QueryParams) => {
  return useQuery({
    queryKey: ["search-suggestions", params.q],
    queryFn: () => getSearchSuggestions({ params }),
    enabled: !!params.q,
  });
};

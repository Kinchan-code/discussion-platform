import api from "@/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import type { Search } from "@/types/search";
import type { Response } from "@/types/response";

interface Query {
  q: string;
  page?: number;
  perPage?: number;
}

interface QueryParams {
  params: Query;
}

export const getSearch = async ({
  params,
}: QueryParams): Promise<Response<Search>> => {
  try {
    const response = await api.get<Response<Search>>(`/search`, { params });

    const data = response.data;

    if (data.status_code !== 200) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Search fetch failed: ${error}`);
    }
    throw error;
  }
};

export const useGetSearch = ({ params }: QueryParams) => {
  return useQuery({
    queryKey: ["search", params.q, params.page, params.perPage],
    queryFn: () => getSearch({ params }),
    enabled: !!params.q,
  });
};

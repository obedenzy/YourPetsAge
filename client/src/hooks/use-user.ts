import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

export function useUser() {
  return useQuery<User>({
    queryKey: ["/api/user"],
  });
}

export function useUpdateTokens() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tokens: number) => {
      const response = await apiRequest("POST", "/api/user/tokens", { tokens });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });
}

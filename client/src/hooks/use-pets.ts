import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Pet, InsertPet } from "@shared/schema";

export function usePets() {
  return useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });
}

export function usePet(id: string) {
  return useQuery<Pet>({
    queryKey: ["/api/pets", id],
    enabled: !!id,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pet: InsertPet) => {
      const response = await apiRequest("POST", "/api/pets", pet);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pet> }) => {
      const response = await apiRequest("PUT", `/api/pets/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/pets/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
    },
  });
}

export function useCalculateAge() {
  return useMutation({
    mutationFn: async (data: { birthDate: string; sizeCategory: string }) => {
      const response = await apiRequest("POST", "/api/calculate-age", data);
      return response.json();
    },
  });
}

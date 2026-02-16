import { gerarService } from "../gerarService";
import type { ServiceInputProps } from "../ServiceInputProps";
import type { Banco } from "./@types/Banco";

export const bancoGateway = {
  findAll: async (input: ServiceInputProps<null, null>) => (
    await gerarService({
      endpoint: `/bancos`,
      method: "GET",
      options: input
    })
  ),
  save: async (input: ServiceInputProps<Banco, null>) => (
    await gerarService({
      endpoint: `/bancos`,
      method: "POST",
      options: input
    })
  ),
  findById: async (id: number, input: ServiceInputProps<null, null>) => (
    await gerarService({
      endpoint: `/bancos/${id}`,
      method: "GET",
      options: input
    })
  ),
  deleteById: async (id: number, input: ServiceInputProps<null, null>) => (
    await gerarService({
      endpoint: `/bancos/${id}`,
      method: "DELETE",
      options: input
    })
  ),
};

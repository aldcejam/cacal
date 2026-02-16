import type { Usuario } from "../../usuario/@types/Usuario";

export type GastoRecorrente = {
    id?: string
    user?: Usuario
    pagamento?: string
    descricao?: string
    categoria?: string
    valor?: number
}

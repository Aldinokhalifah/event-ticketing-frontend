import { TiketStatus } from "../enum/TiketStatus"

export interface TiketResponse {
    id: string,
    kodeTiket: string,
    status: TiketStatus,
    userId: string,
    orderItemId: string
};
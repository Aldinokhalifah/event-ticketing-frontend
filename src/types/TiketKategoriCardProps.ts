import { TiketKategoriResponse } from "./response/TiketKategoriResponse"

export interface TiketKategoriCardProps {
    kategori: TiketKategoriResponse
    onBeli?: (kategori: TiketKategoriResponse) => void
    isLoggedIn?: boolean
}
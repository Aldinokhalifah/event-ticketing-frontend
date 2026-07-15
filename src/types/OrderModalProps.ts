import { TiketKategoriResponse } from "./response/TiketKategoriResponse"

export interface OrderModalProps {
    kategori: TiketKategoriResponse
    onClose: () => void
}
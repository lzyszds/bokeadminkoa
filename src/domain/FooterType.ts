export interface Footer {
    footer_id: number;
    footer_type: string;
    footer_content: string;
    footer_url: string;
    footer_order: number;
    created_at: Date;
}

export interface FooterSecondary {
    footer_id: number
    footer_content: string
    footer_order: number
    children: Footer[]
}

export interface FooterPrincipal {
    footer_id: number
    footer_content: string
    footer_order: number
    children: FooterSecondary[]
}

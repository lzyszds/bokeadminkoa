export interface AiUc {
    id: number;
    created_at: string;
    google: number;
    github178: number;
    ljy: number;
    yanye: number;
}

export interface AiUcKeys {
    id: number;
    created_at: string;
    keyName: 'created_at' | 'google' | 'github178' | 'ljy' | 'yanye';
    keyValue: string;
}


export interface AppLogItem {
    id: number;
    label: string;
    type?: 'WARNING';
}

export type AppLogItems = AppLogItem[];

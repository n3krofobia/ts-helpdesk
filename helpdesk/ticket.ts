export const priorityOrder = {
    high: 1,
    normal: 2,
    low: 3
} as const;

export const statuses = ['new', 'doing', 'done'] as const;

export type Priority = keyof typeof priorityOrder;

export type Status = typeof statuses[number];

export interface Ticket {
    id: number;
    title: string;
    priority: Priority;
    status: Status;
}


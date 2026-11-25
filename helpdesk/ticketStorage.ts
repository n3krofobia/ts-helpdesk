import type {Ticket} from './ticket.js';

interface StoredData {
    tickets: Ticket[];
    currentId: number;
}

export class TicketStorage {

    storageKey!: string = "";
    tickets!: Ticket[] = [];
    currentId!: number = 1;

    saveToStorage(): void{
        const data: StoredData = {
            tickets: this.tickets,
            currentId: this.currentId
        };

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadFromStorage(): void{
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return;   

        try {
            const data: Partial<StoredData> = JSON.parse(raw);
            this.tickets = data.tickets ?? [];
            this.currentId = data.currentId ?? 1;
        } catch (e) {
            console.error("Corrupted storage data", e);
            localStorage.removeItem(this.storageKey);
        }
    }
}

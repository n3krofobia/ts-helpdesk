import { priorityOrder, statuses } from './ticket.js';
import type { TicketRenderer } from './ticketRender.js';
import { Ticket, Status } from '.ticket.js';

export const feedbackLabel = document.getElementById("feedback") as HTMLParagraphElement;

export class Helpdesk extends TicketRenderer {
    statusElement: HTMLSelectElement;
    ticketList: HTMLDivElement;

    constructor() {
        super();
        this.storageKey = "helpdeskData";
        this.tickets = [];
        this.currentId = 1;
        this.statusElement = document.getElementById("status") as HTMLSelectElement;
        this.ticketList = document.getElementById("list") as HTMLDivElement;
        this.loadFromStorage();
    }

    addTicket(ticket: Ticket): boolean {
        feedbackLabel.textContent = "";

        if (this.tickets.length < 1000) {
            this.tickets.push(ticket);
            this.saveToStorage();
            return true;
        }

        feedbackLabel.textContent = "too many tickets!";
        return false;
    }

    getTickets(): Ticket[] {
        return this.tickets;
    }

    removeTicket(id: number): boolean {
        let left: number = 0,
            right: number = this.tickets.length - 1;

        while (left <= right) {
            let pivot = Math.floor((left + right) / 2);
            let ticket = this.tickets[pivot];

            if (ticket.id === id) {
                this.tickets.splice(pivot, 1);
                this.saveToStorage();
                return true;
            }
            else if (ticket.id > id) {
                right = pivot - 1;
            }
            else {
                left = pivot + 1;
            }
        }

        return false;
    }

    getTicketAmount(): number {
        return this.tickets.length;
    }

    filterTicketsByStatus(status: string): Ticket[] {
        if (status === "all")
            return this.tickets;

        if (!(statuses.includes(status as Status))) {
            return [];
        }

        return this.tickets.filter(ticket => ticket.status === status);
    }

    import(importData: string): string {
        let data: any;

        try {
            data = JSON.parse(importData);
        }
        catch (error) {
            return "invalid JSON file";
        }

        if (!Array.isArray(data))
            return "wrong JSON format";

        if (data.length > 1000)
            return "too many tickets in the file";

        for (const ticket of data) {
            if (ticket == null || typeof ticket !== "object")
                return "each ticket must be an object";

            if (!Number.isInteger(ticket.id) || ticket.id < 1)
                return "id needs to be a positive integer";

            if (typeof ticket.title !== "string")
                return "title needs to be of type string";

            if (typeof ticket.priority !== "string")
                return "priority needs to be of type string";

            if (!(ticket.priority in priorityOrder))
                return "incorrect priority";

            if (typeof ticket.status !== "string")
                return "status needs to be of type string";

            if (!statuses.includes(ticket.status))
                return "incorrect status";
        }

        // Keep tickets in ID order because removeTicket uses binary search.
        data.sort((a: Ticket, b: Ticket) => a.id - b.id);

        for (let i = 1; i < data.length; i++) {
            if (data[i].id === data[i - 1].id)
                return "ticket IDs must be unique";
        }

        this.tickets = data;
        this.currentId = data.length > 0
            ? data[data.length - 1].id + 1
            : 1;

        this.saveToStorage();
        this.renderTickets();

        return "import successful";
    }
}

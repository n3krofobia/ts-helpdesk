import { Helpdesk, feedbackLabel } from './helpdesk.js';
import type {Ticket, Priority } from './ticket.js';

(document.getElementById("title") as HTMLInputElement).focus();

const helpdesk = new Helpdesk();

helpdesk.renderTickets();

(document.getElementById("submitButton") as HTMLButtonElement).addEventListener('click', (e : MouseEvent) => {
    e.preventDefault(); // prevents reload on enter

    feedbackLabel.textContent = "";

    let title: string = (document.getElementById("title") as HTMLInputElement).value.trim();

    if (title.length < 3 || title.length > 80) {
        feedbackLabel.textContent = "tickets title must have between 3 and 80 characters";
        return;
    }

    let ticket: Ticket = {
        id: helpdesk.currentId++,
        title: title,
        priority: (document.getElementById("priority") as HTMLSelectElement).value as Priority,
        status: "new"
    }

    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("priority") as HTMLSelectElement).value = "low";

    helpdesk.addTicket(ticket);

    helpdesk.renderTickets();
});

helpdesk.statusElement.addEventListener('change', () => {
    helpdesk.renderTickets();
});

const fileInput = document.getElementById("importInput") as HTMLInputElement;

// async lets us use await while the selected file is being read.
async function handleImport(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files[0];

    if (!file) {
        return;
    }

    try {
        // file.text() returns a Promise with the file's text.
        const importData: string = await file.text();

        alert(helpdesk.import(importData));
    }
    catch (error) {
        console.error("Could not read the import file", error);
        alert("Could not read the file. Please try again.");
    }

    // Clear the input so the same file can be selected again.
    fileInput.value = "";
}

fileInput.addEventListener("change", (event: Events) => {
    handleImport(event);
});

document.getElementById("exportLabel").addEventListener('click', () => {
    prompt("Your export JSON", JSON.stringify(helpdesk.tickets));
});

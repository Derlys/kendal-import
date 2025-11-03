export interface Contact {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    agentUid?: string;
    createdOn: string;
    updatedOn?: string;
    [key: string]: any;
}

export interface ContactField {
    id: string;
    label: string;
    type: "text" | "number" | "phone" | "email" | "datetime";
    core: boolean;
}

export interface User {
    uid: string;
    name: string;
    email: string;
}

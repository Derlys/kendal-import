export type SystemField =
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "agentUid"
    | "";

export type FieldConfidence = "high" | "medium" | "low";

export interface FieldSuggestion {
    column: string;
    suggested: SystemField;
    confidence: FieldConfidence;
}

export type Row = Record<string, string | number | null | undefined>;

export interface ImportPayload {
    columns: string[];
    data: Row[];
    suggestions: FieldSuggestion[];
}

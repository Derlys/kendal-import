import { normalizeHeader } from "./normalize";
import type { FieldSuggestion, SystemField, FieldConfidence } from "./types";

const FIELD_DICTIONARY: Record<SystemField, string[]> = {
    firstName: ["first name", "firstname", "given name", "name"],
    lastName: ["last name", "lastname", "surname", "family name"],
    email: ["email", "email address"],
    phone: ["phone", "mobile", "telephone", "cell"],
    agentUid: ["agent", "assigned agent", "user", "sales rep"],
    "": [],
};

export function autoMapHeaders(columns: string[]): FieldSuggestion[] {
    return columns.map((col) => {
        const normalized = normalizeHeader(col);
        let suggested: SystemField = "";
        let confidence: FieldConfidence = "low";

        for (const [field, synonyms] of Object.entries(FIELD_DICTIONARY)) {
            if (synonyms.includes(normalized)) {
                suggested = field as SystemField;
                confidence = "high";
                break;
            } else if (synonyms.some((s) => normalized.includes(s))) {
                suggested = field as SystemField;
                confidence = "medium";
            }
        }

        return {
            column: col,
            suggested,
            confidence,
        };
    });
}

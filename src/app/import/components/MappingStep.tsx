"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldSuggestion, SystemField } from "@/lib/mapping/types";

const MAPPABLE_FIELDS: SystemField[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "agentUid",
];

export function MappingStep({
  columns,
  suggestions,
  onBack,
  onNext,
}: {
  columns: string[];
  suggestions: FieldSuggestion[];
  onBack: () => void;
  onNext: (mappings: Record<string, string>) => void;
}) {
  const [mappings, setMappings] = useState<Record<string, SystemField | "">>(
    Object.fromEntries(
      suggestions.map((s) => [s.column, (s.suggested as SystemField) || ""]),
    ),
  );

  const handleChange = (column: string, value: string) => {
    setMappings((prev) => ({ ...prev, [column]: value as SystemField }));
  };

  const handleContinue = () => {
    const unassigned = Object.values(mappings).filter((m) => !m);
    if (unassigned.length > 0) {
      alert("Please map all columns before continuing.");
      return;
    }

    onNext(mappings);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-sm rounded-xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Map Fields to Contact Schema
      </h2>

      <div className="grid grid-cols-3 font-medium text-sm border-b pb-2 mb-2">
        <span>File Column</span>
        <span>Suggested Mapping</span>
        <span>Confidence</span>
      </div>

      {suggestions.map((s) => {
        const isMappable = MAPPABLE_FIELDS.includes(s.suggested as SystemField);
        const disabled =
          !isMappable && !MAPPABLE_FIELDS.includes(s.column as SystemField);

        return (
          <div
            key={s.column}
            className={`grid grid-cols-3 items-center border-b py-2 text-sm ${
              disabled ? "opacity-60" : ""
            }`}
          >
            <span>{s.column}</span>

            {disabled ? (
              <span className="italic text-gray-400">
                Ignored (system field)
              </span>
            ) : (
              <select
                value={mappings[s.column] || s.suggested}
                onChange={(e) => handleChange(s.column, e.target.value)}
                className="border rounded p-1 bg-white"
              >
                <option value="">Select field</option>
                {MAPPABLE_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            )}

            <span className="text-gray-500 text-sm">{s.confidence}</span>
          </div>
        );
      })}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={handleContinue}>Continue →</Button>
      </div>
    </div>
  );
}

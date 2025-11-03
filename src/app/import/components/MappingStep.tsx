"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FieldSuggestion, SystemField, Row } from "@/lib/mapping/types";

interface MappingStepProps {
  columns: string[];
  data: Row[];
  suggestions: FieldSuggestion[];
  onBack: () => void;
}

export function MappingStep({
  columns,
  data,
  suggestions,
  onBack,
}: MappingStepProps) {
  const [mappings, setMappings] = useState<Record<string, SystemField>>(
    Object.fromEntries(
      suggestions.map((s) => [s.column, s.suggested ?? ""]),
    ) as Record<string, SystemField>,
  );

  const handleChange = (column: string, value: string) => {
    setMappings((prev) => ({ ...prev, [column]: value as SystemField }));
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-sm border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Detect Fields
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Review detected columns and confirm mappings before importing your
          contacts.
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 font-medium text-sm border-b pb-2 mb-3 text-gray-600">
          <span>File Column</span>
          <span>Suggested Mapping</span>
          <span>Confidence</span>
        </div>

        {suggestions.map((s) => (
          <div
            key={s.column}
            className="grid grid-cols-3 items-center border-b py-3 text-sm hover:bg-gray-50 transition"
          >
            <span className="font-mono text-gray-700">{s.column}</span>
            <select
              value={mappings[s.column] || s.suggested}
              onChange={(e) => handleChange(s.column, e.target.value)}
              className="border rounded-md px-2 py-1 text-gray-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select field</option>
              {["firstName", "lastName", "phone", "email", "agentUid"].map(
                (f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ),
              )}
            </select>
            <span
              className={cn(
                "text-xs px-2 py-1 border rounded-md text-center capitalize w-fit",
                getConfidenceColor(s.confidence),
              )}
            >
              {s.confidence}
            </span>
          </div>
        ))}

        {/* Preview table */}
        <div className="mt-8">
          <h3 className="font-medium mb-2 text-gray-800">Preview</h3>
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {columns.slice(0, 5).map((col) => (
                    <th
                      key={col}
                      className="text-left px-3 py-2 text-gray-600 font-medium"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 3).map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    {columns.slice(0, 5).map((col) => (
                      <td key={col} className="px-3 py-2 text-gray-700">
                        {String(row[col] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          type="button"
          onClick={() => {
            const unassigned = Object.values(mappings).filter((m) => !m);
            if (unassigned.length > 0) {
              alert("Please map all columns before continuing.");
              return;
            }
            console.log("✅ Final mappings ready:", mappings);
          }}
        >
          Continue →
        </Button>
      </CardFooter>
    </Card>
  );
}

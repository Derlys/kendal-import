"use client";
import { Button } from "@/components/ui/button";

export function SummaryStep({
  summary,
  onRestart,
}: {
  summary: { created: number; merged: number; skipped: number };
  onRestart: () => void;
}) {
  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-sm rounded-xl text-center">
      <h2 className="text-xl font-semibold mb-4">Import Complete 🎉</h2>
      <p className="text-gray-600 mb-6">
        Your contacts were successfully imported into the system.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6 text-sm font-medium">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-600">Created</p>
          <p className="text-lg font-semibold">{summary.created}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-yellow-600">Merged</p>
          <p className="text-lg font-semibold">{summary.merged}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-600">Skipped</p>
          <p className="text-lg font-semibold">{summary.skipped}</p>
        </div>
      </div>

      <Button
        onClick={onRestart}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
      >
        ← Start a New Import
      </Button>
    </div>
  );
}

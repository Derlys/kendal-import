import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

interface ContactRow {
  [key: string]: string | number | null | undefined;
}

interface ImportRequest {
  data: ContactRow[];
  mappings: Record<string, string>;
}

interface ImportSummary {
  created: number;
  merged: number;
  skipped: number;
}

export async function POST(req: Request) {
  try {
    const body: ImportRequest = await req.json();

    const { data, mappings } = body;

    const companyId = "QPkApXCoUCDZ2qmoaE4D";
    const contactsRef = adminDb.collection(`companies/${companyId}/contacts`);

    const summary: ImportSummary = { created: 0, merged: 0, skipped: 0 };

    for (const row of data) {
      const contact: Record<string, string | number | null> = {};

      for (const [column, field] of Object.entries(mappings)) {
        const value = row[column];
        if (value !== undefined && value !== null) {
          contact[field] = String(value);
        }
      }

      const email = (contact.email as string)?.trim();
      const phone = (contact.phone as string)?.trim();

      if (!email && !phone) {
        summary.skipped++;
        continue;
      }

      const existingByEmail = email
        ? await contactsRef.where("email", "==", email).limit(1).get()
        : null;

      const existingByPhone = phone
        ? await contactsRef.where("phone", "==", phone).limit(1).get()
        : null;

      const existingDoc =
        existingByEmail && !existingByEmail.empty
          ? existingByEmail.docs[0]
          : existingByPhone && !existingByPhone.empty
            ? existingByPhone.docs[0]
            : null;

      if (existingDoc) {
        const existingData = existingDoc.data() as Record<
          string,
          string | number | null
        >;
        const mergedData = {
          ...existingData,
          ...Object.fromEntries(
            Object.entries(contact).filter(
              ([, value]) =>
                value !== "" && value !== null && value !== undefined,
            ),
          ),
          updatedOn: new Date().toISOString(),
        };

        await contactsRef.doc(existingDoc.id).set(mergedData, { merge: true });
        summary.merged++;
      } else {
        await contactsRef.add({
          ...contact,
          createdOn: new Date().toISOString(),
        });
        summary.created++;
      }
    }

    return NextResponse.json({ success: true, summary }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Import error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
    console.error("❌ Unknown import error:", error);
    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 },
    );
  }
}

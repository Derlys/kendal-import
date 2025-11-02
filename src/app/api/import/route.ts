import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
export async function GET() {
    try {
        const demoContact = {
            firstName: "Derlys",
            lastName: "ConnectionTest",
            email: "derlys.test@example.com",
            phone: "+573001112233",
            createdOn: new Date().toISOString(),
        };


        const companyId = "QPkApXCoUCDZ2qmoaE4D";
        const ref = adminDb.collection(`companies/${companyId}/contacts`).doc();
        await ref.set(demoContact);
        const snapshot = await adminDb.collection(`companies/${companyId}/contacts`).get();

        const contacts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(
            { success: true, count: contacts.length, contacts },
            { status: 200 }
        );
        //@ts-expect-error any
    } catch (error: never) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
        const demoContact = {
            firstName: "Derlys",
            lastName: "ConnectionTest",
            email: "derlys.test@example.com",
            phone: "+573001112233",
            createdOn: new Date().toISOString(),
        };


const companyId = "demo";
        const ref = adminDb.collection(`companies/${companyId}/contacts`).doc();
        await ref.set(demoContact);

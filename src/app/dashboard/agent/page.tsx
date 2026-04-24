import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { AgentWorkspace } from "@/components/agent/agent-workspace";

export default async function AgentPage() {
    const session = await auth();
    const userId = session!.user.id as string;

    // 1. Fetch real backend data
    const allClients = await db.select().from(clients).where(eq(clients.caId, userId));

    const allRequests = await db
        .select()
        .from(requests)
        .where(eq(requests.caId, userId))
        .orderBy(desc(requests.updatedAt));

    // 2. Pass it to our interactive workspace
    return (
        <AgentWorkspace
            clients={allClients}
            requests={allRequests}
        />
    );
}
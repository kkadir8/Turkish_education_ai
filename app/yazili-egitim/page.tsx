import { ChatInterface } from "@/components/chat/ChatInterface";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function YaziliEgitimPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <ChatInterface />
        </div>
    );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SesliEgitimClient from "./SesliEgitimClient";

export default async function AudioEducationPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    return <SesliEgitimClient />;
}

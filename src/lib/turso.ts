import { createClient } from "@libsql/client/web";

function getTursoClient() {
    const url = import.meta.env.TURSO_DATABASE_URL;
    const authToken = import.meta.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        throw new Error("Missing Turso database URL or Auth Token in environment.");
    }

    return createClient({
        url,
        authToken,
    });
}

export const turso = getTursoClient();

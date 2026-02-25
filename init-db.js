import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    console.error("Missing TURSO_DATABASE_URL");
    process.exit(1);
}

const db = createClient({
    url,
    authToken,
});

async function main() {
    try {
        console.log("Connecting to Turso and creating table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS permohonan_surat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resi TEXT UNIQUE NOT NULL,
                nik TEXT NOT NULL,
                nama TEXT NOT NULL,
                jenis_surat TEXT NOT NULL,
                keperluan TEXT NOT NULL,
                no_hp TEXT NOT NULL,
                status TEXT DEFAULT 'Pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'permohonan_surat' created or already exists!");
    } catch (e) {
        console.error("Error creating table:", e);
    }
}

main();

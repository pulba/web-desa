export const prerender = false; // Opt out of static generation

import type { APIRoute } from "astro";
import { turso } from "../../lib/turso";

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { resi, nik, nama, jenisSurat, keperluan, noHp } = data;

        if (!resi || !nik || !nama || !jenisSurat || !keperluan || !noHp) {
            return new Response(JSON.stringify({ error: "Semua field harus diisi" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { rowsAffected } = await turso.execute({
            sql: `INSERT INTO permohonan_surat 
            (resi, nik, nama, jenis_surat, keperluan, no_hp, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
            args: [resi, nik, nama, jenisSurat, keperluan, noHp],
        });

        return new Response(JSON.stringify({
            success: true,
            message: "Permohonan berhasil disimpan",
            rowsAffected
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("API Error submit-permohonan:", error);
        return new Response(JSON.stringify({
            error: "Gagal menyimpan permohonan ke database"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

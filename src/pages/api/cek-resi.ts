export const prerender = false; // Opt out of static generation

import type { APIRoute } from "astro";
import { turso } from "../../lib/turso";

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const resi = url.searchParams.get("resi");
        const nik = url.searchParams.get("nik");

        if (!resi && !nik) {
            return new Response(JSON.stringify({ error: "Masukkan setidaknya Nomor Resi atau NIK" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        let query = "SELECT * FROM permohonan_surat WHERE ";
        let args = [];

        if (resi && nik) {
            query += "resi = ? AND nik = ?";
            args.push(resi, nik);
        } else if (resi) {
            query += "resi = ?";
            args.push(resi);
        } else if (nik) {
            query += "nik = ?";
            args.push(nik);
        }

        const result = await turso.execute({
            sql: query,
            args: args,
        });

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: "Data permohonan tidak ditemukan" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const row = result.rows[0];

        return new Response(JSON.stringify({
            success: true,
            data: {
                resi: row.resi,
                nama: row.nama,
                jenisSurat: row.jenis_surat,
                keperluan: row.keperluan,
                status: row.status,
                createdAt: row.created_at,
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("API Error cek-resi:", error);
        return new Response(JSON.stringify({ error: "Terjadi kesalahan pada server" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

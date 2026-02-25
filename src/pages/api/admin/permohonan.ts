export const prerender = false;

import type { APIRoute } from "astro";
import { turso } from "../../../lib/turso";

export const GET: APIRoute = async ({ request }) => {
    try {
        const result = await turso.execute({
            sql: "SELECT * FROM permohonan_surat ORDER BY created_at DESC",
            args: []
        });

        // The libSQL client returns column names in lowercase by default
        return new Response(JSON.stringify({
            success: true,
            data: result.rows
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("API Error admin/permohonan GET:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Gagal mengambil data permohonan dari database"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const PATCH: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { resi, status } = body;

        if (!resi || !status) {
            return new Response(JSON.stringify({
                success: false,
                error: "Resi dan status baru wajib dikirimkan"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const validStatuses = ["Pending", "Diproses", "Selesai", "Ditolak"];
        if (!validStatuses.includes(status)) {
            return new Response(JSON.stringify({
                success: false,
                error: "Status tidak valid"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { rowsAffected } = await turso.execute({
            sql: "UPDATE permohonan_surat SET status = ? WHERE resi = ?",
            args: [status, resi]
        });

        if (rowsAffected === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: "Data permohonan tidak ditemukan"
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Status berhasil diperbarui"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("API Error admin/permohonan PATCH:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Gagal memperbarui status ke database"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

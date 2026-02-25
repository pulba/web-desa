import React, { useEffect, useState } from "react";

export default function SuratManager(props: any) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/permohonan");
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            } else {
                setError(json.error || "Gagal mengambil data");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (resi: string, newStatus: string) => {
        try {
            setUpdating(resi);
            const res = await fetch("/api/admin/permohonan", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ resi, status: newStatus }),
            });
            const json = await res.json();
            if (json.success) {
                // Update local state
                setData(
                    data.map((item) =>
                        item.resi === resi ? { ...item, status: newStatus } : item
                    )
                );
            } else {
                alert("Gagal merubah status: " + json.error);
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Diproses":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Selesai":
                return "bg-green-100 text-green-800 border-green-200";
            case "Ditolak":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat data secara live dari Turso DB...</div>;
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 text-red-600 border border-red-200 rounded-xl m-4">
                <strong>Error Koneksi Database:</strong> {error}
                <button onClick={fetchData} className="mt-4 block px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition">Coba Muat Ulang</button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 font-sans">
            <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Permohonan Surat</h2>
                    <p className="text-sm text-gray-500 mt-1">Data sinkron langsung secara real-time dari Turso Analytics.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition"
                >
                    Muat Ulang Data
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">Belum ada pemohon surat yang masuk ke sistem database.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-4">Nomor Resi</th>
                                <th scope="col" className="px-6 py-4 border-l border-gray-200">Waktu Masuk</th>
                                <th scope="col" className="px-6 py-4 border-l border-gray-200">Info Pemohon</th>
                                <th scope="col" className="px-6 py-4 border-l border-gray-200">Jenis Surat</th>
                                <th scope="col" className="px-6 py-4 border-l border-gray-200">Status Aksi Cepat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.resi} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                        {item.resi}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs border-l border-gray-100">
                                        {new Date(item.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 border-l border-gray-100">
                                        <div className="font-semibold text-gray-900">{item.nama}</div>
                                        <div className="text-xs text-gray-500 mt-1">NIK: {item.nik}</div>
                                        <div className="text-xs text-gray-500">HP: {item.no_hp}</div>
                                    </td>
                                    <td className="px-6 py-4 border-l border-gray-100">
                                        <span className="bg-gray-100 border border-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                            {item.jenis_surat}
                                        </span>
                                        <p className="mt-2 text-xs italic text-gray-500 max-w-xs truncate" title={item.keperluan}>
                                            "{item.keperluan}"
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 border-l border-gray-100 min-w-[180px]">
                                        <div className="flex flex-col gap-2">
                                            <select
                                                disabled={updating === item.resi}
                                                value={item.status}
                                                onChange={(e) => handleStatusChange(item.resi, e.target.value)}
                                                className={`text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none font-bold transition-colors cursor-pointer ${getStatusColor(item.status)}`}
                                            >
                                                <option value="Pending">🕒 Pending</option>
                                                <option value="Diproses">⚙️ Diproses</option>
                                                <option value="Selesai">✅ Selesai</option>
                                                <option value="Ditolak">❌ Ditolak</option>
                                            </select>
                                            {updating === item.resi && (
                                                <span className="text-xs text-blue-500 font-medium animate-pulse text-center block mt-1">
                                                    Memperbarui database...
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

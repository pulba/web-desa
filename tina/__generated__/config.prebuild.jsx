// tina/config.ts
import { defineConfig } from "tinacms";

// tina/CategorySelect.tsx
import React, { useState, useRef, useEffect } from "react";
var TAMBAH_BARU_VALUE = "__tambah_baru__";
var CategorySelect = (props) => {
  const { input, field } = props;
  const options = field.options || [];
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef(null);
  const currentIsCustom = input.value && !options.includes(input.value);
  useEffect(() => {
    if (isCustomMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomMode]);
  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === TAMBAH_BARU_VALUE) {
      setIsCustomMode(true);
      setCustomValue("");
    } else {
      setIsCustomMode(false);
      input.onChange(val);
    }
  };
  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      input.onChange(customValue.trim());
      setIsCustomMode(false);
    }
  };
  const handleCustomKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSubmit();
    }
    if (e.key === "Escape") {
      setIsCustomMode(false);
      setCustomValue("");
    }
  };
  const handleBackToSelect = () => {
    setIsCustomMode(false);
    setCustomValue("");
  };
  return React.createElement("div", null, React.createElement(
    "label",
    {
      style: {
        display: "block",
        fontSize: "14px",
        fontWeight: 600,
        marginBottom: "6px",
        color: "#333"
      }
    },
    field.label || field.name
  ), !isCustomMode ? React.createElement("div", null, React.createElement(
    "select",
    {
      value: currentIsCustom ? "" : input.value || "",
      onChange: handleSelectChange,
      style: {
        width: "100%",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        backgroundColor: "#fff",
        cursor: "pointer",
        outline: "none"
      }
    },
    React.createElement("option", { value: "" }, "\u2014 Pilih Kategori \u2014"),
    options.map((opt) => React.createElement("option", { key: opt, value: opt }, opt)),
    React.createElement(
      "option",
      {
        value: TAMBAH_BARU_VALUE,
        style: { fontWeight: "bold", fontStyle: "italic" }
      },
      "\u2795 Tambah Kategori Baru..."
    )
  ), currentIsCustom && React.createElement(
    "div",
    {
      style: {
        marginTop: "6px",
        padding: "6px 10px",
        backgroundColor: "#f0fdf4",
        borderRadius: "6px",
        border: "1px solid #bbf7d0",
        fontSize: "13px",
        color: "#166534"
      }
    },
    "Kategori saat ini:",
    " ",
    React.createElement("strong", null, input.value),
    " ",
    React.createElement("span", { style: { color: "#6b7280", fontSize: "12px" } }, "(custom)")
  )) : React.createElement("div", null, React.createElement("div", { style: { display: "flex", gap: "8px" } }, React.createElement(
    "input",
    {
      ref: inputRef,
      type: "text",
      value: customValue,
      onChange: (e) => setCustomValue(e.target.value),
      onKeyDown: handleCustomKeyDown,
      placeholder: "Ketik nama kategori baru...",
      style: {
        flex: 1,
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #3b82f6",
        fontSize: "14px",
        outline: "none",
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)"
      }
    }
  ), React.createElement(
    "button",
    {
      type: "button",
      onClick: handleCustomSubmit,
      style: {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#3b82f6",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer"
      }
    },
    "Simpan"
  ), React.createElement(
    "button",
    {
      type: "button",
      onClick: handleBackToSelect,
      style: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        backgroundColor: "#f9fafb",
        color: "#6b7280",
        fontSize: "13px",
        cursor: "pointer"
      }
    },
    "Batal"
  )), React.createElement(
    "p",
    {
      style: {
        marginTop: "6px",
        fontSize: "12px",
        color: "#6b7280"
      }
    },
    "Tekan Enter untuk simpan, Escape untuk batal.",
    React.createElement("br", null),
    "\u{1F4A1} Tip: Tambahkan juga di Pengaturan Global agar muncul sebagai tombol filter di website."
  )));
};
var CategorySelect_default = CategorySelect;

// tina/components/SuratManager.tsx
import React2, { useEffect as useEffect2, useState as useState2 } from "react";
function SuratManager(props) {
  const [data, setData] = useState2([]);
  const [loading, setLoading] = useState2(true);
  const [error, setError] = useState2("");
  const [updating, setUpdating] = useState2(null);
  useEffect2(() => {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (resi, newStatus) => {
    try {
      setUpdating(resi);
      const res = await fetch("/api/admin/permohonan", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resi, status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setData(
          data.map(
            (item) => item.resi === resi ? { ...item, status: newStatus } : item
          )
        );
      } else {
        alert("Gagal merubah status: " + json.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUpdating(null);
    }
  };
  const getStatusColor = (status) => {
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
    return React2.createElement("div", { className: "p-8 text-center text-gray-500 animate-pulse" }, "Memuat data secara live dari Turso DB...");
  }
  if (error) {
    return React2.createElement("div", { className: "p-8 bg-red-50 text-red-600 border border-red-200 rounded-xl m-4" }, React2.createElement("strong", null, "Error Koneksi Database:"), " ", error, React2.createElement("button", { onClick: fetchData, className: "mt-4 block px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition" }, "Coba Muat Ulang"));
  }
  return React2.createElement("div", { className: "w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 font-sans" }, React2.createElement("div", { className: "mb-6 flex justify-between items-center pb-4 border-b border-gray-100" }, React2.createElement("div", null, React2.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Manajemen Permohonan Surat"), React2.createElement("p", { className: "text-sm text-gray-500 mt-1" }, "Data sinkron langsung secara real-time dari Turso Analytics.")), React2.createElement(
    "button",
    {
      onClick: fetchData,
      className: "px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition"
    },
    "Muat Ulang Data"
  )), data.length === 0 ? React2.createElement("div", { className: "text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300" }, React2.createElement("p", { className: "text-gray-500" }, "Belum ada pemohon surat yang masuk ke sistem database.")) : React2.createElement("div", { className: "overflow-x-auto rounded-lg border border-gray-200" }, React2.createElement("table", { className: "w-full text-sm text-left text-gray-500" }, React2.createElement("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200" }, React2.createElement("tr", null, React2.createElement("th", { scope: "col", className: "px-6 py-4" }, "Nomor Resi"), React2.createElement("th", { scope: "col", className: "px-6 py-4 border-l border-gray-200" }, "Waktu Masuk"), React2.createElement("th", { scope: "col", className: "px-6 py-4 border-l border-gray-200" }, "Info Pemohon"), React2.createElement("th", { scope: "col", className: "px-6 py-4 border-l border-gray-200" }, "Jenis Surat"), React2.createElement("th", { scope: "col", className: "px-6 py-4 border-l border-gray-200" }, "Status Aksi Cepat"))), React2.createElement("tbody", null, data.map((item) => React2.createElement("tr", { key: item.resi, className: "bg-white border-b hover:bg-gray-50 transition" }, React2.createElement("td", { className: "px-6 py-4 font-bold text-gray-900 whitespace-nowrap" }, item.resi), React2.createElement("td", { className: "px-6 py-4 font-mono text-xs border-l border-gray-100" }, new Date(item.created_at).toLocaleString("id-ID")), React2.createElement("td", { className: "px-6 py-4 border-l border-gray-100" }, React2.createElement("div", { className: "font-semibold text-gray-900" }, item.nama), React2.createElement("div", { className: "text-xs text-gray-500 mt-1" }, "NIK: ", item.nik), React2.createElement("div", { className: "text-xs text-gray-500" }, "HP: ", item.no_hp)), React2.createElement("td", { className: "px-6 py-4 border-l border-gray-100" }, React2.createElement("span", { className: "bg-gray-100 border border-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium" }, item.jenis_surat), React2.createElement("p", { className: "mt-2 text-xs italic text-gray-500 max-w-xs truncate", title: item.keperluan }, '"', item.keperluan, '"')), React2.createElement("td", { className: "px-6 py-4 border-l border-gray-100 min-w-[180px]" }, React2.createElement("div", { className: "flex flex-col gap-2" }, React2.createElement(
    "select",
    {
      disabled: updating === item.resi,
      value: item.status,
      onChange: (e) => handleStatusChange(item.resi, e.target.value),
      className: `text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none font-bold transition-colors cursor-pointer ${getStatusColor(item.status)}`
    },
    React2.createElement("option", { value: "Pending" }, "\u{1F552} Pending"),
    React2.createElement("option", { value: "Diproses" }, "\u2699\uFE0F Diproses"),
    React2.createElement("option", { value: "Selesai" }, "\u2705 Selesai"),
    React2.createElement("option", { value: "Ditolak" }, "\u274C Ditolak")
  ), updating === item.resi && React2.createElement("span", { className: "text-xs text-blue-500 font-medium animate-pulse text-center block mt-1" }, "Memperbarui database...")))))))));
}

// tina/config.ts
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  // See docs on content modeling for more info: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "manajemenSurat",
        label: "Surat Desa",
        path: "src/content/manajemen",
        format: "json",
        match: {
          include: "index"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Info Navigasi",
            description: "Halaman ini digunakan untuk Manajemen Database secara real-time",
            ui: { component: "hidden" }
          },
          {
            type: "string",
            name: "dashboard",
            label: "Panel Manajemen Surat",
            ui: {
              component: SuratManager
            }
          }
        ]
      },
      {
        name: "berita",
        label: "Berita",
        path: "src/content/berita",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Judul Berita",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Tanggal",
            required: true
          },
          {
            type: "reference",
            name: "author",
            label: "Penulis",
            collections: ["authors"]
          },
          {
            type: "image",
            name: "image",
            label: "Thumbnail"
          },
          {
            type: "string",
            name: "category",
            label: "Kategori",
            options: ["Kegiatan Desa", "Ekonomi", "Sosial", "Pembangunan", "Pengumuman"],
            ui: {
              component: CategorySelect_default
            }
          },
          {
            type: "string",
            name: "excerpt",
            label: "Ringkasan",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "status",
            label: "Status Publikasi",
            required: true,
            options: [
              { value: "Draft", label: "Draf" },
              { value: "Scheduled", label: "Penjadwalan" },
              { value: "Published", label: "Publish" },
              { value: "Take Down", label: "Take Down" }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Isi Berita",
            isBody: true
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags"
            }
          }
        ]
      },
      {
        name: "umkm",
        label: "Produk UMKM",
        path: "src/content/umkm",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Nama Produk",
            isTitle: true,
            required: true
          },
          {
            type: "number",
            name: "price",
            label: "Harga"
          },
          {
            type: "string",
            name: "owner",
            label: "Pemilik/Penjual"
          },
          {
            type: "image",
            name: "image",
            label: "Foto Utama Produk"
          },
          {
            type: "image",
            name: "gallery",
            label: "Galeri Foto Produk",
            list: true,
            description: "Tambahkan foto-foto tambahan produk (maks 4 foto)."
          },
          {
            type: "string",
            name: "category",
            label: "Kategori",
            options: ["Makanan", "Kerajinan", "Pertanian", "Minuman"],
            ui: {
              component: CategorySelect_default
            }
          },
          {
            type: "string",
            name: "phone",
            label: "Nomor WhatsApp Penjual",
            description: "Contoh: 6281234567890 (tanpa + atau spasi)"
          },
          {
            type: "string",
            name: "status",
            label: "Status Produk",
            options: ["Tersedia", "Habis", "Pre-Order"]
          },
          {
            type: "rich-text",
            name: "description",
            label: "Deskripsi Produk"
          }
        ]
      },
      {
        name: "bantuanSosial",
        label: "Data Bantuan Sosial",
        path: "src/content/bantuan",
        format: "json",
        match: {
          include: "main"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "penerima",
            label: "Daftar Penerima Bantuan",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.nik ? `${item.nik} - ${item.nama}` : "Pribadi Baru"
              })
            },
            fields: [
              { type: "string", name: "nik", label: "Nomor Induk Kependudukan (NIK)", required: true, isTitle: true, description: "Masukkan 16 digit NIK" },
              { type: "string", name: "nama", label: "Nama Lengkap", required: true },
              { type: "string", name: "alamat", label: "Alamat/Dusun" },
              {
                type: "object",
                name: "program",
                label: "Daftar Program Bantuan",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.namaProgram ? `${item.namaProgram} (${item.status})` : "Program Bantuan"
                  })
                },
                fields: [
                  { type: "string", name: "namaProgram", label: "Nama Program (cth: PKH, BPNT, BLT DD)" },
                  { type: "string", name: "kategori", label: "Kategori Icon", options: ["Uang Tunai", "Bahan Pokok", "Kesehatan", "Pendidikan", "Lainnya"] },
                  { type: "string", name: "status", label: "Status Bantuan", options: ["Penerima Aktif", "Dalam Proses", "Tidak Terdaftar", "Dibatalkan"] },
                  { type: "string", name: "keterangan", label: "Keterangan Lengkap", ui: { component: "textarea" } }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "pengaduan",
        label: "Pengaduan Masyarakat",
        path: "src/content/pengaduan",
        fields: [
          {
            type: "string",
            name: "nama",
            label: "Nama Pelapor",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "tanggal",
            label: "Tanggal Laporan",
            required: true
          },
          {
            type: "string",
            name: "pesan",
            label: "Isi Laporan / Pesan",
            ui: {
              component: "textarea"
            },
            required: true
          },
          {
            type: "string",
            name: "jawabanAdmin",
            label: "Jawaban / Tanggapan Admin",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "status",
            label: "Status Pengaduan",
            options: ["Menunggu", "Dijawab", "Selesai"],
            required: true
          }
        ]
      },
      {
        name: "home",
        label: "Konten Beranda",
        path: "src/content/home",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            list: true,
            name: "slides",
            label: "Hero Slides",
            ui: {
              itemProps: (item) => ({ label: item?.title })
            },
            fields: [
              { type: "string", name: "title", label: "Judul" },
              { type: "string", name: "subtitle", label: "Sub Judul" },
              { type: "image", name: "image", label: "Gambar" },
              { type: "string", name: "ctaLabel", label: "Label Tombol" },
              { type: "string", name: "ctaLink", label: "Link Tombol" }
            ]
          },
          {
            type: "object",
            name: "welcome",
            label: "Sambutan Kepala Desa",
            fields: [
              { type: "string", name: "quote", label: "Kutipan Sambutan", ui: { component: "textarea" } },
              { type: "string", name: "name", label: "Nama Kepala Desa" },
              { type: "string", name: "title", label: "Jabatan" },
              { type: "image", name: "image", label: "Foto Kades" }
            ]
          }
        ]
      },
      {
        name: "gallery",
        label: "Galeri Foto",
        path: "src/content/gallery",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Judul Foto",
            isTitle: true,
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Gambar",
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Kategori",
            options: ["Alam", "Kegiatan", "Infrastruktur", "Ekonomi", "Lainnya"],
            ui: {
              component: CategorySelect_default
            },
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Tanggal Upload"
          }
        ]
      },
      {
        name: "profil",
        label: "Profil Desa",
        path: "src/content/profil",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Bagian Atas (Hero)",
            fields: [
              { type: "string", name: "title", label: "Judul Utana" },
              { type: "string", name: "subtitle", label: "Sub Judul", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Gambar Latar" }
            ]
          },
          {
            type: "string",
            name: "sejarah",
            label: "Sejarah Desa",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "visiMisi",
            label: "Visi & Misi",
            fields: [
              { type: "string", name: "visi", label: "Visi Desa", ui: { component: "textarea" } },
              { type: "string", name: "misi", label: "Misi Desa", list: true }
            ]
          },
          {
            type: "image",
            name: "organisasiImage",
            label: "Bagan Struktur Organisasi"
          },
          {
            type: "object",
            list: true,
            name: "wilayah",
            label: "Pembagian Wilayah (Dusun)",
            ui: {
              itemProps: (item) => ({ label: item?.name || "Dusun Baru" })
            },
            fields: [
              { type: "string", name: "name", label: "Nama Dusun", required: true },
              { type: "string", name: "kepala", label: "Kepala Dusun" },
              { type: "string", name: "penduduk", label: "Jumlah Penduduk" }
            ]
          },
          {
            type: "object",
            list: true,
            name: "perangkat",
            label: "Daftar Perangkat Desa (SOTK)",
            description: "Kelola daftar staf/perangkat desa yang akan muncul di slider.",
            ui: {
              itemProps: (item) => ({ label: `${item?.position || "Jabatan"}: ${item?.name || "Nama"}` })
            },
            fields: [
              { type: "string", name: "name", label: "Nama Lengkap", required: true, isTitle: true },
              { type: "string", name: "position", label: "Jabatan", required: true },
              { type: "image", name: "image", label: "Foto Formal", description: "Gunakan foto formal dengan rasio 3:4 untuk hasil terbaik." }
            ]
          }
        ]
      },
      {
        name: "ppid",
        label: "Layanan PPID",
        path: "src/content/ppid",
        format: "json",
        match: {
          include: "main"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Judul Halaman",
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Deskripsi",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "buttonLabel",
            label: "Teks Tombol Hero",
            description: "Opsional. Contoh: Dasar Hukum PPID"
          },
          {
            type: "string",
            name: "buttonLink",
            label: "Link Tombol Hero",
            description: "Opsional. Contoh: /hukum-ppid atau https://..."
          },
          {
            type: "string",
            name: "sectionTitle",
            label: "Judul Bagian Daftar",
            description: "Ganti teks 'INFORMASI PUBLIK TERBARU'"
          },
          {
            type: "string",
            name: "sectionSubtitle",
            label: "Sub-judul Bagian Daftar",
            description: "Keterangan opsional di bawah judul daftar"
          },
          {
            type: "object",
            name: "categories",
            label: "Kategori Informasi",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.title || "Kategori Baru" })
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Nama Kategori",
                required: true
              },
              {
                type: "string",
                name: "description",
                label: "Deskripsi Kategori",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "object",
                name: "groups",
                label: "Grup Dokumen (Accordion)",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item.title || "Grup Baru"
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Nama Grup",
                    required: true
                  },
                  {
                    type: "object",
                    name: "documents",
                    label: "Daftar Dokumen",
                    list: true,
                    ui: {
                      itemProps: (item) => ({
                        label: item.title || "Dokumen Baru"
                      })
                    },
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "Judul Dokumen",
                        required: true
                      },
                      {
                        type: "string",
                        name: "date",
                        label: "Tanggal (Contoh: Kamis, 7 Agustus 2025)"
                      },
                      {
                        type: "image",
                        name: "file",
                        label: "File Dokumen"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "infografis",
        label: "Data Desa",
        path: "src/content/infografis",
        format: "json",
        match: {
          include: "main"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "idm",
            label: "1. Indeks Desa Membangun (IDM)",
            fields: [
              { type: "string", name: "tahun", label: "Tahun Data", required: true },
              { type: "string", name: "status", label: "Status IDM", options: ["Sangat Tertinggal", "Tertinggal", "Berkembang", "Maju", "Mandiri", "Swasembada"] },
              { type: "number", name: "skor", label: "Skor Total IDM" },
              { type: "string", name: "targetStatus", label: "Target Status" },
              { type: "number", name: "skorMinimal", label: "Skor Minimal" },
              { type: "number", name: "penambahan", label: "Penambahan (Selisih)" },
              { type: "number", name: "iks", label: "IKS (Indeks Ketahanan Sosial)" },
              { type: "number", name: "ike", label: "IKE (Indeks Ketahanan Ekonomi)" },
              { type: "number", name: "ikl", label: "IKL (Indeks Ketahanan Lingkungan)" },
              {
                type: "object",
                name: "riwayatSkor",
                label: "Riwayat Skor Tahunan",
                list: true,
                ui: { itemProps: (item) => ({ label: `${item.tahun}: ${item.skor}` }) },
                fields: [
                  { type: "string", name: "tahun", label: "Tahun" },
                  { type: "number", name: "skor", label: "Total Skor" }
                ]
              },
              {
                type: "object",
                name: "indicators",
                label: "Tabel Indikator IDM",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: `[${item.group || "NO GROUP"}] ${item.indicator || "Indikator Baru"}`
                  })
                },
                fields: [
                  { type: "string", name: "group", label: "Grup (IKS/IKE/IKL)", options: ["IKS", "IKE", "IKL"] },
                  { type: "string", name: "indicator", label: "Nama Indikator", required: true },
                  { type: "number", name: "score", label: "Skor (1-5)" },
                  { type: "string", name: "keterangan", label: "Keterangan", ui: { component: "textarea" } },
                  { type: "string", name: "kegiatan", label: "Kegiatan yang Diusulkan", ui: { component: "textarea" } },
                  { type: "number", name: "nilaiPlus", label: "Nilai +" },
                  { type: "string", name: "stakeholders", label: "Stakeholders (Pisahkan koma)", description: "Contoh: DD, CSR, PU" }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "apbdes",
            label: "2. APBDes",
            fields: [
              { type: "string", name: "tahun", label: "Tahun Anggaran", required: true },
              { type: "number", name: "persentaseRealisasi", label: "Persentase Terealisasi (0-100)" },
              { type: "string", name: "fileLaporan", label: "Link/File Laporan PDF" },
              {
                type: "object",
                name: "rincianBelanja",
                label: "Rincian Belanja",
                list: true,
                ui: { itemProps: (item) => ({ label: item.bidang || "Bidang" }) },
                fields: [
                  { type: "string", name: "bidang", label: "Nama Bidang" },
                  { type: "string", name: "anggaran", label: "Besar Anggaran (Format Rp)" },
                  { type: "string", name: "persentase", label: "Persentase (contoh: 30%)" },
                  { type: "string", name: "warna", label: "Warna CSS (Tailwind class, e.g. bg-blue-500)" }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "penduduk",
            label: "3. Data Penduduk",
            fields: [
              { type: "string", name: "periode", label: "Periode Update", required: true },
              { type: "number", name: "lakiLaki", label: "Jumlah Laki-laki" },
              { type: "number", name: "perempuan", label: "Jumlah Perempuan" },
              {
                type: "object",
                name: "agama",
                label: "Statistik Agama",
                list: true,
                ui: { itemProps: (item) => ({ label: `${item.agama}: ${item.jumlah}` }) },
                fields: [
                  { type: "string", name: "agama", label: "Agama" },
                  { type: "string", name: "jumlah", label: "Jumlah Jiwa" },
                  { type: "string", name: "persentase", label: "Persentase (contoh: 90%)" }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "stunting",
            label: "4. Pencegahan Stunting",
            fields: [
              { type: "string", name: "tren", label: "Tren Keseluruhan", options: ["TREN MENURUN", "STABIL", "TREN MENINGKAT"] },
              { type: "number", name: "targetTahunIni", label: "Target Tahun Ini (%)" },
              { type: "number", name: "anakTerdampak", label: "Jumlah Anak Terdampak" },
              {
                type: "object",
                name: "dataTahunan",
                label: "Riwayat Data Tahunan",
                list: true,
                ui: { itemProps: (item) => ({ label: `${item.tahun}: ${item.persentase}%` }) },
                fields: [
                  { type: "string", name: "tahun", label: "Tahun" },
                  { type: "number", name: "persentase", label: "Persentase Stunting" }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "sdgs",
            label: "5. SDGs Desa",
            fields: [
              {
                type: "object",
                name: "daftarPencapaian",
                label: "Pencapaian Tujuan",
                list: true,
                ui: { itemProps: (item) => ({ label: `${item.tujuan}: ${item.skor}/100` }) },
                fields: [
                  { type: "string", name: "tujuan", label: "Poin Tujuan (contoh: Desa Tanpa Kelaparan)" },
                  { type: "number", name: "skor", label: "Skor Pencapaian (0-100)" },
                  { type: "string", name: "bgColor", label: "Warna BG CSS (bg-blue-500)" },
                  { type: "string", name: "textColor", label: "Warna Text CSS (text-blue-600)" }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "bansos",
            label: "6. Bantuan Sosial",
            fields: [
              { type: "string", name: "statusPenyaluran", label: "Status Global" },
              { type: "string", name: "periode", label: "Periode Penyaluran" },
              {
                type: "object",
                name: "program",
                label: "Daftar Program Bansos",
                list: true,
                ui: { itemProps: (item) => ({ label: `${item.nama}: ${item.jumlah} ${item.satuan}` }) },
                fields: [
                  { type: "string", name: "nama", label: "Nama Program (e.g. PKH)" },
                  { type: "string", name: "jumlah", label: "Jumlah Penerima" },
                  { type: "string", name: "satuan", label: "Satuan (e.g. KPM)" },
                  { type: "string", name: "icon", label: "Ikon Emoji" },
                  { type: "string", name: "warnaCss", label: "Aksen Warna CSS" }
                ]
              }
            ]
          },
          {
            type: "object",
            list: true,
            name: "stats",
            label: "7. Statistik Ringkasan",
            ui: {
              itemProps: (item) => ({ label: item?.label })
            },
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "value", label: "Nilai" },
              { type: "string", name: "unit", label: "Satuan" },
              { type: "string", name: "icon", label: "Icon ID", options: ["users", "map", "home", "shopping-bag"] }
            ]
          }
        ]
      },
      {
        name: "authors",
        label: "Penulis",
        path: "src/content/authors",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Nama Penulis",
            isTitle: true,
            required: true
          },
          {
            type: "image",
            name: "avatar",
            label: "Foto Profil"
          },
          {
            type: "string",
            name: "role",
            label: "Peran / Jabatan"
          },
          {
            type: "string",
            name: "bio",
            label: "Bio Singkat",
            ui: {
              component: "textarea"
            }
          }
        ]
      },
      {
        name: "settings",
        label: "Pengaturan",
        path: "src/content/settings",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "siteName",
            label: "Nama Desa"
          },
          {
            type: "string",
            name: "siteUrl",
            label: "URL Website Utama",
            description: "Gunakan format lengkap (contoh: https://desamakmur.go.id)"
          },
          {
            type: "string",
            name: "kabupaten",
            label: "Kabupaten"
          },
          {
            type: "string",
            name: "address",
            label: "Alamat Lengkap",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "phone",
            label: "Nomor Telepon"
          },
          {
            type: "string",
            name: "whatsappLayanan",
            label: "WhatsApp Layanan",
            description: "Nomor untuk menerima formulir permohonan surat (Gunakan format awalan 62, contoh: 6281234567890)"
          },
          {
            type: "string",
            name: "email",
            label: "Email Resmi"
          },
          {
            type: "image",
            name: "logo",
            label: "Logo Desa"
          },
          {
            type: "object",
            name: "social",
            label: "Media Sosial",
            fields: [
              { type: "string", name: "facebook", label: "Facebook URL" },
              { type: "string", name: "instagram", label: "Instagram URL" },
              { type: "string", name: "youtube", label: "YouTube URL" }
            ]
          },
          {
            type: "string",
            name: "googleMapsUrl",
            label: "URL Google Maps (Embed atau Link)"
          },
          {
            type: "object",
            name: "theme",
            label: "Warna & Tema",
            fields: [
              {
                type: "string",
                name: "primaryColor",
                label: "Warna Utama (Primary)",
                ui: {
                  component: "color"
                }
              },
              {
                type: "string",
                name: "secondaryColor",
                label: "Warna Sekunder",
                ui: {
                  component: "color"
                }
              }
            ]
          },
          {
            type: "string",
            name: "kategoriBerita",
            label: "Pilihan Kategori Berita",
            list: true,
            description: "Kelola pilihan kategori untuk berita. Tambah/hapus sesuai kebutuhan."
          },
          {
            type: "string",
            name: "kategoriUMKM",
            label: "Pilihan Kategori Produk UMKM",
            list: true,
            description: "Kelola pilihan kategori untuk produk UMKM."
          },
          {
            type: "string",
            name: "kategoriGaleri",
            label: "Pilihan Kategori Galeri",
            list: true,
            description: "Kelola pilihan kategori untuk galeri foto."
          },
          {
            type: "object",
            name: "seo",
            label: "Pengaturan SEO",
            fields: [
              {
                type: "string",
                name: "defaultTitle",
                label: "Judul Default (Default Title)",
                description: "Digunakan jika halaman tidak memiliki judul spesifik."
              },
              {
                type: "string",
                name: "titleTemplate",
                label: "Format Judul (Title Template)",
                description: "Format judul halaman (Gunakan '%s' untuk mewakili judul spesifik, contoh: '%s | Desa Makmur')."
              },
              {
                type: "string",
                name: "defaultDescription",
                label: "Deskripsi Default (Meta Description)",
                ui: {
                  component: "textarea"
                },
                description: "Deskripsi default yang dibaca oleh mesin pencari Google jika halaman tak memilikinya."
              },
              {
                type: "string",
                name: "defaultKeywords",
                label: "Kata Kunci Default (Meta Keywords)",
                description: "Pisahkan dengan koma (Contoh: desa, makmur, pelayanan publik)."
              },
              {
                type: "image",
                name: "favicon",
                label: "Ikon Tab (Favicon)",
                description: "Ikon kecil yang muncul di tab browser (Rekomendasi format: SVG atau ICO)."
              },
              {
                type: "image",
                name: "ogImage",
                label: "Gambar Thumbnail (Open Graph Image)",
                description: "Gambar default yang akan tampil saat website dibagikan ke WhatsApp, Facebook, dll."
              },
              {
                type: "string",
                name: "googleAnalyticsId",
                label: "Google Analytics Measurement ID",
                description: "Format ID untuk GA4, contoh: G-XXXXXXXXXX. Kosongkan jika belum ada."
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

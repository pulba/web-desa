import { defineCollection, z } from 'astro:content';

const beritaCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date().or(z.string()),
        author: z.string().optional(), // Now referencing an ID or filename
        image: z.string().optional(),
        category: z.string().optional(),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.string().optional().default("Published"),
    }),
});

const authorsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        avatar: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
    }),
});

const galleryCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        image: z.string(),
        category: z.string(),
        date: z.date().or(z.string()).optional(),
    }),
});

const umkmCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        price: z.number(),
        owner: z.string(),
        image: z.string(),
        gallery: z.array(z.string()).optional(),
        category: z.string(),
        phone: z.string().optional(),
        status: z.enum(["Tersedia", "Habis", "Pre-Order"]).optional().default("Tersedia"),
        description: z.string().optional(), // Keep optional if some use frontmatter
    }),
});

const settingsCollection = defineCollection({
    type: 'data',
    schema: z.object({
        siteName: z.string(),
        kabupaten: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        logo: z.string().optional(),
        whatsappLayanan: z.string().optional(),
        social: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            youtube: z.string().optional(),
        }).optional(),
        googleMapsUrl: z.string().optional(),
        theme: z.object({
            primaryColor: z.string().optional(),
            secondaryColor: z.string().optional(),
        }).optional(),
        kategoriBerita: z.array(z.string()).optional(),
        kategoriUMKM: z.array(z.string()).optional(),
        kategoriGaleri: z.array(z.string()).optional(),
        seo: z.object({
            defaultTitle: z.string().optional(),
            titleTemplate: z.string().optional(),
            defaultDescription: z.string().optional(),
            defaultKeywords: z.string().optional(),
            favicon: z.string().optional(),
            ogImage: z.string().optional(),
            googleAnalyticsId: z.string().optional(),
        }).optional(),
    }),
});

const infografisCollection = defineCollection({
    type: 'data',
    schema: z.object({
        idm: z.object({
            tahun: z.string(),
            status: z.enum(["Sangat Tertinggal", "Tertinggal", "Berkembang", "Maju", "Mandiri", "Swasembada"]).optional(),
            skor: z.number().optional(),
            targetStatus: z.string().optional(),
            skorMinimal: z.number().optional(),
            penambahan: z.number().optional(),
            iks: z.number().optional(),
            ike: z.number().optional(),
            ikl: z.number().optional(),
            riwayatSkor: z.array(z.object({
                tahun: z.string(),
                skor: z.number()
            })).optional(),
            indicators: z.array(z.object({
                group: z.enum(["IKS", "IKE", "IKL"]).optional(),
                indicator: z.string(),
                score: z.number().optional(),
                keterangan: z.string().optional(),
                kegiatan: z.string().optional(),
                nilaiPlus: z.number().optional(),
                stakeholders: z.string().optional()
            })).optional()
        }).optional(),
        apbdes: z.object({
            tahun: z.string(),
            persentaseRealisasi: z.number().optional(),
            fileLaporan: z.string().optional(),
            rincianBelanja: z.array(z.object({
                bidang: z.string(),
                anggaran: z.string(),
                persentase: z.string(),
                warna: z.string()
            })).optional()
        }).optional(),
        penduduk: z.object({
            periode: z.string(),
            lakiLaki: z.number().optional(),
            perempuan: z.number().optional(),
            agama: z.array(z.object({
                agama: z.string(),
                jumlah: z.string(),
                persentase: z.string()
            })).optional()
        }).optional(),
        stunting: z.object({
            tren: z.enum(["TREN MENURUN", "STABIL", "TREN MENINGKAT"]).optional(),
            targetTahunIni: z.number().optional(),
            anakTerdampak: z.number().optional(),
            dataTahunan: z.array(z.object({
                tahun: z.string(),
                persentase: z.number()
            })).optional()
        }).optional(),
        sdgs: z.object({
            daftarPencapaian: z.array(z.object({
                tujuan: z.string(),
                skor: z.number(),
                bgColor: z.string(),
                textColor: z.string()
            })).optional()
        }).optional(),
        bansos: z.object({
            statusPenyaluran: z.string().optional(),
            periode: z.string().optional(),
            program: z.array(z.object({
                nama: z.string(),
                jumlah: z.string(),
                satuan: z.string(),
                icon: z.string(),
                warnaCss: z.string()
            })).optional()
        }).optional(),
        stats: z.array(z.object({
            label: z.string(),
            value: z.string(),
            unit: z.string(),
            icon: z.string(),
        })).optional(),
    }),
});

const homeCollection = defineCollection({
    type: 'data',
    schema: z.object({
        slides: z.array(z.object({
            title: z.string(),
            subtitle: z.string(),
            image: z.string(),
            ctaLabel: z.string(),
            ctaLink: z.string(),
        })),
        welcome: z.object({
            quote: z.string(),
            name: z.string(),
            title: z.string(),
            image: z.string(),
        }),
    }),
});


const profilCollection = defineCollection({
    type: 'data',
    schema: z.object({
        hero: z.object({
            title: z.string(),
            subtitle: z.string(),
            image: z.string(),
        }),
        sejarah: z.string(),
        visiMisi: z.object({
            visi: z.string(),
            misi: z.array(z.string()),
        }),
        organisasiImage: z.string().optional(),
        wilayah: z.array(z.object({
            name: z.string(),
            kepala: z.string(),
            penduduk: z.string(),
        })),
        perangkat: z.array(z.object({
            name: z.string(),
            position: z.string(),
            image: z.string(),
        })).optional(),
    }),
});

const ppidCollection = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        buttonLabel: z.string().optional(),
        buttonLink: z.string().optional(),
        sectionTitle: z.string().optional(),
        sectionSubtitle: z.string().optional(),
        categories: z.array(z.object({
            title: z.string(),
            description: z.string().optional(),
            groups: z.array(z.object({
                title: z.string(),
                documents: z.array(z.object({
                    title: z.string(),
                    date: z.string().optional(),
                    file: z.string().optional(),
                })).optional(),
            })).optional(),
        })),
    }),
});

const pelacakanSuratCollection = defineCollection({
    type: 'data',
    schema: z.object({
        surat: z.array(z.object({
            resi: z.string(),
            namaLengkap: z.string(),
            nik: z.string().optional(),
            jenisSurat: z.string().optional(),
            status: z.string(),
            keterangan: z.string().optional(),
            tanggalUpdate: z.string().or(z.date()).optional(),
        })).optional(),
    }),
});

const bantuanSosialCollection = defineCollection({
    type: 'data',
    schema: z.object({
        penerima: z.array(z.object({
            nik: z.string(),
            nama: z.string(),
            alamat: z.string().optional(),
            program: z.array(z.object({
                namaProgram: z.string().optional(),
                kategori: z.string().optional(),
                status: z.string().optional(),
                keterangan: z.string().optional(),
            })).optional(),
        })).optional(),
    }),
});

const pengaduanCollection = defineCollection({
    type: 'content',
    schema: z.object({
        nama: z.string(),
        tanggal: z.date().or(z.string()),
        pesan: z.string(),
        jawabanAdmin: z.string().optional(),
        status: z.enum(["Menunggu", "Dijawab", "Selesai"]).default("Menunggu"),
    }),
});

export const collections = {
    'berita': beritaCollection,
    'gallery': galleryCollection,
    'authors': authorsCollection,
    'umkm': umkmCollection,
    'settings': settingsCollection,
    'home': homeCollection,
    'profil': profilCollection,
    'infografis': infografisCollection,
    'ppid': ppidCollection,
    'pelacakan': pelacakanSuratCollection,
    'bantuan': bantuanSosialCollection,
    'pengaduan': pengaduanCollection,
};

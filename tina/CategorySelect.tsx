import React, { useState, useRef, useEffect } from "react";

/**
 * CategorySelect — Custom TinaCMS field component
 * 
 * Menampilkan dropdown kategori dari `field.options` + opsi "Tambah Baru".
 * Ketika user memilih "Tambah Baru", muncul input text untuk mengetik kategori custom.
 * Nilai custom langsung disimpan ke field value.
 * 
 * Untuk menambahkan opsi baru secara permanen ke dropdown,
 * user perlu menambahkannya di "Pengaturan Global > Kategori Berita/UMKM/Galeri".
 */

const TAMBAH_BARU_VALUE = "__tambah_baru__";

const CategorySelect = (props: any) => {
    const { input, field } = props;
    const options: string[] = field.options || [];

    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // If current value is not in options, show it as custom
    const currentIsCustom = input.value && !options.includes(input.value);

    useEffect(() => {
        if (isCustomMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isCustomMode]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

    const handleCustomKeyDown = (e: React.KeyboardEvent) => {
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

    return (
        <div>
            <label
                style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "#333",
                }}
            >
                {field.label || field.name}
            </label>

            {!isCustomMode ? (
                <div>
                    <select
                        value={currentIsCustom ? "" : input.value || ""}
                        onChange={handleSelectChange}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            outline: "none",
                        }}
                    >
                        <option value="">— Pilih Kategori —</option>
                        {options.map((opt: string) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                        <option
                            value={TAMBAH_BARU_VALUE}
                            style={{ fontWeight: "bold", fontStyle: "italic" }}
                        >
                            ➕ Tambah Kategori Baru...
                        </option>
                    </select>

                    {currentIsCustom && (
                        <div
                            style={{
                                marginTop: "6px",
                                padding: "6px 10px",
                                backgroundColor: "#f0fdf4",
                                borderRadius: "6px",
                                border: "1px solid #bbf7d0",
                                fontSize: "13px",
                                color: "#166534",
                            }}
                        >
                            Kategori saat ini:{" "}
                            <strong>{input.value}</strong>{" "}
                            <span style={{ color: "#6b7280", fontSize: "12px" }}>
                                (custom)
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={customValue}
                            onChange={(e) => setCustomValue(e.target.value)}
                            onKeyDown={handleCustomKeyDown}
                            placeholder="Ketik nama kategori baru..."
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #3b82f6",
                                fontSize: "14px",
                                outline: "none",
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleCustomSubmit}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#3b82f6",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Simpan
                        </button>
                        <button
                            type="button"
                            onClick={handleBackToSelect}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #d1d5db",
                                backgroundColor: "#f9fafb",
                                color: "#6b7280",
                                fontSize: "13px",
                                cursor: "pointer",
                            }}
                        >
                            Batal
                        </button>
                    </div>
                    <p
                        style={{
                            marginTop: "6px",
                            fontSize: "12px",
                            color: "#6b7280",
                        }}
                    >
                        Tekan Enter untuk simpan, Escape untuk batal.
                        <br />
                        💡 Tip: Tambahkan juga di Pengaturan Global agar muncul sebagai
                        tombol filter di website.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CategorySelect;

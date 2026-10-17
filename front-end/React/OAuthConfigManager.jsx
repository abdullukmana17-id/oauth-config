
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/oauth-configs";

const FIELD_LABELS = {
    provider: "Provider",
    client_id: "Client ID",
    client_secret: "Client Secret",
    allow_login: "Izin Login",
    allow_register: "Izin Registrasi",
};

const EDITABLE_FIELDS = [
    "client_id",
    "client_secret",
    "allow_login",
    "allow_register",
];

// Membaca respons JSON dengan aman
async function readResponse(response) {
    try {
        return await response.json();
    } catch {
        return {};
    }
}

// Mengubah error server menjadi pesan yang mudah dibaca
function getErrorMessages(result, fallback) {
    const messages = result?.messages;

    if (messages && typeof messages === "object") {
        const errors = Object.entries(messages).flatMap(
            ([field, message]) => {
                const label = FIELD_LABELS[field] || field;
                const items = Array.isArray(message)
                    ? message
                    : [message];

                return items.map((text) => `${label}: ${text}`);
            }
        );

        if (errors.length > 0) {
            return errors.join("\n");
        }
    }

    return result?.message || fallback;
}

// Membandingkan nilai yang dapat diedit
function hasChanges(config, original) {
    if (!original) return true;

    return EDITABLE_FIELDS.some((field) => {
        if (
            ["allow_login", "allow_register", "is_enabled"].includes(field)
        ) {
            return Number(config[field]) !== Number(original[field]);
        }

        return (config[field] ?? "") !== (original[field] ?? "");
    });
}

export default function OAuthConfigManager() {
    const [configs, setConfigs] = useState([]);
    const [originalConfigs, setOriginalConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    // Mengambil seluruh konfigurasi OAuth
    const fetchConfigs = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(API_URL, {
                headers: {
                    Accept: "application/json",
                },
            });

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessages(
                        result,
                        "Gagal mengambil konfigurasi OAuth."
                    )
                );
            }

            if (!Array.isArray(result)) {
                throw new Error(
                    "Format respons konfigurasi tidak valid."
                );
            }

            setConfigs(result);
            setOriginalConfigs(result.map((config) => ({ ...config })));
        } catch (error) {
            setMessage(error.message || "Terjadi kesalahan.");
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    // Menghitung jumlah konfigurasi yang berubah
    const changedConfigs = configs.filter((config) => {
        const original = originalConfigs.find(
            (item) => String(item.id) === String(config.id)
        );

        return hasChanges(config, original);
    });

    // Menyimpan seluruh konfigurasi yang berubah
    const handleSaveAll = async () => {
        if (changedConfigs.length === 0) {
            setMessage("Tidak ada perubahan untuk disimpan.");
            setMessageType("info");
            return;
        }

        setSaving(true);
        setMessage("");

        const errors = [];
        let successCount = 0;

        try {
            // Simpan satu per satu agar setiap respons server dapat diperiksa
            for (const config of changedConfigs) {
                try {
                    const response = await fetch(
                        `${API_URL}/${config.id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                            body: JSON.stringify({
                                client_id: config.client_id,
                                client_secret: config.client_secret,
                                allow_login: Number(config.allow_login),
                                allow_register: Number(config.allow_register),
                                is_enabled: Number(config.is_enabled),
                            }),
                        }
                    );

                    const result = await readResponse(response);

                    if (!response.ok) {
                        throw new Error(
                            getErrorMessages(
                                result,
                                "Gagal memperbarui konfigurasi."
                            )
                        );
                    }

                    successCount++;
                } catch (error) {
                    errors.push(
                        `${config.provider} (ID ${config.id}):\n${error.message}`
                    );
                }
            }

            if (errors.length > 0) {
                const summary = [];

                if (successCount > 0) {
                    summary.push(
                        `${successCount} konfigurasi berhasil disimpan.`
                    );
                }

                summary.push(
                    `${errors.length} konfigurasi gagal disimpan.`
                );
                summary.push("", ...errors);

                setMessage(summary.join("\n"));
                setMessageType("danger");

                // Perbarui baseline hanya untuk konfigurasi yang berhasil.
                // Konfigurasi yang gagal tetap dapat diperbaiki dan dicoba lagi.
                setOriginalConfigs((current) =>
                    current.map((original) => {
                        const succeeded = changedConfigs.find(
                            (config) =>
                                String(config.id) === String(original.id) &&
                                !errors.some((error) =>
                                    error.startsWith(
                                        `${config.provider} (ID ${config.id}):`
                                    )
                                )
                        );

                        return succeeded
                            ? { ...succeeded }
                            : original;
                    })
                );

                return;
            }

            setOriginalConfigs(
                configs.map((config) => ({ ...config }))
            );
            setMessage(
                `${successCount} konfigurasi OAuth berhasil disimpan.`
            );
            setMessageType("success");
        } finally {
            setSaving(false);
        }
    };

    // Mengubah state input
    const handleChange = (id, field, value) => {
        setConfigs((current) =>
            current.map((config) =>
                String(config.id) === String(id)
                    ? { ...config, [field]: value }
                    : config
            )
        );

        setMessage("");
    };

    if (loading) {
        return (
            <div className="container py-4">
                <p>Memuat konfigurasi OAuth...</p>
            </div>
        );
    }

    return (
        <>
            <section className="py-4">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h1 className="display-6 fw-bolder mb-0">
                                Konfigurasi OAuth
                            </h1>
                            <p className="mb-0 text-muted">
                                Kelola kredensial dan status autentikasi OAuth.
                            </p>
                        </div>
                    </div>
                    {message && (
                        <div className="row mb-2">
                            <div className="col-12">
                                <div
                                    className={`alert mb-0 alert-${messageType}`}
                                    role="alert"
                                    style={{ whiteSpace: "pre-line" }}
                                >
                                    {message}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="row g-2 g-md-3">
                        {configs.length === 0 ? (
                            <div className="col-12 text-center">
                                <p className="mb-0">Tidak ada konfigurasi OAuth.</p>
                            </div>
                        ) : (
                            <>
                                {configs.map((config) => {
                                    const original = originalConfigs.find(
                                        (item) =>
                                            String(item.id) === String(config.id)
                                    );

                                    const changed = hasChanges(config, original);
                                    return (
                                        <div className="col-12 col-sm-6 col-lg-4">
                                            <div className="card rounded-4 border shadow-sm">
                                                <div className="card-header d-flex align-items-center gap-2 bg-transparent border-bottom-0">
                                                    <span class="me-3">
                                                        {config.provider === "google" ? (
                                                            <svg height="1.5rem" width="1.5rem" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47" /><path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4" /><path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00" /><polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" /><path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435" /><polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" /><path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" /></svg>
                                                        ) : config.provider === "github" ? (
                                                            <i class="bi bi-github fs-5"></i>
                                                        ) : (
                                                            <svg height="1.5rem" width="1.5rem" viewBox="0 0 512 512" data-name="Layer 1" id="Layer_2" xmlns="http://www.w3.org/2000/svg">
                                                                <path style={{ fill: "#7F40BD" }} d="M504.783,77.091h-0.006H303.494c-2.036,0-3.977,0.859-5.345,2.366
                                                                    c-1.368,1.508-2.038,3.52-1.842,5.549l3.925,40.693c0.343,3.552,3.228,6.32,6.792,6.516l42.05,2.314l-80.736,112.023L180.293,71.142
                                                                    l63.563-2.43c3.844-0.146,6.896-3.276,6.945-7.121l0.464-36.392c0.022-1.932-0.726-3.792-2.082-5.166
                                                                    c-1.356-1.372-3.206-2.147-5.137-2.147H7.22c-3.989,0-7.22,3.231-7.22,7.221v40.558c0,3.947,3.17,7.163,7.115,7.22l66.917,0.964
                                                                    l127.257,224.488l-0.568,140.205l-88.48,3.631c-3.817,0.155-6.85,3.259-6.923,7.077l-0.716,37.506
                                                                    c-0.037,1.939,0.709,3.81,2.069,5.196c1.356,1.383,3.212,2.161,5.151,2.161h276.762c1.981,0,3.875-0.813,5.239-2.249
                                                                    c1.363-1.435,2.078-3.368,1.974-5.346l-1.933-37.132c-0.192-3.692-3.14-6.641-6.835-6.834l-76.124-3.992l-11.082-136.57
                                                                    L436.479,137.33l55.64-2.53c3.063-0.142,5.704-2.202,6.587-5.139l12.909-43.018c0.248-0.729,0.385-1.516,0.385-2.332
                                                                    C512,80.325,508.772,77.091,504.783,77.091z"
                                                                />
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <span className="text-capitalize">
                                                        {config.provider}
                                                    </span>
                                                    {changed && (
                                                        <span className="badge text-body border bg-light-subtle">
                                                            Belum disimpan
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="card-body pb-0">
                                                    <div className="input-group mb-2">
                                                        <label className="input-group-text" htmlFor={`client-id-${config.id}`} type="button">
                                                            Client ID
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            aria-label="Username"
                                                            aria-describedby="basic-addon1"
                                                            id={`client-id-${config.id}`}
                                                            placeholder="Client ID"
                                                            value={config.client_id ?? ""}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    config.id,
                                                                    "client_id",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="input-group">
                                                        <label className="input-group-text" htmlFor={`client-secret-${config.id}`} type="button">
                                                            Client Secret
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            aria-label="Username"
                                                            aria-describedby="basic-addon1"
                                                            placeholder="Client Secret"
                                                            id={`client-secret-${config.id}`}
                                                            value={
                                                                config.client_secret ?? ""
                                                            }
                                                            autoComplete="new-password"
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    config.id,
                                                                    "client_secret",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="card-footer d-flex gap-2 align-items-center bg-transparent border-top-0 pt-2 pb-3">
                                                    {[
                                                        ["allow_login", "Izinkan Login"],
                                                        ["allow_register", "Izinkan Registrasi"],
                                                    ].map(([field, label]) => {
                                                        const enabled = Number(config[field]) === 1;

                                                        return (
                                                            <div key={field} className="d-inline">
                                                                <input
                                                                    type="checkbox"
                                                                    className="d-none"
                                                                    id={`${field}-${config.id}`}
                                                                    checked={enabled}
                                                                    onChange={(e) =>
                                                                        handleChange(
                                                                            config.id,
                                                                            field,
                                                                            e.target.checked ? 1 : 0
                                                                        )
                                                                    }
                                                                />

                                                                <label
                                                                    htmlFor={`${field}-${config.id}`}
                                                                    className={`btn btn-sm d-inline-flex align-items-center gap-2 ${enabled
                                                                        ? "btn-dark"
                                                                        : "btn-outline-dark"
                                                                        }`}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    {enabled && <i className="bi bi-check-lg" />}
                                                                    <span>{label}</span>
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )}

                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="alert alert-warning shadow-sm d-flex align-items-center justify-content-between gap-2 rounded-4">
                                <div>
                                    <h6 className="mb-1">Pengaturan OAuth</h6>
                                    <p className="text-muted small mb-0">
                                        Kelola konfigurasi dan hak akses autentikasi, lalu simpan perubahan Anda.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-dark btn-sm text-nowrap"
                                    disabled={saving || changedConfigs.length === 0}
                                    onClick={handleSaveAll}
                                >
                                    {saving ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                aria-hidden="true"
                                            />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            Simpan Perubahan
                                            <span className="badge">
                                                {changedConfigs.length > 0
                                                    ? ` ${changedConfigs.length}`
                                                    : ""
                                                }
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

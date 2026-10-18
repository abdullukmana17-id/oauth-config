import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/oauth-configs";

const FIELD_LABELS = {
    provider: "Provider",
    client_id: "Client ID",
    client_secret: "Client Secret",
    allow_login: "Izin Login",
    allow_register: "Izin Registrasi",
    is_enabled: "Status Provider",
};

async function readResponse(response) {
    try {
        return await response.json();
    } catch {
        return {};
    }
}

function getErrorMessages(result, fallback) {
    const messages = result?.messages;

    if (messages && typeof messages === "object") {
        const errors = Object.entries(messages).flatMap(
            ([field, message]) => {
                const label = FIELD_LABELS[field] || field;
                const items = Array.isArray(message)
                    ? message
                    : [message];

                return items.map((item) => `${label}: ${item}`);
            }
        );

        if (errors.length > 0) {
            return errors.join("\n");
        }
    }

    return result?.message || fallback;
}

// Logo provider menggunakan SVG seperti sebelumnya.
function ProviderIcon({ provider }) {
    switch (provider?.toLowerCase()) {
        case "google":
            return (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Google"
                >
                    <path
                        d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                        fill="#00ac47"
                    />
                    <path
                        d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                        fill="#4285f4"
                    />
                    <path
                        d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                        fill="#ffba00"
                    />
                    <path
                        d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                        fill="#ea4435"
                    />
                    <path
                        d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
                        fill="#4285f4"
                    />
                </svg>
            );

        case "github":
            return (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="GitHub"
                >
                    <path
                        fill="currentColor"
                        d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.03.75 2.08v3.12c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
                    />
                </svg>
            );

        default:
            return (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label={provider}
                >
                    <path
                        fill="#7F40BD"
                        d="M504.783,77.091h-.006H303.494c-2.036,0-3.977.859-5.345,2.366-1.368,1.508-2.038,3.52-1.842,5.549l3.925,40.693c.343,3.552,3.228,6.32,6.792,6.516l42.05,2.314-80.736,112.023L180.293,71.142l63.563-2.43c3.844-.146,6.896-3.276,6.945-7.121l.464-36.392c.022-1.932-.726-3.792-2.082-5.166-1.356-1.372-3.206-2.147-5.137-2.147H7.22C3.231,17.886,0,21.117,0,25.107v40.558c0,3.947,3.17,7.163,7.115,7.22l66.917.964 127.257,224.488-.568,140.205-88.48,3.631c-3.817.155-6.85,3.259-6.923,7.077l-.716,37.506c-.037,1.939.709,3.81,2.069,5.196 1.356,1.383 3.212,2.161 5.151,2.161h276.762c1.981,0 3.875-.813 5.239-2.249 1.363-1.435 2.078-3.368 1.974-5.346l-1.933-37.132c-.192-3.692-3.14-6.641-6.835-6.834l-76.124-3.992-11.082-136.57L436.479,137.33l55.64-2.53c3.063-.142 5.704-2.202 6.587-5.139l12.909-43.018c.248-.729.385-1.516.385-2.332C512,80.325,508.772,77.091,504.783,77.091Z"
                    />
                </svg>
            );
    }
}

// Toggle izin dengan ikon.
function PermissionToggle({
    id,
    label,
    icon,
    checked,
    disabled,
    onChange,
}) {
    return (
        <>
            <label
                className={`d-inline-flex align-items-center gap-2 mb-0 btn btn-sm btn-light p-1 px-2 rounded-2 ${checked ? 'active' : ''}`}
                type="button"
                htmlFor={id}
            >
                <span>{label}</span>
                <i className="bi bi-check-square-fill ms-auto"></i>
            </label>

            <input
                id={id}
                type="checkbox"
                role="switch"
                hidden
                className="form-check-input"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                aria-label={`${label}: ${checked ? "Aktif" : "Nonaktif"}`}
            />
        </>
    );
}

export default function OAuthConfigManager() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingId, setSavingId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    const [selectedConfig, setSelectedConfig] = useState(null);
    const [formData, setFormData] = useState(null);

    // Mengambil konfigurasi OAuth.
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

    // Membuka modal edit.
    const handleEdit = (config) => {
        if (saving) return;

        setSelectedConfig(config);

        setFormData({
            client_id: config.client_id ?? "",
            client_secret: "",
            allow_login: Number(config.allow_login) === 1,
            allow_register: Number(config.allow_register) === 1,
            is_enabled: Number(config.is_enabled) === 1,
        });

        setMessage("");
    };

    // Menutup modal tanpa menyimpan.
    const handleCloseModal = () => {
        if (saving) return;

        setSelectedConfig(null);
        setFormData(null);
    };

    // Mengubah nilai input modal.
    const handleChange = (field, value) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    // Menyimpan toggle izin untuk satu konfigurasi.
    const handleTogglePermission = async (config, field) => {
        if (saving) return;

        const currentValue = Number(config[field]) === 1;
        const newValue = currentValue ? 0 : 1;

        setSaving(true);
        setSavingId(config.id);
        setMessage("");

        try {
            const payload = {
                client_id: config.client_id ?? "",
                allow_login:
                    field === "allow_login"
                        ? newValue
                        : Number(config.allow_login),
                allow_register:
                    field === "allow_register"
                        ? newValue
                        : Number(config.allow_register),
                is_enabled: Number(config.is_enabled),
            };

            const response = await fetch(
                `${API_URL}/${config.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await readResponse(response);

            if (!response.ok) {
                throw new Error(
                    getErrorMessages(
                        result,
                        "Gagal memperbarui izin konfigurasi."
                    )
                );
            }

            setConfigs((current) =>
                current.map((item) =>
                    String(item.id) === String(config.id)
                        ? {
                            ...item,
                            [field]: newValue,
                        }
                        : item
                )
            );

            setMessage(
                `Izin ${field === "allow_login"
                    ? "login"
                    : "registrasi"
                } untuk ${config.provider} berhasil ${newValue === 1
                    ? "diaktifkan"
                    : "dinonaktifkan"
                }.`
            );

            setMessageType("success");
        } catch (error) {
            setMessage(error.message || "Terjadi kesalahan.");
            setMessageType("danger");
        } finally {
            setSaving(false);
            setSavingId(null);
        }
    };

    // Menyimpan satu konfigurasi dari modal.
    const handleSave = async (event) => {
        event.preventDefault();

        if (!selectedConfig || !formData || saving) return;

        try {
            setSaving(true);
            setSavingId(selectedConfig.id);
            setMessage("");

            const payload = {
                client_id: formData.client_id,
                allow_login: formData.allow_login ? 1 : 0,
                allow_register: formData.allow_register ? 1 : 0,
                is_enabled: formData.is_enabled ? 1 : 0,
            };

            // Secret hanya dikirim jika diisi dengan nilai baru.
            if (formData.client_secret.trim() !== "") {
                payload.client_secret = formData.client_secret;
            }

            const response = await fetch(
                `${API_URL}/${selectedConfig.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(payload),
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

            setConfigs((current) =>
                current.map((config) =>
                    String(config.id) === String(selectedConfig.id)
                        ? {
                            ...config,
                            client_id: formData.client_id,
                            allow_login: payload.allow_login,
                            allow_register: payload.allow_register,
                            is_enabled: payload.is_enabled,
                        }
                        : config
                )
            );

            setMessage(
                `Konfigurasi ${selectedConfig.provider} berhasil disimpan.`
            );
            setMessageType("success");

            setSelectedConfig(null);
            setFormData(null);
        } catch (error) {
            setMessage(error.message || "Terjadi kesalahan.");
            setMessageType("danger");
        } finally {
            setSaving(false);
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="container py-4">
                <div className="d-flex align-items-center gap-2">
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span>Memuat konfigurasi OAuth...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="py-4">
                <div className="container">
                    {/* Header */}
                    <div className="row mb-4">
                        <div className="col">
                            <h1 className="display-6">
                                Konfigurasi OAuth
                            </h1>

                            <p className="text-body-secondary mb-0">
                                Informasi dan pengaturan autentikasi OAuth.
                            </p>
                        </div>
                    </div>

                    {/* Kartu konfigurasi */}
                    <div className="row g-3">
                        {configs.length === 0 ? (
                            <div className="col-12">
                                <div className="alert alert-light rounded-4 border">
                                    Tidak ada konfigurasi OAuth.
                                </div>
                            </div>
                        ) : (
                            configs.map((config) => (
                                <div
                                    className="col-12 col-sm-6 col-lg-4"
                                    key={config.id}
                                >
                                    <div className="card h-100 border rounded-4">
                                        {/* Header kartu dengan tombol edit */}
                                        <div className="card-body p-3 d-flex align-items-start gap-2">
                                            <div className="icon border rounded-3 bg-light-subtle d-flex flex-shrink-0 align-items-center justify-content-center">
                                                <ProviderIcon
                                                    provider={config.provider}
                                                />
                                            </div>

                                            <div className="flex-grow-1 me-3">
                                                <h6 className="mb-0 text-capitalize font-sans">{config.provider}</h6>
                                                <p className="small bg-light px-1 rounded-1">
                                                    <code>{config.client_id}</code>
                                                </p>
                                                <OAuthProviderGuide
                                                    provider={config.provider}
                                                />
                                                <div className="w-100 d-flex gap-1">
                                                    <PermissionToggle
                                                        id={`allow-login-${config.id}`}
                                                        label="Login"
                                                        icon="bi-box-arrow-in-right"
                                                        checked={
                                                            Number(config.allow_login) === 1
                                                        }
                                                        disabled={saving}
                                                        onChange={() =>
                                                            handleTogglePermission(
                                                                config,
                                                                "allow_login"
                                                            )
                                                        }
                                                    />

                                                    <PermissionToggle
                                                        id={`allow-register-${config.id}`}
                                                        label="Registrasi"
                                                        icon="bi-person-plus"
                                                        checked={
                                                            Number(config.allow_register) === 1
                                                        }
                                                        disabled={saving}
                                                        onChange={() =>
                                                            handleTogglePermission(
                                                                config,
                                                                "allow_register"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm border ms-auto rounded-3"
                                                aria-label={`Edit konfigurasi ${config.provider}`}
                                                title="Edit konfigurasi"
                                                disabled={saving}
                                                data-bs-toggle="modal"
                                                data-bs-target="#editConfiguration"
                                                onClick={() => handleEdit(config)}
                                            >
                                                <i className="bi bi-pencil-square" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <>
                <div
                    className="modal fade"
                    id="editConfiguration"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="oauthModalTitle"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        {/* Modal edit konfigurasi */}
                        {selectedConfig && formData && (
                            <div className="modal-content">
                                <form onSubmit={handleSave}>
                                    <div className="modal-header border-bottom-0">
                                        <div className="d-flex align-items-center gap-3">

                                            <div className="icon border rounded-3 bg-light-subtle d-flex flex-shrink-0 align-items-center justify-content-center">
                                                <ProviderIcon
                                                    provider={selectedConfig.provider}
                                                />
                                            </div>

                                            <div>
                                                <h2
                                                    className="modal-title fs-6 mb-0"
                                                    id="oauthModalTitle"
                                                >
                                                    Edit Konfigurasi OAuth
                                                </h2>

                                                <small className="text-body-secondary text-capitalize">
                                                    {selectedConfig.provider}
                                                </small>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-sm ms-auto btn-light"
                                            aria-label="Tutup"
                                            disabled={saving}
                                            data-bs-dismiss="modal"
                                        >
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        <div class="form-floating mb-3">

                                            <input
                                                id="oauth-client-id"
                                                type="text"
                                                className="form-control"
                                                value={formData.client_id}
                                                onChange={(event) =>
                                                    handleChange(
                                                        "client_id",
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <label
                                                htmlFor="oauth-client-id"
                                                className="form-label"
                                            >
                                                Client ID
                                            </label>

                                        </div>

                                        <div class="form-floating mb-3">
                                            <input
                                                id="oauth-client-secret"
                                                type="password"
                                                className="form-control"
                                                placeholder="Kosongkan jika tidak ingin mengubah"
                                                value={formData.client_secret}
                                                onChange={(event) =>
                                                    handleChange(
                                                        "client_secret",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor="oauth-client-secret"
                                                className="form-label"
                                            >
                                                Client Secret
                                            </label>
                                        </div>

                                        <div className="form-check form-switch mb-3 d-flex align-items-center justify-content-between ps-0 gap-4">
                                            <label
                                                className="form-check-label me-5"
                                                htmlFor="oauth-login"
                                            >
                                                <h6 className="mb-0">Izinkan login melalui OAuth</h6>
                                                <p className="mb-0 small opacity-75">
                                                    Memungkinkan pengguna masuk ke aplikasi menggunakan akun penyedia OAuth ini. Nonaktifkan untuk mencegah penggunaan penyedia tersebut pada proses login.
                                                </p>
                                            </label>

                                            <input
                                                id="oauth-login"
                                                type="checkbox"
                                                className="form-check-input"
                                                role="switch"
                                                checked={formData.allow_login}
                                                onChange={(event) =>
                                                    handleChange(
                                                        "allow_login",
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-check form-switch mb-3 d-flex justify-content-between ps-0 gap-3">
                                            <label
                                                className="form-check-label me-5"
                                                htmlFor="oauth-register"
                                            >
                                                <h6 className="mb-0">Izinkan registrasi melalui OAuth</h6>
                                                <p className="mb-0 small opacity-75">
                                                    Memungkinkan pengguna baru membuat akun melalui penyedia OAuth ini. Pengaturan ini berbeda dari izin login dan dapat diaktifkan atau dinonaktifkan secara terpisah.
                                                </p>
                                            </label>

                                            <input
                                                id="oauth-register"
                                                type="checkbox"
                                                className="form-check-input"
                                                role="switch"
                                                checked={formData.allow_register}
                                                onChange={(event) =>
                                                    handleChange(
                                                        "allow_register",
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            disabled={saving}
                                            onClick={handleCloseModal}
                                        >
                                            Batal
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-dark"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-floppy me-2" />
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </>
        </>
    );
}


const OAUTH_PROVIDER_GUIDES = {
    google: {
        title: "Google Cloud Console",
        description:
            "Buka Google Auth Platform, pilih Clients, lalu buat atau pilih OAuth Client ID. Untuk aplikasi web, konfigurasi Authorized redirect URIs sesuai URL callback backend Anda.",
        url: "https://console.cloud.google.com/auth/clients",
        linkText: "Buka pengaturan Google",
    },

    github: {
        title: "GitHub Developer Settings",
        description:
            "Buka OAuth Apps, pilih aplikasi yang sudah dibuat atau buat OAuth App baru. Periksa Client ID dan buat atau perbarui Client Secret pada pengaturan aplikasi.",
        url: "https://github.com/settings/developers",
        linkText: "Buka pengaturan GitHub",
    },


    yahoo: {
        title: "Yahoo Developer Network",
        description:
            "Masuk ke Yahoo Developer Network, buka My Apps atau buat aplikasi baru. Ambil Client ID (Consumer Key) dan Client Secret (Consumer Secret) dari aplikasi. Konfigurasikan callback domain dan izin OpenID Connect sesuai kebutuhan autentikasi.",
        url: "https://developer.yahoo.com/",
        linkText: "Buka Yahoo Developer Network",
    },

};

function OAuthProviderGuide({ provider }) {
    const guide =
        OAUTH_PROVIDER_GUIDES[provider?.toLowerCase()];

    if (!guide) {
        return (
            <div className="small text-body-secondary mt-2">
                <i className="bi bi-info-circle me-1" />
                Buka portal developer resmi penyedia OAuth ini
                untuk membuat Client ID dan Client Secret.
                Pastikan URL callback sesuai konfigurasi backend.
            </div>
        );
    }

    return (
        <>
            <p className="small text-body-secondary mb-2">
                {guide.description}
            </p>
            <p>
                <a
                    href={guide.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none"
                >
                    {guide.linkText}
                    <i className="bi bi-box-arrow-up-right ms-1" />
                </a>
            </p>
        </>
    );
}

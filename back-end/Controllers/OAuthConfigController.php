<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\OAuthConfigModel;

class OAuthConfigController extends BaseController
{
    use ResponseTrait; 
    protected $oauthConfigModel;

    public function __construct() {
        $this->oauthConfigModel = new OauthConfigModel();
    }

    public function index()
    {
        $configs = $this->oauthConfigModel->findAll();

        $safeConfigs = array_map(function ($config) {
            unset($config['client_secret']);

            return $config;
        }, $configs);

        return $this->respond($safeConfigs, 200);
    }

    public function update($id = null)
    {
        if ($id === null) {
            return $this->failValidationErrors([
                'id' => 'ID konfigurasi OAuth wajib diisi.',
            ]);
        }

        $config = $this->oauthConfigModel->find($id);

        if (!$config) {
            return $this->failNotFound(
                'Konfigurasi OAuth tidak ditemukan.'
            );
        }

        $data = $this->request->getJSON(true);

        if (!is_array($data) || empty($data)) {
            return $this->failValidationErrors(
                'Data request tidak valid.'
            );
        }

        // Hanya kolom yang diizinkan yang dapat diperbarui.
        $allowedFields = [
            'client_id',
            'client_secret',
            'allow_login',
            'allow_register',
        ];

        $data = array_intersect_key(
            $data,
            array_flip($allowedFields)
        );

        if (empty($data)) {
            return $this->failValidationErrors(
                'Tidak ada data yang dapat diperbarui.'
            );
        }

        if (!$this->oauthConfigModel->update($id, $data)) {
            return $this->failValidationErrors(
                $this->oauthConfigModel->errors()
            );
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Konfigurasi OAuth berhasil diperbarui.',
        ]);
    }
}

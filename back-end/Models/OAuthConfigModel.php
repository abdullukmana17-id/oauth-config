<?php

namespace App\Models;

use CodeIgniter\Model;

class OAuthConfigModel extends Model
{
    protected $table            = 'oauth_configs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'client_id',
        'client_secret',
        'allow_login',
        'allow_register',
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'provider'       => 'required|max_length[100]',
        'client_id'      => 'required|max_length[255]',
        'client_secret'  => 'required|max_length[255]',
        'allow_login'    => 'required|in_list[0,1]',
        'allow_register' => 'required|in_list[0,1]',
    ];
    protected $validationMessages   = [
        'provider' => [
            'required'   => 'Provider wajib diisi.',
            'max_length' => 'Provider maksimal 100 karakter.',
        ],
        'client_id' => [
            'required'   => 'Client ID wajib diisi.',
            'max_length' => 'Client ID maksimal 255 karakter.',
        ],
        'client_secret' => [
            'required'   => 'Client Secret wajib diisi.',
            'max_length' => 'Client Secret maksimal 255 karakter.',
        ],
        'allow_login' => [
            'required' => 'Status izin login wajib diisi.',
            'in_list'  => 'Status izin login harus bernilai 0 atau 1.',
        ],
        'allow_register' => [
            'required' => 'Status izin registrasi wajib diisi.',
            'in_list'  => 'Status izin registrasi harus bernilai 0 atau 1.',
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
}

<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class OAuthConfigSeeder extends Seeder
{
    public function run()
    {
        $table = $this->db->table('oauth_configs');

        $providers = [
            [
                'provider'       => 'github',
                'client_id'      => '',
                'client_secret'  => '',
                'allow_login'    => 1,
                'allow_register' => 1,
            ],
            [
                'provider'       => 'google',
                'client_id'      => '',
                'client_secret'  => '',
                'allow_login'    => 1,
                'allow_register' => 1,
            ],
            [
                'provider'       => 'yahoo',
                'client_id'      => '',
                'client_secret'  => '',
                'allow_login'    => 1,
                'allow_register' => 1,
            ],
        ];

        foreach ($providers as $provider) {
            $exists = $table
                ->where('provider', $provider['provider'])
                ->countAllResults();

            if ($exists === 0) {
                $table->insert($provider);
            }
        }
    }
}

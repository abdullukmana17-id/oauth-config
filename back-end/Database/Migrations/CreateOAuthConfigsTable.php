<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateOAuthConfigsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'provider' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'client_id' => [
                'type' => 'TEXT',
            ],
            'client_secret' => [
                'type' => 'TEXT',
            ],
            'allow_login' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],
            'allow_register' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('provider');
        $this->forge->createTable('oauth_configs');
    }

    public function down()
    {
        $this->forge->dropTable('oauth_configs');
    }
}

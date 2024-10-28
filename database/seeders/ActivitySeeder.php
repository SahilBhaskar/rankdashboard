<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (\App\Models\User::all() as $user) {
            \App\Models\Activity::factory()->count(rand(1, 5))->create([
                    'user_id' => $user->id,
            ]);
        }       
    }
}

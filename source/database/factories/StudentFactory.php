<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'first_name' => $this->faker->name(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // You can hash a default password
            'study_direction' => $this->faker->randomElement(['Informatica', 'Economie', 'Talen', 'Wetenschappen']),
            'graduation_track' => $this->faker->randomElement(['Professioneel', 'Academisch']),
            'interests' => implode(', ', $this->faker->randomElements(['AI', 'Webdev', 'Networking', 'Cybersecurity', 'IoT'], 2)),
            'job_preferences' => $this->faker->sentence(3),
            'cv' => 'cv_' . Str::random(10) . '.pdf', // Placeholder for file name
            'profile_complete' => $this->faker->boolean,
        ];
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();
        });

    Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('plan_type')->nullable();
            $table->text('description')->nullable();
            $table->text('job_types')->nullable();
            $table->text('job_domains')->nullable();
            $table->string('booth_location')->nullable();
            $table->string('photo')->nullable();
            $table->integer('speeddate_duration')->nullable();
            $table->timestamps();
        });

 Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('study_direction')->nullable();
            $table->string('graduation_track')->nullable();
            $table->text('interests')->nullable();
            $table->text('job_preferences')->nullable();
            $table->string('cv')->nullable();
            $table->boolean('profile_complete')->default(false);
            $table->timestamps();
        });

        Schema::create('admin_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->text('action');
            $table->string('target_type')->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->string('severity')->nullable();
        });

        Schema::create('connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->timestamp('timestamp')->useCurrent();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('receiver_id');
            $table->text('content');
            $table->timestamp('timestamp')->useCurrent();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('time_slot');
            $table->timestamps();
        });


    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('matches');
        Schema::dropIfExists('admin_logs');
        Schema::dropIfExists('students');
        Schema::dropIfExists('companies');
        Schema::dropIfExists('admins');
    }
};

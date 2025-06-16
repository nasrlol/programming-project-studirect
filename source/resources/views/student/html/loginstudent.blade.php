@extends('layouts.navbar') {{-- indien je een layout hebt --}}

@section('content')
<!-- Voeg link naar CSS toe -->
<link rel="stylesheet" href="{{ asset('css/loginstudent.css') }}">

<div class="login-container">
    <div class="login-box">

        <h2>Student Login</h2>

        @if (session('error'))
            <div class="alert">{{ session('error') }}</div>
        @endif

        <form method="POST" action="{{ route('student.login') }}">
            @csrf

            <label for="email">E-mail</label>
            <input type="email" name="email" id="email" placeholder="john.doe@student.ehb.be" required>

            <label for="password">Wachtwoord</label>
            <input type="password" name="password" id="password" placeholder="••••••••" required>

            <button type="submit">Log In</button>
        </form>

        <div style="text-align: center; margin-top: 1rem;">
            <a href="{{ route('student.password.request') }}">Wachtwoord vergeten?</a><br>
            <span>Nog geen account? <a href="{{ route('student.register.step1') }}">Registreer Nu</a></span>
        </div>
    </div>
</div>
@endsection

@extends('layouts.navbar')

@section('content')
<link rel="stylesheet" href="{{ asset('css/loginstudent.css') }}">

<div class="login-container">
    <div class="login-box">
        <h2>Wachtwoord vergeten</h2>

        @if (session('status'))
            <div class="alert success">{{ session('status') }}</div>
        @endif

        @if ($errors->any())
            <div class="alert danger">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('student.password.email') }}">
            @csrf

            <label for="email">E-mailadres</label>
            <input type="email" name="email" id="email" placeholder="jouwstudent@mail.com" required>

            <button type="submit">Stuur herstel-link</button>
        </form>
    </div>
</div>
@endsection

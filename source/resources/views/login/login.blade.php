<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Student Login – Studirect</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: #f4f5f7;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
        }

        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1rem;
        }

        .login-box {
            background-color: #ffffff;
            padding: 2rem 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            width: 100%;
            max-width: 450px;
        }

        .login-box h2 {
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 1.6rem;
            color: #172b4d;
        }

        form label {
            display: block;
            margin-top: 1rem;
            font-weight: 500;
            color: #091e42;
        }

        form input {
            width: 100%;
            padding: 0.7rem;
            margin-top: 0.5rem;
            border: 1px solid #dfe1e6;
            border-radius: 8px;
            font-size: 1rem;
            background-color: #f9fafc;
            transition: border 0.2s;
        }

        form input:focus {
            border-color: #0052cc;
            outline: none;
            background-color: #ffffff;
        }

        .submit-btn {
            margin-top: 2rem;
            width: 100%;
            padding: 0.8rem;
            background-color: #0052cc;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .submit-btn:hover {
            background-color: #0747a6;
        }

        .alert {
            background-color: #ffebe6;
            color: #bf2600;
            padding: 0.75rem 1rem;
            margin-top: 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
        }

        .link-group {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.9rem;
        }

        .link-group a {
            color: #0052cc;
            text-decoration: none;
        }

        .link-group a:hover {
            text-decoration: underline;
        }

        .alert.success {
            background-color: #e3fcef;
            color: #006644;
            padding: 0.75rem 1rem;
            margin-top: 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

<div class="login-container">
    <div class="login-box">

        <h2>StuDirect Login</h2>

        @if (session('status'))
            <div class="alert success">{{ session('status') }}</div>
        @endif

        @if (session('error'))
            <div class="alert">{{ session('error') }}</div>
        @endif

        @if ($errors->any())
            <div class="alert">
                <ul style="margin: 0; padding-left: 1rem;">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('login.login') }}">
            @csrf

            <label for="email">E-mail</label>
            <input type="email" name="email" id="email" value="{{ old('email') }}" placeholder="john.doe@student.ehb.be" required>

            <label for="password">Wachtwoord</label>
            <input type="password" name="password" id="password" placeholder="••••••••" required>

            <button type="submit" class="submit-btn">Log In</button>
        </form>

        <div class="link-group">
            <a href="{{ route('student.password.request') }}">Wachtwoord vergeten?</a><br>
            <span>Nog geen account? <a href="{{ route('student.register.form') }}">Registreer Nu</a></span>
        </div>
    </div>
</div>

</body>
</html>
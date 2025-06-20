<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Registratie – Stap 3</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: #f4f5f7;
            font-family: 'Segoe UI', sans-serif;
            padding: 2rem;
        }

        .container {
            max-width: 450px; 
            margin: 0 auto;
            background-color: #fff;
            padding: 2rem 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        h2 {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-top: 1rem;
            font-weight: 500;
        }

        input,
        textarea {
            width: 100%;
            padding: 0.7rem;
            margin-top: 0.5rem;
            border: 1px solid #dfe1e6;
            border-radius: 8px;
            background-color: #f9fafc;
        }

        textarea {
            resize: vertical;
        }

        .submit-btn {
            margin-top: 2rem;
            width: 100%;
            padding: 0.8rem;
            background-color: #0052cc;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        }

        .alert {
            background-color: #ffebe6;
            color: #bf2600;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Registratie – Stap 3</h2>

    @if ($errors->any())
        <div class="alert">
            <ul style="margin: 0; padding-left: 1rem;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('student.register.step3.submit') }}">
        @csrf

        <label for="job_preferences">Jobvoorkeuren</label>
        <textarea name="job_preferences" id="job_preferences" rows="4" placeholder="Bijv. webdevelopment, data-analyse">{{ old('job_preferences') }}</textarea>

        <label for="location">Voorkeurslocatie(s)</label>
        <input type="text" name="location" id="location" placeholder="Bijv. Brussel, Gent" value="{{ old('location') }}">

        <button type="submit" class="submit-btn">Registratie voltooien</button>
    </form>
</div>

</body>
</html>

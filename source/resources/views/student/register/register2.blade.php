<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Registratie – Stap 2</title>
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

        input[type="text"],
        input[type="file"] {
            width: 100%;
            padding: 0.7rem;
            margin-top: 0.5rem;
            border: 1px solid #dfe1e6;
            border-radius: 8px;
            background-color: #f9fafc;
        }

        textarea {
            width: 100%;
            padding: 0.7rem;
            margin-top: 0.5rem;
            border: 1px solid #dfe1e6;
            border-radius: 8px;
            background-color: #f9fafc;
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
    <h2>Registratie – Stap 2</h2>

    @if ($errors->any())
        <div class="alert">
            <ul style="margin: 0; padding-left: 1rem;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('student.register.step2.submit') }}" enctype="multipart/form-data">
    @csrf

    <label for="graduation_track">Afstudeertraject</label>
    <input type="text" name="graduation_track" id="graduation_track" value="{{ old('graduation_track') }}" required>

    <label for="interests">Soft skills / vaardigheden</label>
    <textarea name="interests" id="interests" rows="4" placeholder="Bijv. teamwork, communicatie, probleemoplossend vermogen">{{ old('interests') }}</textarea>

    <label for="cv">Upload je CV (optioneel)</label>
    <input type="file" name="cv" id="cv" accept=".pdf,.doc,.docx">

    <label for="linkedin">LinkedIn-profiel (optioneel)</label>
    <input type="url" name="linkedin" id="linkedin" placeholder="https://www.linkedin.com/in/jouwnaam" value="{{ old('linkedin') }}">

    <button type="submit" class="submit-btn">next step</button>
</form>

</div>

</body>
</html>

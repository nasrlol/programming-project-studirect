<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>StuDirect – CareerLaunch</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        @keyframes fade-up {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fade {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        .animate-fade-up {
            animation: fade-up 1s ease-out forwards;
        }

        .animate-fade {
            animation: fade 1.2s ease-out forwards;
        }

        .delay-300 {
            animation-delay: 0.3s;
        }

        .delay-500 {
            animation-delay: 0.5s;
        }
    </style>
</head>

<body class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center justify-center text-gray-800">

    <header class="w-full max-w-5xl px-6 text-center animate-fade-up">
        <p class="text-4xl font-extrabold text-blue-600 mb-2">Welkom bij</p>

        <img src="{{ asset('images/studirect.png') }}" alt="StuDirect Logo" class="h-64 mx-auto mb-4">

        <h1 class="text-4xl font-extrabold text-blue-700 mb-6 -mt-6">CareerLaunch Platform</h1>

        <p class="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            <strong>StuDirect</strong> is het officiële platform van de <strong>Erasmushogeschool Brussel</strong>
            waar studenten bedrijven leren kennen, stageplekken vinden en hun loopbaan vormgeven.
        </p>
    </header>

    <section class="mt-10 animate-fade-up delay-300">
        <a href="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition duration-300">
            Log in
        </a>
    </section>

    <footer class="mt-16 text-sm text-gray-500 animate-fade delay-500">
        © {{ date('Y') }} StuDirect – Erasmushogeschool Brussel
    </footer>

</body>
</html>
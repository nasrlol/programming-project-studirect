<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StuDirect</title>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">
    @vite ('resources/css/student/student.css')
</head>
<body>
    @include('student.layouts.navbar')

    <main class="container">
        @yield('content')
    </main>

    @vite ('resources/js/student/student.js')
</body>
</html>

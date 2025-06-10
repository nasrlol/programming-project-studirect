<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StuDirect</title>
    @vite ('resources/css/student/student.css')
</head>
<body>
    <main>
        <section id="sidebar">
            <header>
                <div class="header">
                    <div class="pfp">
                    </div>
                    <h1>
                        {{ \Illuminate\Support\Str::limit($students[0]['first_name'] ?? 'Gebruiker', 20) }}
                    </h1>
                </div>
                <nav>
                    <ul>
                        <li><a id="match">Matches</a></li>
                        <li><a id="message">Berichten</a></li>
                        <li><a id="calendar">Kalender</a></li>
                    </ul>
                </nav>
            </header>
                <div id="sidebar-content"></div>
            </section>
        <section id="screen">
            <div id="screen-content"></div>
        </section>
    </main>
    @vite ('resources/js/student/student.js')
</body>
</html>

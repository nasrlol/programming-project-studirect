<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StuDirect</title>
    @vite ['resources/css/student/student.css', 'resources/js/student/student.js']
</head>
<body>
    <main>
        <section id="sidebar">
            <header>
                <h1>StuDirect</h1>
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
</body>
</html>
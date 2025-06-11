<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Main scherm</title>
    @vite('resources/css/company/company.css')
</head>

<body>

    <header id="header">
        <div class="left">
            <img id="logo" src="public/images/studirect.png" alt="studirect logo">
        </div>
        <div class="center"> <button id="homeBtn">home page</button>
            <button id="messageBtn">messages</button>
            <button id="calendarBtn">calendar</button>
        </div>
        <div class="right">
            <button>settings</button>
        </div>
    </header>

    <main id="content">


    </main>
     @vite('resources/js/company/company.js')
</body>

</html>

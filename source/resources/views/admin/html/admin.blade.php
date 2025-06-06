<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite('resources/css/admin/admin.css')
    <title>document</title>
</head>
<body>
    <nav id="navigation">
        Admin<br>
        <button class="btn-nav" id="dashboard">Dashboard</button>
        <button class="btn-nav" id="users">Gebruikers</button>
        <button class="btn-nav" id="companies">Bedrijven</button>
        <button class="btn-nav" id="logs">Logs</button>
    </nav>
    @vite('resources/js/admin/adminVars.js')
    @vite('resources/js/admin/adminText.js')
    @vite('resources/js/admin/admin.js')
</body>
</html>
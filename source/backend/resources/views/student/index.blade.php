<!DOCTYPE html> 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Index</title>
</head>
<body>
    <h1>Student List</h1>
    <ul>
        @foreach ($students as $student)
            <li>{{ $student->study_direction }} ({{ $student->email }})</li>
        @endforeach
    </ul>

    <p>hallo</p>
</body>
</html>


{{--je kan hier php in typen maar niet de bedoeling. Alles in controller. Als je echo doet mag je niet in gw php want is niet zuiver.--}}
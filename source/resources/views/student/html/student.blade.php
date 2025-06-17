<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>StuDirect</title>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">
    @vite ('resources/css/student/student.css')
</head>
<body>
    @include('student.layouts.navbar')
<main class:"container">
    @include('student.layouts.settings')

    <div id="home-content" class="content-container">
        <section class="sectionType1">
                @include('student.layouts.notification', [
                'notification' => "<p> Je hebt 3 berichten ontvangen van {$companies[0]['name']}.</p>"
            ])
        </section>
        <section class="sectionType1">
            @include('student.layouts.companyswipe', [
                'company_name' => $companies[0]['name'],
                'job_title' => 'IT Support Intern',
                'company_logo' => $companies[0]['photo'] ?? ''
            ])
        </section>
        <section class="sectionType1">
            @include('student.layouts.companyinfo', ['
                <ul>',
                    'job_domain' => '<li>' . $companies[0]['job_domain'] . '</li>',
                    'job_type' => '<li>' . $companies[0]['job_types'] . '</li>',
                    'job_description' => '<li>' . $companies[0]['job_description'] . '</li>
                </ul>',
                'job_requirements' => '<ul><li>' . $companies[0]['job_requirements'] . '</li></ul>',
                'description' => '<p>' . $companies[0]['description'] . '</p>'
            ])
        </section>
    </div>

    <div id="matches-content" class="content-container">
        <section class="sectionType1">
            <h2>Matches</h2>
            <div id="message-list">
                @foreach($companies as $company)
                    @include('student.layouts.messageList', [
                        'photo' => $company['photo'] ?? '',
                        'name' => $company['name'],
                        'id' => $company['id'],
                    ])
                @endforeach
            </div>
        </section>
        <section class="sectionType2" id="chat-section">
            <div class="empty-chat-container active">
                <div id="empty-chat-message">
                    <h2>Je chatberichten</h2>
                    <p>Selecteer een bedrijf om te chatten</p>
                </div>
            </div>
            <div class="chat-container">
                @include('student.layouts.chat', [
                    'student_id' => $student['id'],
                    'company_id' => $companies[0]['id'],
                ])
            </div>
        </section>
    </div>

    <div id="calendar-content" class:"content-container">
    </div>

</main>
@vite ('resources/js/student/student.js')
@vite ('resources/js/student/chat.js')
</body>
</html>

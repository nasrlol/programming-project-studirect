<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>StuDirect</title>
    @vite ('resources/css/student/student.css')
</head>
<body>
    @if (session('api_token')) 
    <script>
        localStorage.setItem('token', "{{ $token }}")
        localStorage.setItem('user_type', 'student')
    </script>
    @endif
    @include('student.layouts.navbar')
<main class:"container">
    @include('student.layouts.settings')

    <div id="home-content" class="content-container">
        <section class="sectionType1">
                @include('student.layouts.welcome')
        </section>
        <section class="sectionType1" id="company-swipe-section">
            @include('student.layouts.companyswipe', [
                'company_name' => 'Loading...',
                'job_title' => 'Loading...',
                'company_logo' => ''
            ])
        </section>
        <section class="sectionType1" id="company-info-section">
            @include('student.layouts.companyinfo', [
                'job_domain' => 'Loading...',
                'job_type' => 'Loading...',
                'job_description' => 'Loading...',
                'job_requirements' => 'Loading...',
                'description' => 'Loading...'
            ])
        </section>
    </div>

    <div id="matches-content" class="content-container">
        <section class="sectionType1">
            <h2>Matches</h2>
            <div id="message-list">
                @if(count($likedCompanies) > 0)
                    @foreach($likedCompanies as $company)
                        @include('student.layouts.messageList', [
                            'photo' => $company['photo'] ?? '',
                            'name' => $company['name'],
                            'id' => $company['id'],
                        ])
                    @endforeach
                @else
                    <div class="no-matches-message">
                        <p>Je hebt nog geen bedrijven geliked. Ga naar Home om bedrijven te bekijken en te liken!</p>
                    </div>
                @endif
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
                @if(count($likedCompanies) > 0)
                    @include('student.layouts.chat', [
                        'student_id' => $student['id'],
                        'company_id' => $likedCompanies[0]['id'],
                    ])
                @else
                    <div class="no-chat-available">
                        <p>Geen bedrijven beschikbaar voor chat.</p>
                    </div>
                @endif
                ])
            </div>
        </section>
    </div>


    <div id="calendar-content" class:"content-container">
    </div>

</main>
<script>
    // Pass companies data to JavaScript
    window.companiesData = @json($companies);
    window.studentId = @json($student['id']);
</script>
@vite ('resources/js/student/student.js')
@vite ('resources/js/student/chat.js')
</body>
</html>

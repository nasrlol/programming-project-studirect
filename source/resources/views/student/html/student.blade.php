<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>StuDirect</title>
    @vite ('resources/css/student/student.css')

    @vite ('resources/css/company/company.css')
</head>
<body>
    @if (session('api_token'))
    <script>
        localStorage.setItem('token', "{{ $token }}")
        localStorage.setItem('user_type', 'student')
    </script>
    @endif

    @include('student.layouts.navbar')
<main class="container">
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
        <section class="sectionType2" id="company-info-section-matches">
            <div class="empty-company-info-container active">
                <div id="empty-company-info-message">
                    <h2>Bedrijfinformatie</h2>
                    <p>Selecteer een bedrijf om informatie te bekijken</p>
                </div>
            </div>
            <div class="company-info-container">
                <div class="company-info-header">
                    <div id="selected-company-title">
                        <h2 id="selected-company-name">Bedrijfsnaam</h2>
                        <p id="selected-company-job">Functietitel</p>
                    </div>
                    <div class="company-action-buttons">
                        <button id="appointment-button" class="appointment-btn">Afspraak boeken</button>
                        <button id="message-button" class="message-btn">Berichten</button>
                    </div>
                </div>
                <div id="selected-company-logo">
                    <img src="{{ asset('images/image-placeholder.png') }}"
                         alt="Company Logo"
                         id="selected-company-image"
                         onerror="this.src='{{ asset('images/image-placeholder.png') }}'">
                </div>
                <div id="selected-company-info">
                    <div>
                        <h5>Omschrijving</h5>
                        <ul>
                            <li id="selected-job-domain">Geen jobdomein opgegeven.</li>
                            <li id="selected-job-type">Geen functietype opgegeven.</li>
                            <li id="selected-job-description">Geen omschrijving beschikbaar.</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Vereisten</h5>
                        <ul>
                            <li id="selected-job-requirements">Geen vereisten opgegeven.</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Over dit bedrijf</h5>
                        <p id="selected-company-description">Er is geen informatie beschikbaar over dit bedrijf.</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="sectionType2" id="chat-section">
            <div class="chat-header-with-back">
                <button id="back-to-company-info" class="back-btn">← Terug</button>
                <h2 id="chat-company-name">Chat</h2>
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
            </div>
        </section>
    </div>

    <div id="calendar-content" class="content-container">
        @include('student.layouts.calendar')
    </div>

    <!-- Appointment Booking Popup -->
    <div id="appointment-popup" class="appointment-popup">
        <div class="appointment-popup-content">
            <div class="appointment-header">
                <h2 id="appointment-company-name">Afspraak boeken</h2>
                <button id="close-appointment-popup" class="close-popup-btn">&times;</button>
            </div>
            <div class="appointment-body">
                <div id="appointment-loading" class="loading-state">
                    <p>Beschikbare tijden laden...</p>
                </div>
                <div id="appointment-calendar" class="appointment-calendar" style="display: none;">
                    <div class="daily-calendar">
                        <table class="calendar-table">
                            <thead>
                                <tr>
                                    <th class="time-column">Tijd</th>
                                    <th class="appointment-column">Beschikbare slots</th>
                                </tr>
                            </thead>
                            <tbody id="appointment-time-slots">
                                <!-- Time slots will be generated by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="appointment-error" class="error-state" style="display: none;">
                    <p>Er zijn geen beschikbare tijden voor dit bedrijf.</p>
                </div>
            </div>
            <div class="appointment-footer">
                <button id="book-appointment" class="book-btn" style="display: none;">Afspraak bevestigen</button>
                <button id="cancel-appointment" class="cancel-btn">Annuleren</button>
            </div>
        </div>
    </div>
</main>
<script>
    if (!localStorage.getItem('token')) {
        location.href='/'
    }
</script>
<script>
    // Pass companies data to JavaScript
    window.companiesData = @json($companies);
    window.studentId = @json($student['id']);
    window.likedCompanies = @json($likedCompanies ?? []);
</script>
@vite ('resources/js/student/student.js')
@vite ('resources/js/student/chat.js')
@vite ('resources/js/student/calendar.js')
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>StuDirect - Company</title>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">
    @vite ('resources/css/company/company.css')
</head>
<body>
    @include('company.layouts.navbar')

    <main class="container">
        @include('company.layouts.settings')

        <div id="home-content" class="content-container">
            <section class="sectionType1">
                @include('company.layouts.notification', [
                    'notification' => "Welkom " . ($company['name'] ?? 'Company') . "! U hebt toegang tot alle functionaliteiten van het CareerLaunch platform."
                ])
            </section>
            <section class="sectionType1" id="map-fix">
                @include('company.layouts.map')
            </section>
        </div>

        <div id="messages-content" class="content-container">
            <section class="sectionType1">
                <h2>Messages</h2>
                @include('company.layouts.studentList', [
                    'students' => $students ?? []
                ])
            </section>
            <section class="sectionType2" id="chat-section">
                <div class="empty-chat-container active">
                    <div id="empty-chat-message">
                        <h2>Je chatberichten</h2>
                        <p>Selecteer een student om te chatten</p>
                    </div>
                </div>
                <div class="chat-container">
                    @include('company.layouts.chat', [
                        'company' => $company,
                        'connections' => $connections ?? []
                    ])
                </div>
            </section>
        </div>

        <div id="calendar-content" class="content-container">
            <section class="sectionType1">
                @include('company.layouts.appointmentList', [
                    'appointments' => $appointments ?? []
                ])
            </section>
            <section class="sectionType2">
                @include('company.layouts.calendarTable', [
                    'appointments' => $appointments ?? []
                ])
            </section>
        </div>

    </main>
    @vite ('resources/js/company/company.js')
    @vite ('resources/js/company/chat.js')
</body>
</html>

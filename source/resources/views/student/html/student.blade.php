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
<main class:"container">
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
            @include('student.layouts.companyinfo', [
                'company_description' => '
                    <ul>
                        <li>Gent, Oost-Vlaanderen</li>
                        <li>Stage</li>
                        <li>februari - juni 2025 (duur tijd bespreekbaar)</li>
                        <li>Loon: n/a</li>
                        <li>Fulltime positie</li>
                        <li>Flexibele uren</li>
                        <li>Jonge, dynamische werkomgeving</li>
                    </ul>',
                'company_requirements' => '
                    <ul>
                        <li>Bachelor Toegepaste Informatica / Graduaat Systeem- en Netwerkbeheer</li>
                        <li>Goede communicatieve vaardigheden</li>
                        <li>Probleemoplossend denken</li>
                        <li>Teamplayer mentaliteit</li>
                        <li>Basiskennis netwerken</li>
                        <li>Kennis van Windows Server en Active Directory is een plus</li>
                        <li>Rijbewijs B</li>
                    </ul>',
                'company_about' => '
                    <p>ByteForge Solutions is een groeiend softwarebedrijf gespecialiseerd in maatwerkapplicaties voor KMOs. Met een klein maar gedreven team bouwen we weboplossingen, automatisering en business intelligence tools op maat van onze klanten.</p>
                    <p>We geloven sterk in persoonlijke groei en bieden onze medewerkers veel ruimte voor ontwikkeling en innovatie. Onze moderne kantoren in het hart van Gent zijn uitgerust met de nieuwste technologieën.</p>
                    <p>Als stagiair(e) word je vanaf dag één beschouwd als volwaardig teamlid en krijg je de kans om mee te werken aan uitdagende projecten voor echte klanten.</p>'
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
</body>
</html>

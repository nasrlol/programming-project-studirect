@extends('student.layouts.app')

@section('content')
    <section class="sectionType1">
        @include('student.layouts.notification', [
            'notification' => "<p> Je hebt 3 berichten ontvangen van Biteforge Solutions.</p>"
        ])
    </section>
    <section class="sectionType1">
        @include('student.layouts.companyswipe', [
            'company_name' => 'Biteforge Solutions',
            'job_title' => 'IT Support Intern',
            'company_logo' => ''
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
@endsection

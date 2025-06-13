<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite('resources/css/admin/admin.css')
    <title>document</title>
</head>
<body>
    <span id='serverResponse'>
    @if ( session('error'))
        {{ session('error') }}
    @elseif ( session('success'))
        {{ session('success') }}
    
    @endif
    </span>
    <div id='main-container'>
        <nav id="navigation">
            <span class='info-nav nav-element'>Admin</span><br>
            <button class="btn-nav nav-element" id="nav-dashboard">Dashboard</button>
            <button class="btn-nav nav-element" id="nav-users">Gebruikers</button>
            <button class="btn-nav nav-element" id="nav-companies">Bedrijven</button>
            <button class="btn-nav nav-element" id="nav-appointments">Afspraken</button>
            <button class="btn-nav nav-element" id="nav-logs">Logs</button>
        </nav>

        <div id='result-container'>
            <section id='dashboard'>
                <h2>Dashboard</h2>
                <div class='member-amount'>
                    <div class='amount-section'>
                        <div class='section-inside'>
                            <span id='student-amount'></span><br>
                            <span>students</span>
                        </div>
                    </div>
                    <div class='amount-section'>
                        <div class='section-inside'>
                            <span id='company-amount'></span><br>
                            <span>bedrijven</span>    
                        </div>
                    </div>
                    <div class='amount-section'>
                        <div class='section-inside'>
                            <span id='appointment-amount'></span><br>
                            <span>afspraken</span>    
                        </div>
                    </div>
                </div>
            </section>

            <section id='students' class='searchable'>
                <h2>Gebruikers</h2>
                <button class='.add' id='toAddStudent'>Student toevoegen</button>
                <div class='filter' id='student'></div>
                <div class='list'>
                    <table id='studentTable'>
                        <tr><th>Naam</th><th>Email</th><th>Laatste login</th><th>Acties</th></tr>
                        <!--API call-->
                        <!--Last log still needs to be added-->
                        @foreach ($students as $student)
                        <tr>
                            <!--| is added at the end to make sure no accidents occur (like 2 and 21 while filtering)-->
                            <td class='studentId'>{{$student['id']}}</td>
                            <td class='studentName' id="s{{$student['id']}}|">{{ $student['first_name'] ?? 'Onbekend' }} {{ $student['last_name'] ?? 'onbekend' }}</td>
                            <td class='studentMail'>{{ $student['email'] ?? 'Geen email' }}</td>
                            <td class='studentLogin'>03-06-2025</td>
                            <td>
                                <span>
                                    <img class='moreInfo extraActions studentEye' id="eyeS{{$student['id']}}" src='../images/eyeball.png'>
                                </span>  <span>
                                    <img class='extraActions delete' id="delS{{$student['id']}}" src='../images/delete.png'>
                                </span>
                            </td>
                            <!--Hidden info used by javascript-->
                            <td class='hidden activated'>{{$student['profile_complete']}}</td>
                            <td class='hidden study-direction'>
                                {{$student['study_direction']}}
                            </td>
                            <td class='hidden interests'>
                                {{$student['interests']}}
                            </td>
                            <td class='hidden job-preferences'>
                                {{$student['job_preferences']}}
                            </td>
                        </tr>
                        @endforeach
                    </table>
                </div>
            </section>

            <section id='addStudent'>
                <button id='backToStudent'>Terug</button>
                <h2>Student toevoegen</h2>
                <div class='addUser'>
                    <h2>Student gegevens</h2>
                    <!-- Action to add a company must be added-->
                    <form method='post' action="{{ route('students.create') }}">
                        @csrf <!-- CSRF token for security (concept genomen via Github Copilot)-->
                        <input class='addInput' type='text'name='first_name' placeholder='Voornaam'>
                        <input class='addInput' type='text'name='last_name' placeholder='Achternaam'>
                        <input class='addInput' type='text' name='email' placeholder='E-mail'>
                        <div class='addInput' style='border: solid; border-width:1px'>
                            <label for='graduation_track'>Type diploma</label>
                            <select name='graduation_track' class='professional'>
                                <option value='Associate'>Graduaat</option>
                                <option value='Professional'>Professionele bachelor</option>
                                <option value='Academic_bachelor'>Academische bachelor</option>
                                <option value='Academic_master'>Academische Master</option>
                            </select>
                        </div>

                        <input class='addInput' type='text' name='study_direction' placeholder='Studierichting'>

                        <input class='addInput' type='password' name='password1' placeholder='Wachtwoord'>
                        <input class='addInput' type='password' name='password2' placeholder='Bevestig wachtwoord'>
                        <!--Responses for wrong inputs will be put here--> 
                        <div id='formResponse'></div>
                        <input type='submit' value='opslaan'>
                    </form>
                </div>
            </section>

            <section id='companies' class='searchable'>
                <h2>Bedrijven</h2>
                <button class='.add' id='toAddCompany'>Bedrijf toevoegen</button>
                <div class='searchContainer list'>
                    <div class='filter' id='company'></div>
                        <table id='companyTable'> 
                            <tr><th>Naam</th><th>Email</th><th>Laatste login</th><th>Acties</th></tr>
                            @foreach ($companies as $company)
                            <tr>
                                <td class='hidden companyId'>{{$company['id']}}</td>
                                <td class='companyName' id="c{{$company['id']}}|">{{ $company['name'] ?? 'Onbekend' }}</td>
                                <td class='companyMail'>{{ $company['email'] ?? 'Onbekend' }}</td>
                                <td class='companyLogin'>02-04-2025</td>
                                <td>
                                <span>
                                    <img class='extraActions moreInfo' id="eyeC{{$company['id']}}" src='../images/eyeball.png'>
                                </span>  
                                <span>
                                    <img class='extraActions delete' id="delC{{$company['id']}}" src='../images/delete.png'>
                                </span>
                                </td>
                                <!--Hidden info used by javascript-->
                                <td class='hidden plan-type'>
                                    {{$company['plan_type']}}
                                </td>
                                <td class='hidden job-types'>
                                    {{$company['job_types']}}
                                </td>
                                <td class='hidden job-domain'>
                                    {{$company['job_domain']}}
                                </td>
                                <td class='hidden description'>
                                    {{$company['description']}}
                                </td>
                                <td class='hidden booth-location'>
                                    {{$company['booth_location']}}
                                </td>
                                <td class='hidden speeddate-duration'>
                                    {{$company['speeddate_duration']}}
                                </td>
                            </tr>
                            @endforeach
                        </table>
                </div>
            </section>


            <section id='addCompany'>
                <button id='backToCompanies'>Terug</button>
                <h2>Bedrijf toevoegen</h2>
                <div class='addUser'>
                    <h2>Bedrijf gegevens</h2>
                    <!-- Action to add a company must be added-->
                    <form method='post' action="{{ route('companies.create') }}">
                        @csrf <!-- CSRF token for security -->
                        <input class='addInput' type='text' name='name' placeholder='Naam'>
                        <input class='addInput' type='text' name='email' placeholder='E-mail'>
                        <div class='addInput' style='border: solid; border-width:1px'>
                            <label for='plan_type'>Prijs plan</label>
                            <select name='plan_type'>
                                <option value='Basic'>Basic</option>
                                <option value='Standard'>Standaard</option>
                                <option value='Premium'>Premium</option>
                            </select>
                        </div>
                        <input class='addInput' type='text' name='booth_location' placeholder='Locatie booth'>
                        <input class='addInput' type='password' name='password1' placeholder='Wachtwoord'>
                        <input class='addInput' type='password' name='password2' placeholder='Bevestig wachtwoord'>
                        <!--Responses for wrong inputs will be put here--> 
                        <div id='formResponse'></div>
                        <input type='submit' value='opslaan'>
                    </form>
                </div>
            </section>

            <section id='logs' class='searchable'>
                <h2>Logs</h2>
                <div id='events'>
                    <div>
                        <input type='text' placeholder='Zoek...'>
                        <label for='dateSearch'>Datum </label>
                        <select id='dateSearch' style='border:none;'>
                            <!--Data will be based depending on logs data-->
                        </select>
                        <button>Exporteren</button>
                    </div>
                </div>
                <div class='list'>
                    <ul id='companyLogs'>
                        @foreach ($companies as $company)
                        @php
                            #php code for company
                            $year = substr($company['created_at'], 0, 4);
                            $month = substr($company['created_at'], 5, 2);
                            $day = substr($company['created_at'], 8, 2);

                            $time = substr($company['created_at'], 11, 5);
                            $date = $day . "/" . $month . "/" . $year;
                        @endphp
                            <li><div class='creationLogRes'>Bedrijf {{$company['name']}} heeft een account aangemaakt</div><div class='creationLogDate'>{{$date}}, {{$time}}</div></li>
                        @endforeach 

                        @foreach ($students as $student)
                        @php
                            #php code for company
                            $year = substr($student['created_at'], 0, 4);
                            $month = substr($student['created_at'], 5, 2);
                            $day = substr($student['created_at'], 8, 2);

                            $time = substr($student['created_at'], 11, 5);
                            $date = $day . "/" . $month . "/" . $year;
                        @endphp
                            <li><div class='creationLogRes'>Student {{$student['first_name']}} {{$student['last_name']}} heeft een account aangemaakt</div><div class='creationLogDate'>{{$date}}, {{$time}}</div></li>
                        @endforeach 
                    </ul>
                </div>
            </section>
            <section id='appointments'> 
                <table id='appointmentInfo'>
                    <tr><th>Student</th><th>Bedrijf</th><th>Tijdslot</th></tr>
                    @foreach ($appointments as $appointment)
                        <tr class='apointmentList t{{substr(str_replace(':', '-',$appointment['time_slot']), 0, 5)}}'>
                            <td class='hidden appointmentId'>{{$appointment['id']}}</td>
                            <td class='appointmentSId'>{{$appointment['student_id']}}</td>
                            <td class='appointmentCId'>{{$appointment['company_id']}}</td>
                            <td class='appointmentTime'>
                                {{$appointment['time_slot']}}
                            </td>
                        </tr>
                    @endforeach
                    </div>
                </table>
            </section>
        </div>
    </div>

    <div id='extra-container'>
        <div id='extra-message-container'>
            <button id='removePopupButton' class='normalForm'>&times;</button>
            <div id='extra-message'>Found me!</div>
            <button id='abortDelete' class='deletionForm'>Nee</button>
            <form id='deletionForm' class='deletionForm' method='POST'>
                @csrf
                @method('DELETE')
                <input type='submit' value='Ja, ik ben zeker'>
            </form>
        </div>
    </div>
    @vite('resources/js/admin/admin.js')
    @vite('resources/js/admin/adminEvents.js')
</body>
</html>
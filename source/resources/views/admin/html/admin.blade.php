<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite('resources/css/admin/admin.css')
    <title>document</title>
</head>
<body>
    <div id='main-container'>
        <nav id="navigation">
            Admin<br>
            <button class="btn-nav" id="nav-dashboard">Dashboard</button>
            <button class="btn-nav" id="nav-users">Gebruikers</button>
            <button class="btn-nav" id="nav-companies">Bedrijven</button>
            <button class="btn-nav" id="nav-logs">Logs</button>
        </nav>

        <section id='result-container'>
            <section id='dashboard'>
                <h2>Dashboard</h2>
                <div class='member-amount'>
                    <section class='amount-section'>
                        <span id='student-amount'></span><br>
                        <span>students</span>
                    </section>
                    <section class='amount-section'>
                        <span id='company-amount'></span><br>
                        bedrijven    
                    </section>
                </div>
            </section>

            <section id='students' style='display=none;'>
                <h2>Gebruikers</h2>
                <div class='filter' id='student'></div>
                <table id='studentTable'>
                    <tr><th>naam</th><th>email</th><th>laatste login</th><th>Acties</th></tr>
                    <!--API call-->
                    <!--Last log still needs to be added-->
                    @foreach ($students as $student)
                        <tr>
                            <td class='studentName'>{{ $student['first_name'] ?? 'Onbekend' }} {{ $student['last_name'] ?? 'onbekend' }}</td>
                            <td class='studentMail'>{{ $student['email'] ?? 'Geen email' }}</td>
                            <td class='studentLogin'>03-06-2025</td>
                            <td>eye||delete</td>
                        </tr>
                    @endforeach
                    
                </table>
            </section>

            <section id='companies' style="display=none;">
                <h2>Bedrijven</h2>
                <button id='toAddCompany' class='btn-nav'>Bedrijf toevoegen</button>
                <div class='filter' id='bedrijf'></div>
                <table id='companyTable'>
                    <tr><th>naam</th><th>email</th><th>laatste login</th><th>Acties</th></tr>
                    @foreach ($companies as $company)
                        <tr class='companyValue'>
                            <td class='companyName'>{{ $company['name'] ?? 'Onbekend' }}</td>
                            <td class='companyMail'>{{ $company['email'] ?? 'Onbekend' }}</td>
                            <td class='companyLogin'>02-04-2025</td>
                            <td>eye||delete</td>
                        </tr>
                    @endforeach
                </table>
            </section>

            <section id='addCompany' style='display=none;'>
                <button id='backToCompanies' class='btn-nav'>Terug</button>
                <h2>Bedrijf toevoegen</h2>
                <div class='addCompany'>
                    <h2>Bedrijf gegevens</h2>
                    <!-- Action to add a company must be added-->
                    <form>
                        <input type='text' id='name' name='name' placeholder='Naam'><br>
                        <input type='text' id='mail' name='mail' placeholder='E-mail'>
                        <input type='password' id='password1' name='password1' placeholder='Wachtwoord'>
                        <input type='password' id='password2' name='password2' placeholder='Bevestig wachtwoord'>
                        <!--Responses for wrong inputs will be put here--> 
                        <div id='formResponse'></div>
                        <input type='submit' value='opslaan'>
                    </form>
                </div>
            </section>
        </section>
    </div>
    @vite('resources/js/admin/adminText.js')
    @vite('resources/js/admin/admin.js')
</body>
</html>
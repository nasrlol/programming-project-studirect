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
                    <!-- Table is to be generated using API, currently test data-->
                     <tr class='studentValue'>
                        <td class='studentName'>Steven Deloof</td>
                        <td class='studentMail'>steven.deloof@student.ehb.be</td>
                        <td class='studentLogin'>03-06-2025</td>
                        <td>eye||delete</td>
                     </tr>
                     <tr class='studentValue'>
                        <td class='studentName'>Livia Deloof</td>
                        <td class='studentMail'>livia.deloof@student.ehb.be</td>
                        <td class='studentLogin'>01-06-2025</td>
                        <td>eye||delete</td>
                     </tr>
                     <tr class='studentValue'>
                        <td class='studentName'>Marc Deloof</td>
                        <td class='studentMail'>marc.deloof@student.ehb.be</td>
                        <td class='studentLogin'>31-05-2025</td>
                        <td>eye||delete</td>
                     </tr>
                </table>
            </section>

            <section id='companies' style="display=none;">
                <h2>Bedrijven</h2>
                <button id='toAddCompany' class='btn-nav'>Bedrijf toevoegen</button>
                <div class='filter' id='bedrijf'></div>
                <table id='companyTable'>
                    <tr><th>naam</th><th>email</th><th>laatste login</th><th>Acties</th></tr>
                    <!-- Table is to be generated using API, currently test data-->
                    <tr class='companyValue'>
                        <td class='companyName'>IT Solutions</td>
                        <td class='companyMail'>support@ITSolutions.com</td>
                        <td class='companyLogin'>02-04-2025</td>
                        <td>eye||delete</td>
                    </tr>
                    <tr class='companyValue'>
                        <td class='companyName'>IT Helper</td>
                        <td class='companyMail'>support@ITHelper.com</td>
                        <td class='companyLogin'>10-04-2025</td>
                        <td>eye||delete</td>
                    </tr>
                    <tr class='companyValue'>
                        <td class='companyName'>Security Solutions</td>
                        <td class='companyMail'>support@SecuritySolutions.com</td>
                        <td class='companyLogin'>02-01-2025</td>
                        <td>eye||delete</td>
                    </tr>
                    <tr class='companyValue'>
                        <td class='companyName'>Security Fight</td>
                        <td class='companyMail'>contact@SecurityFight.com</td>
                        <td class='companyLogin'>01-06-2025</td>
                        <td>eye||delete</td>
                    </tr>
                    <tr class='companyValue'>
                        <td class='companyName'>Business Helper</td>
                        <td class='companyMail'>contact@BusinessHelper.com</td>
                        <td class='companyLogin'>31-05-2025</td>
                        <td>eye||delete</td>
                    </tr>
                    <tr class='companyValue'>
                        <td class='companyName'>Business Solutions</td>
                        <td class='companyMail'>contact@BusinessSolutions.com</td>
                        <td class='companyLogin'>26-02-2025</td>
                        <td>eye||delete</td>
                    </tr>
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
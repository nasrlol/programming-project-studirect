function dashboard (element)  {
    const dashboard = document.createElement('div')
    dashboard.innerHTML += "<div>Dashboard</div>"
    const feedback = document.createElement('div')
    feedback.classList = "member-amount"

    const studenten = document.createElement('div')
    /*student amount from backend*/studenten.innerHTML = "42<br>"
    studenten.innerHTML += 'studenten'
    feedback.appendChild(studenten)

    const bedrijven = document.createElement('div')
    /*bedrijven amount from backend*/bedrijven.innerHTML = "21<br>"
    bedrijven.innerHTML += "bedrijven";
    feedback.appendChild(bedrijven)

    dashboard.appendChild(feedback)
    element.innerHTML = dashboard.innerHTML;
}

function gebruikers (element) {
    element.innerHTML = ""
    const gebruiker = document.createElement('div')
    gebruiker.innerHTML = "<div>Gebruikers</div>"

    const search = createSearch();
    gebruiker.appendChild(search)

    //TestData, to be removed
    const test = [
        {name: "Steven Deloof", mail: "steven.deloof@student.ehb.be", login:"03-06-2025"},
        {name: "Livia Deloof", mail: "Livia.deloof@student.ehb.be", login:"01-06-2025"},
        {name: "Marc Deloof", mail: "Marc.deloof@ehb.be", login:"31-05-2025"}
    ]
    //end TestData
    gebruiker.appendChild(createTable(test))
    element.appendChild(gebruiker)
}

function bedrijven (element) {
    element.innerHTML = ""
    const bedrijf = document.createElement('div')
    bedrijf.innerHTML = "<div>Bedrijven</div>"

    //Line which will take the admin to a form to add a new company
    const create = document.createElement('button')
    create.innerHTML = "Bedrijf toevoegen "
    create.classList = "btn-nav"
    create.addEventListener("click", () => {addBedrijf(element)})
    bedrijf.appendChild(create)
    bedrijf.appendChild(createSearch())

    //TestData, to be removed
    const test = [
        {name: "IT Solutions", mail: "support@ITSolutions.com", login:"02-04-2025"},
        {name: "Security Fight", mail: "contact@SecurityFight.com", login:"01-06-2025"},
        {name: "Business Helper", mail: "helper@Business.com", login:"31-05-2025"}
    ]
    //end TestData
    bedrijf.appendChild(createTable(test))

    element.appendChild(bedrijf)
}

function addBedrijf (element) {
    element.innerHTML = ""
    //button to go back to previous screen
    const back = document.createElement('button')
    back.innerHTML = "Terug"
    back.classList = "btn-nav"
    back.addEventListener('click', () => bedrijven(element))
    element.appendChild(back)
    //Form to add a company
    element.innerHTML += "<h2>Bedrijf toevoegen</h2>"
    const formContainer = document.createElement('div')
    formContainer.classList = "addCompany"

    formContainer.innerHTML = "<h2>Bedrijf gegevens</h2>"
    const AddForm = document.createElement('form')
    //temporary action. Must be replaced with file that adds the company
    AddForm.action = "./admin.html"

    let input = document.createElement('input')
    input.type = "text"
    input.id = "name"
    input.name = "name"
    input.placeholder = "Naam"
    AddForm.appendChild(input);

    input = document.createElement('input')
    input.type = "text"
    input.id = "mail"
    input.name = "mail"
    input.placeholder = "E-mail"
    AddForm.appendChild(input);

    input = document.createElement('input')
    input.type = "password"
    input.id = "password1"
    input.name = "password1"
    input.placeholder = "Wachtwoord"
    AddForm.appendChild(input);

    input = document.createElement('input')
    input.type = "password"
    input.id = "password2"
    input.name = "password2"
    input.placeholder = "Bevestig wachtwoord"
    AddForm.appendChild(input);

    input = document.createElement('input')
    input.type = "submit"
    input.value = "Opslaan"
    AddForm.appendChild(input);

    formContainer.appendChild(AddForm);

    element.appendChild(formContainer)
}
function createSearch() {
    const form = document.createElement('form')
    form.classList= 'filter'
    //Action must be a backend action that takes users/companies from the database
    /*Just an example: search.action='./'*/
    //Icon
    const icon = document.createElement('img')
    icon.src = "./public/magnifying glass.jpg"
    icon.style.height = "20px"
    const iconHTML = document.createElement('div');
    iconHTML.style.height = 'fit-content'
    iconHTML.appendChild(icon)
    form.appendChild(iconHTML)
    //element for searching name
    const nameSearch  = document.createElement('input')
    nameSearch.type = 'text'
    nameSearch.id='nameSearch'
    nameSearch.name="userName"
    form.appendChild(nameSearch)
    form.innerHTML += "<input type='submit' value='filter'>"
    return form
}

const createTable = (data) => {
    const table = document.createElement('table')
    const legend = document.createElement('tr')
    legend.innerHTML = "<th>naam</th><th>email</th><th>laatste login</th><th>Acties</th>"
    table.appendChild(legend)
    for (let element of data) {
        const line = document.createElement('tr')
        line.innerHTML = `<td>${element.name}</td>`
        line.innerHTML += `<td>${element.mail}</td>`
        line.innerHTML += `<td>${element.login}</td>`
        //last line will be kept for the actions
        line.innerHTML += `<td>eye||delete</td>`
        table.appendChild(line)
    }
    //end TestData

    return table
}
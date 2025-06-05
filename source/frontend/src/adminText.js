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
    //Table data must be replaced with data from database, when ready
    gebruiker.appendChild(createTable(test.student))
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
    //Table data must be replaced with data from database, when ready
    bedrijf.appendChild(createTable(test.bedrijf))

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
    const form = document.createElement('div')
    form.classList= 'filter'
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

    const search = document.createElement('button');
    search.innerHTML = "Filter"
    search.addEventListener('click', () => {

    })

    form.appendChild(nameSearch)
    form.appendChild(search)
    return form
}

function createTable (data) {
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
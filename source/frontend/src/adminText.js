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

    //Create a table to show the student amount
    const userTable = document.createElement('table');
    userTable.appendChild(createTableLegend())

    gebruiker.appendChild(userTable)
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
    bedrijf.appendChild(createTableLegend())

    element.appendChild(bedrijf)
}

function addBedrijf (element) {
    console.log("click")
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

const createTableLegend = () => {
    const legend = document.createElement('tr')

    legend.innerHTML = "<th>naam</th><th>email</th><th>laatste login</th>"
    return legend
}
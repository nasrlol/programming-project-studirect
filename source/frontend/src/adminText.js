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

function gebruikers (element, extra = null) {
    element.innerHTML = ""
    const gebruiker = document.createElement('div')
    gebruiker.innerHTML = "<div>Gebruikers</div>"

    const search = createSearch("student", element);
    gebruiker.appendChild(search)
    //Table data must be replaced with data from database, when ready

    if (extra == null)gebruiker.appendChild(createTable(data.student));
    //If filtered is active, will seperate found names
    else gebruiker.appendChild(createTable(extra.notFound, extra.found));
    element.appendChild(gebruiker)
}

function bedrijven (element, extra = null) {
    element.innerHTML = ""
    const bedrijf = document.createElement('div')
    bedrijf.innerHTML = "<div>Bedrijven</div>"

    //Line which will take the admin to a form to add a new company
    const create = document.createElement('button')
    create.innerHTML = "Bedrijf toevoegen "
    create.classList = "btn-nav"
    create.addEventListener("click", () => {addBedrijf(element)})
    bedrijf.appendChild(create)
    bedrijf.appendChild(createSearch("bedrijf", element))
    //Table data must be replaced with data from database, when ready
    if (extra == null) bedrijf.appendChild(createTable(data.bedrijf));
    else bedrijf.appendChild(createTable(extra.notFound, extra.found));

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

function filterName(array, name) {
    //https://stackoverflow.com/questions/35235794/filter-strings-in-array-based-on-content-filter-search-value
    return array.filter(obj => {return obj.name.indexOf(name) > -1})
}

function createSearch(type, element) {
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
    form.appendChild(nameSearch)
    //input used to see what type of user we want, a student or a company
    const typeSearch = document.createElement('input')
    typeSearch.id = "typeSearch"
    typeSearch.type = 'hidden'
    typeSearch.value = type;

    //Button to search for name
    const search = document.createElement('button');
    search.innerHTML = "Filter"
    search.addEventListener('click', () => {
        //If nothing is in the text field don't execute the function
        if (nameSearch.value == "") return 0
        const type = document.getElementById("typeSearch").value
        let array
        if (type == "student") array = copyObjectArray(data.student)
        else array = copyObjectArray(data.bedrijf)

        //Filter the array. First has the searched value, second doesn't
        //https://stackoverflow.com/questions/35235794/filter-strings-in-array-based-on-content-filter-search-value
        const filteredArray = array.filter(obj => {return obj.name.indexOf(nameSearch.value) > -1})
        console.log(filteredArray)
        for (let filteredItem of filteredArray) {
            let index = array.indexOf(filteredItem)
            array.splice(index, 1)
        }
        const arrayList = {
            found: filteredArray,
            notFound: array
        }
        if (type == "student") gebruikers(element, arrayList)
        else bedrijven(element, arrayList)
    })
    form.appendChild(typeSearch)
    form.appendChild(search)
    return form
}

function createTable (data, extra) {
    const table = document.createElement('table')
    const legend = document.createElement('tr')
    legend.innerHTML = "<th>naam</th><th>email</th><th>laatste login</th><th>Acties</th>"
    table.appendChild(legend)
    if (extra) {
        for (let element of extra) {
            const line = document.createElement('tr')
            line.innerHTML = `<td>|${element.name}</td>`
            line.innerHTML += `<td>${element.mail}</td>`
            line.innerHTML += `<td>${element.login}</td>`
            //last line will be kept for the actions
            line.innerHTML += `<td>eye||delete</td>`
            table.appendChild(line)
        }
    }
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

//I have no idea how to copy an object by value in javascript, so yeah. Used to copy the arrays inside an object
function copyObjectArray(array) {
    let newArray = new Array()
    for (let el of array) {
        newArray.push(el)
    }
    return newArray;
}
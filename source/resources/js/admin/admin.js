//changes contents of table to arrays for the js functions
function tableToObjects() {
    let objects = {
        company: new Array,
        student: new Array
    }
    let names = document.getElementsByClassName("studentName")
    let mails = document.getElementsByClassName("studentMail")
    let logins = document.getElementsByClassName("studentLogin");
    for (let i = 0; i < names.length; i++)
    {
        objects.student.push({
            name: names[i].innerHTML,
            mail: mails[i].innerHTML,
            login: logins[i].innerHTML
        });
    }
    names = document.getElementsByClassName("companyName"),
    mails = document.getElementsByClassName("companyMail"),
    logins = document.getElementsByClassName("companyLogin");
    for (let i = 0; i < names.length; i++)
        objects.company.push({
            name: names[i].innerHTML,
            mail: mails[i].innerHTML,
            login: logins[i].innerHTML
        });
    return objects
}

const data = tableToObjects()

console.log(data)

//Sets the amount of students and companies based on the amount of rows in the table
function dashboard() {
    const d = document.getElementById("student-amount");
    d.innerHTML = data.student.length;
    const t = document.getElementById("company-amount");
    t.innerHTML = data.company.length
}
//g
function createSearch(d, t) {
    return t.innerHTML += '<div style="height: fit-content;"><img src="./images/magnifying glass.jpg" style="height: 20px;"></div>',
    d == 0 ? t.innerHTML += '<input type="text" id="nameSearchS">' : t.innerHTML += '<input type="text" id="nameSearchC">',
    t.innerHTML += `<input id="typeSearch" type="hidden" value="${d}">`,
    t.innerHTML += `<button id=search${d} class='filterAction'>Filter</button>`,
    t
}
function switchDisplay(element) {
    const dashboard = document.getElementById("dashboard")
      , students = document.getElementById("students")
      , companies = document.getElementById("companies")
      , addCompany = document.getElementById("addCompany");
    dashboard.style.display = "none",
    students.style.display = "none",
    companies.style.display = "none",
    addCompany.style.display = "none",
    document.getElementById(element).style.display = "block"
}

function filterArray(array, name) {
    return array.filter(obj => obj.name.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) > -1)
}
//m
function createTable(input, extra = null) {
    let table;
    document.getElementById("students").style.display != "none" ? table = document.getElementById("studentTable") : table = document.getElementById("companyTable"),
    table.innerHTML = "";
    const legend = document.createElement("tr");
    legend.innerHTML = "<th>naam</th><th>email</th><th>laatste login</th><th>Acties</th>"
    table.appendChild(legend)
    if (extra) {
        for (let e of extra) {
            const a = document.createElement("tr");
            a.innerHTML = `<td>|${e.name}</td>`,
            a.innerHTML += `<td>${e.mail}</td>`,
            a.innerHTML += `<td>${e.login}</td>`,
            a.innerHTML += "<td>eye||delete</td>",
            table.appendChild(a)
        }
    }
    for (let e of input) {
        const a = document.createElement("tr");
        a.innerHTML = `<td>${e.name}</td>`,
        a.innerHTML += `<td>${e.mail}</td>`,
        a.innerHTML += `<td>${e.login}</td>`,
        a.innerHTML += "<td>eye||delete</td>",
        table.appendChild(a)
    }
    return table
}
//y
function copyArray(array) {
    let newArray = new Array;
    for (let el of array)
        newArray.push(el);
    return newArray
}

const result = document.getElementById("result-container");
document.getElementById("nav-dashboard").addEventListener("click", () => {
    switchDisplay("dashboard")
}
);
document.getElementById("nav-users").addEventListener("click", () => {
    switchDisplay("students")
}
);
document.getElementById("nav-companies").addEventListener("click", () => {
    switchDisplay("companies")
}
);
document.getElementById("toAddCompany").addEventListener("click", () => {
    switchDisplay("addCompany")
}
);
document.getElementById("backToCompanies").addEventListener("click", () => {
    switchDisplay("companies")
}
);
window.addEventListener("load", () => {
    dashboard(),
    switchDisplay("dashboard");
    const filterElements = document.getElementsByClassName("filter");
    let count = 0;
    for (let element of filterElements)
        createSearch(count, element),
        count++;
    for (let filter of document.getElementsByClassName("filterAction"))
        filter.addEventListener("click", () => {
            //l, e
            let nameInput, type;
            //Checks if we're on the studentpage. Else, we can assume we're on the company page
            if (document.getElementById("students").style.display != "none" ? (nameInput = document.getElementById("nameSearchS").value,
            type = "student") : (nameInput = document.getElementById("nameSearchC").value,
            type = "company"))

            //If no name was found, create the table without any extras
            if (nameInput == '') {
                type == "student" ? createTable(data.student) : createTable(data.company)
                return 0 ;
            }
            let filtered;
            //Filter the name through the arrays, depending on wether it's a student or a company
            type == "student" ? filtered = filterArray(data.student, nameInput) : filtered = filterArray(data.company, nameInput)
            //If no names were found, just create regular table
            if (filtered.length == 0) {
                type == "student" ? createTable(data.student) : createTable(data.company);
                return 0;
            }
            //remove found objects from the original array
            let rest;
            if (type == "student") {
                rest = copyArray(data.student);
                for (let el of filtered) rest = rest.filter(obj=> obj.name != el.name)
            } 
            else {
                rest = copyArray(data.company);
                for (let el of filtered) rest = rest.filter(obj => obj.name != el.name)
            }
            //create table, starting with highlighted names, then the rest
            createTable(rest, filtered)
        }
        )
}
);
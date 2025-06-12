import { dashboard, switchDisplay, popUp, removePopUp, createSearch, createTable, fixAppointment, sortAppointment, data, copyArray, filterArray, setDeleteFunctionality, setViewFunctionality } from './admin.js'

//events
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
})

document.getElementById('nav-logs').addEventListener('click', () => {
    switchDisplay('logs')
})
document.getElementById("toAddCompany").addEventListener("click", () => {
    switchDisplay("addCompany")
}
);
document.getElementById("toAddStudent").addEventListener("click", () => {
    switchDisplay("addStudent")
}
);
document.getElementById("backToCompanies").addEventListener("click", () => {
    switchDisplay("companies")
});
document.getElementById("backToStudent").addEventListener("click", () => {
    switchDisplay("students")
});
document.getElementById("nav-appointments").addEventListener("click", () => {
    switchDisplay("appointments")
});
//Add a 'view more' option for students and companies
setViewFunctionality()

//Add a 'delete' option for students and companies
setDeleteFunctionality()
//To abort the delete process 
document.getElementById('abortDelete').addEventListener('click', () => {
    const form = document.getElementById('deletionForm')
    for (let element of document.getElementsByClassName('deletionForm')) element.style.display = 'none'
    for (let element of document.getElementsByClassName('normalForm')) element.style.display = 'block'
    form.action = '';
    removePopUp();
})

//For removing popups
document.getElementById('removePopupButton').addEventListener('click', () => {
    removePopUp()
})
//Popups can also be removed by pressing escape 
document.addEventListener('keydown', e => {
    if (e.key == "Escape") removePopUp()
})

window.addEventListener("load", () => {
    dashboard(),
    switchDisplay("addStudent");
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
                setViewFunctionality()
                setDeleteFunctionality()
                return 0 ;
            }
            let filtered;
            //Filter the name through the arrays, depending on wether it's a student or a company
            type == "student" ? filtered = filterArray(data.student, nameInput) : filtered = filterArray(data.company, nameInput)
            //If no names were found, just create regular table
            if (filtered.length == 0) {
                type == "student" ? createTable(data.student) : createTable(data.company);
                setViewFunctionality()
                setDeleteFunctionality()
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
        fixAppointment()
        sortAppointment()
        setTimeout(() => {
            document.getElementById('serverResponse').innerHTML = ''
        }, 5000)
}
);
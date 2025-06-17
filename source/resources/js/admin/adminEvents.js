'use strict'
import { dashboard, switchDisplay, popUp, removePopUp, createSearch, createTable, sortAppointment, data, copyArray, filterArray, setDeleteFunctionality, setViewFunctionality, removeForms, sortLogs } from './admin.js'

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
document.getElementById('abortAction').addEventListener('click', () => {
    removeForms()
    removePopUp();
})
//Popups can also be removed by pressing escape 
document.addEventListener('keydown', e => {
    if (e.key == "Escape") {
        removePopUp()
        removeForms()
    }
})

document.getElementById('searchType').addEventListener('change', () => {
    const searchType = document.getElementById('searchType').value;
    sortLogs(searchType)
    
})

window.addEventListener("load", () => {
    dashboard();
    sortLogs('belang')
    switchDisplay("logs");

    //Checks if there are new logs to be found. If not, the next Logs button is removed
    if (document.getElementById('next-log-page').value == '') document.getElementById('next-log-form').style.visibility ='hidden'
    if (document.getElementById('prev-log-page').value == '') document.getElementById('prev-log-form').style.visibility ='hidden'

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
            setViewFunctionality()
            setDeleteFunctionality()
        }
        )
        setTimeout(() => {
            document.getElementById('serverResponse').innerHTML = ''
        }, 5000)
    sortAppointment()
}
);
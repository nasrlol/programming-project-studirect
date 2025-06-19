'use strict'
//changes contents of table to arrays for the js functions
function tableToObjects() {
    let objects = {
        company: new Array,
        student: new Array,
        appointments:new Array,
        logs: new Array
    }
    let ids = document.getElementsByClassName('studentId')
    const activated = document.getElementsByClassName('activated')
    let names = document.getElementsByClassName("studentName")
    let mails = document.getElementsByClassName("studentMail")
    let logins = document.getElementsByClassName("studentLogin");
    const studys = document.getElementsByClassName('study-direction')
    const interests = document.getElementsByClassName('interests')
    const preferences = document.getElementsByClassName('job-preferences')
    //for logs that a student may have
    const studentLogIds = document.getElementsByClassName('studentLogId')
    const studentLogAction = document.getElementsByClassName('studentLogAction')
    const studentLogTime = document.getElementsByClassName('studentLogTime');
    const studentSeverity = document.getElementsByClassName('studentSeverity')
    for (let i = 0; i < names.length; i++)
    {
        let currentId = ids[i].innerHTML
        //check if the student has any logs
        let logs = new Array()
        //add any logs that are necessary
        for (let i = 0; i < studentLogIds.length; i++) {
            if (studentLogIds[i].innerHTML == currentId) {
                let severityInt;
                switch (studentSeverity[i].innerHTML.trim().toLocaleLowerCase()) {
                    case 'normal':
                        severityInt = 0;
                        break;
                    case 'critical':
                        severityInt = 1;
                        break;
                    default:
                        severityInt = 0;
                        break;
                }
                logs.push({
                    action: studentLogAction[i].innerHTML,
                    date: studentLogTime[i].innerHTML.trim(),
                    severity: severityInt
                });
            }
        }
        objects.student.push({
            id: currentId,
            activated: activated[i].innerHTML,
            name: names[i].innerHTML,
            mail: mails[i].innerHTML,
            login: logins[i].innerHTML,
            studyDirection: studys[i].innerHTML.trim(),
            interests: interests[i].innerHTML.trim(),
            preferences: preferences[i].innerHTML.trim(),
            logs: logs
        });
    }
    //Add companies
    ids = document.getElementsByClassName('companyId')
    names = document.getElementsByClassName("companyName"),
    mails = document.getElementsByClassName("companyMail"),
    logins = document.getElementsByClassName("companyLogin");
    const  planTypes = document.getElementsByClassName('plan-type')
    const  jobTypes = document.getElementsByClassName('job-types')
    const  jobDomain = document.getElementsByClassName('job-domain')
    const  description = document.getElementsByClassName('description')
    const  boothLocation = document.getElementsByClassName('booth-location')
    const  speeddateDuration = document.getElementsByClassName('speeddate-duration')
    //for logs that a company may have
    const companyLogIds = document.getElementsByClassName('companyLogIds')
    const companyLogAction = document.getElementsByClassName('companyLogAction')
    const companyLogTime = document.getElementsByClassName('companyLogTime');
    const companySeverity = document.getElementsByClassName('companySeverity')

    for (let i = 0; i < names.length; i++) {
        let currentId = ids[i].innerHTML;
        //check if the company has any logs
        let logs = new Array()
        //add any logs that are necessary
        for (let i = 0; i < companyLogIds.length; i++) {
            if (companyLogIds[i].innerHTML == currentId) {
                let severityInt;
                switch (companySeverity[i].innerHTML.trim().toLocaleLowerCase()) {
                    case 'normal':
                        severityInt = 0;
                        break;
                    case 'critical':
                        severityInt = 1;
                        break;
                    default:
                        severityInt = 0;
                        break;
                }
                logs.push({
                    action: companyLogAction[i].innerHTML,
                    date: companyLogTime[i].innerHTML.trim(),
                    severity: severityInt
                });
            }
        }

        objects.company.push({
            id: ids[i].innerHTML,
            name: names[i].innerHTML,
            mail: mails[i].innerHTML,
            login: logins[i].innerHTML,
            planType: planTypes[i].innerHTML.trim(),
            jobTypes: jobTypes[i].innerHTML.trim(),
            jobDomain: jobDomain[i].innerHTML.trim(),
            description: description[i].innerHTML.trim(),
            boothLocation: boothLocation[i].innerHTML.trim(),
            speeddateDuration: speeddateDuration[i].innerHTML.trim(),
            logs: logs
        });
    }

    //Add apointments
    let studentId = document.getElementsByClassName('appointmentSId')
    let companyId = document.getElementsByClassName('appointmentCId')
    let appointmentTime = document.getElementsByClassName('appointmentTime')

    for (let i = 0; i < studentId.length; i++) {
        objects.appointments.push({
            studentId: studentId[i].innerHTML,
            companyId: companyId[i].innerHTML,
            appointmentTime: appointmentTime[i].innerHTML.trim()
        });
    }

    //add logs
    let logId = document.getElementsByClassName('logId')
    let logAction = document.getElementsByClassName('logAction')
    let logDate = document.getElementsByClassName('logDate')
    let severity = document.getElementsByClassName('severity')

    for (let i = 0; i < logId.length; i++) {
        let severityInt;
        switch (severity[i].innerHTML.trim().toLocaleLowerCase()) {
            case 'normal':
                severityInt = 0;
                break;
            case 'critical':
                severityInt = 1;
                break;
            default:
                severityInt = 0;
                break;
        }
        objects.logs.push({
            id: logId[i].innerHTML,
            action: logAction[i].innerHTML,
            date: logDate[i].innerHTML.trim(),
            severity: severityInt
        });
    }

    return objects
}

export const data = tableToObjects()

//Sets the amount of students and companies based on the amount of rows in the table
export function dashboard() {
    const d = document.getElementById("student-amount");
    d.innerHTML = data.student.length;
    const t = document.getElementById("company-amount");
    t.innerHTML = data.company.length
    const l = document.getElementById("appointment-amount");
    l.innerHTML = data.appointments.length
}
//Code was once lost, and refound by taking it from uglyfied code
export function createSearch(d, t) {
    return t.innerHTML += '<div class="image-container glass"><img src="../images/magnifying glass.jpg" style="height: 20px;"></div>',
    d == 0 ? t.innerHTML += '<input type="text" class="nameSearch" id="nameSearchS">' : t.innerHTML += '<input type="text" class="nameSearch" id="nameSearchC">',
    t.innerHTML += `<input id="typeSearch" type="hidden" value="${d}">`,
    t.innerHTML += `<button id=search${d} class='filterAction'>Zoek</button>`,
    t
}
export function switchDisplay(element) {
    const students = document.getElementById("students")
      , companies = document.getElementById("companies")
      , addCompany = document.getElementById("addCompany")
      , addStudent = document.getElementById("addStudent")
      , appointments = document.getElementById('appointments')
      , logs = document.getElementById('logs'),
      details = document.getElementById('details');
      appointments.style.display = 'none'
    students.style.display = "none",
    companies.style.display = "none",
    addCompany.style.display = "none",
    addStudent.style.display = "none"
    logs.style.display = "none"
    details.style.display = "none"
    document.getElementById(element).style.display = "block"
}


//creates a popup, with text
export function popUp (text) {
    document.getElementById('extra-container').style.display = 'block'
    document.getElementById('extra-message').innerHTML = text;
}

export function removePopUp () {
    document.getElementById('extra-container').style.display = 'none';
    document.getElementById('extra-message').innerHTML = ''
}


export function filterArray(array, name) {
    return array.filter(obj => obj.name.toLocaleLowerCase().indexOf(name.toLocaleLowerCase()) > -1)
}
//m
export function createTable(input, extra = null) {
    let table;
    //If student table is displayed, it's safe to assume we're on student list
    document.getElementById("students").style.display != "none" ? table = document.getElementById("studentTable") : table = document.getElementById("companyTable"),
    table.innerHTML = "";
    const type = document.getElementById("students").style.display != "none"  ? "S" : "C"
    const legend = document.createElement("tr");
    legend.innerHTML = "<th>Naam</th><th class='mailTh'>Email</th><th class='loginTh'>Laatste login</th><th class='extraTh'>Acties</th>"
    table.appendChild(legend)
    if (extra) {
        for (let e of extra) {
            const a = document.createElement("tr");
            a.innerHTML = `<td class='highlighted'>|${e.name}</td>`,
            a.innerHTML += `<td>${e.mail}</td>`,
            a.innerHTML += `<td class='extraTd'>${e.login}</td>`,
            a.innerHTML += `<td class='extraTd'><span>
                                    <img class='extraActions moreInfo' id='eye${type}${e.id}' src='../images/eyeball.png'>
                                </span>  
                                <span>
                                    <img class='extraActions delete' id='eye${type}${e.id}' src='../images/delete.png'>
                                </span></td>`;
            if (type == 'S') {
                a.innerHTML += `<td class='hidden activated'>${e.activated}</td>
                            <td class='hidden study-direction'>
                                ${e.studyDirection}
                            </td>
                            <td class='hidden interests'>
                                ${e.interests}
                            </td>
                            <td class='hidden job-preferences'>
                                ${e.preferences}
                            </td>`
            }
            else {
                a.innerHTML += `<td class='hidden plan-type'>
                                    ${e.planTypes}
                                </td>
                                <td class='hidden job-types'>
                                    ${e.jobTypes}
                                </td>
                                <td class='hidden job-domain'>
                                    ${e.jobDomain}
                                </td>
                                <td class='hidden description'>
                                    ${e.description}
                                </td>
                                <td class='hidden booth-location'>
                                    ${e.boothLocation}
                                </td>
                                <td class='hidden speeddate-duration'>
                                    ${e.speeddateDuration}
                                </td>`
            }
            table.appendChild(a)
        }
    }
    for (let e of input) {
        const a = document.createElement("tr");
        a.innerHTML = `<td>${e.name}</td>`,
        a.innerHTML += `<td>${e.mail}</td>`,
        a.innerHTML += `<td class='extraTd'>${e.login}</td>`,
        a.innerHTML += `<td class='extraTd'><span>
                                    <img class='extraActions moreInfo' id='eye${type}${e.id}' src='../images/eyeball.png'>
                                </span>  
                                <span>
                                    <img class='extraActions delete' id='eye${type}${e.id}' src='../images/delete.png'>
                                </span></td>`;
            if (type == 'S') {
                a.innerHTML += `<td class='hidden activated'>${e.activated}</td>
                            <td class='hidden study-direction'>
                                ${e.studyDirection}
                            </td>
                            <td class='hidden interests'>
                                ${e.interests}
                            </td>
                            <td class='hidden job-preferences'>
                                ${e.preferences}
                            </td>`
            }
            else {
                a.innerHTML += `<td class='hidden plan-type'>
                                    ${e.planTypes}
                                </td>
                                <td class='hidden job-types'>
                                    ${e.jobTypes}
                                </td>
                                <td class='hidden job-domain'>
                                    ${e.jobDomain}
                                </td>
                                <td class='hidden description'>
                                    ${e.description}
                                </td>
                                <td class='hidden booth-location'>
                                    ${e.boothLocation}
                                </td>
                                <td class='hidden speeddate-duration'>
                                    ${e.speeddateDuration}
                                </td>`
            }
        table.appendChild(a)
    }
    return table
}
//y
export function copyArray(array) {
    let newArray = new Array;
    for (let el of array)
        newArray.push(el);
    return newArray
}

//Appointments start of sorted by time instead of ID. This fixes that
export function sortAppointment () {
    //Table where the appointments are stored
    const appointmentsTemp = document.createElement('tbody')

    const appointmentInfo = document.getElementById('appointmentInfo')
    let times = new Array()
    for (let time of document.getElementsByClassName('appointmentTime')) {
        time = time.innerHTML
        time = time.trim()
        time = time.substring(0, 5)
        time = time.replace(":", "-")
        if (times.indexOf(time) < 0) times.push(time)
    }
    times.sort();
    //We loop over all elements that keep times, keep it in a temporary row
    // way of doing this aquired from https://stackoverflow.com/questions/15843581/how-to-correctly-iterate-through-getelementsbyclassname
    appointmentsTemp.innerHTML = '<tr><th>Student</th><th>Bedrijf</th><th>Tijdslot</th></tr>'
    for (let time of times) {
        let timeElements = document.querySelectorAll('.t' +  time).forEach(element => {
            let newElement = document.createElement('tr')
            newElement.innerHTML = element.innerHTML
            appointmentsTemp.appendChild(newElement)
        })
    }
    appointmentInfo.innerHTML = appointmentsTemp.innerHTML
}
//Function to give the delete buttons their functionality
export function setDeleteFunctionality () {
for (let element of document.getElementsByClassName('delete')) {
    element.addEventListener('click', () => {
        const isStudent = (element.id.substring(3, 4) == "S")
        const id = element.id.substring(4)
        //Get user based on ID
        let list
        if (isStudent) list = data.student
        else list = data.company
        const user =  list.filter(obj => obj.id == id)[0]

        const response  = `Ben je er zeker van dat je ${isStudent ? 'student' : 'bedrijf'} ${user.name} wil verwijderen?<br>Deze actie kan niet ongedaan gemaakt worden(klik op nee om te stoppen)`
        document.getElementById('abortAction').style.display = 'block'
        const form = document.getElementById('deletionForm')
        
        //Set the request URL
        if (!isStudent) {
            form.action = '/companies/' + user.id;
       }
       else {
            form.action = '/students/' + user.id;
            form.style.display = 'block'
        }
        form.style.display = 'block'
        //Set popup
        popUp(response)
    })
}
}

export function setViewFunctionality () {
    for (let element of document.getElementsByClassName('moreInfo')) {
    element.addEventListener('click', () => {
        const id = element.id.substring(4);
        //Eye icon has class studentEye or companyEye to make sure right item is called
        const isStudent = (Array.from(element.classList).includes('studentEye'))
        //gets relevant list, based on if it's a student or a company
        let list;
        if (isStudent) list = data.student
        else list = data.company

        //use filter to find the user we want, based on ID 
        const user =  list.filter(obj => obj.id == id)[0]
        const response = document.createElement('div');
        const li = document.createElement('ul');
        li.innerHTML = `<li>Naam: ${user.name}</li>`
        li.innerHTML += `<li>Email: ${user.mail}<br>`
        //Extra info if it's a student
        if (isStudent) {
            let geactiveerd = (user.activated == 1) ? 'Ja' : 'Nee'
            
            li.innerHTML += `<li>Geactiveerd: ${geactiveerd}</li>`
            li.innerHTML += `<li>Job interesses: ${user.interests}</li>`
            li.innerHTML += `<li>Studierichting: ${user.studyDirection}</li>`
            li.innerHTML += `<li>Job voorkeuren: ${user.preferences}</li>`
        }
        //Extra info if it's a company
        else {
            li.innerHTML += `<li>Prijs plan: ${user.planType}</li>`
            li.innerHTML += `<li>Type job: ${user.jobTypes}</li>`
            li.innerHTML += `<li>Jobdomein: ${user.jobDomain}</li>`
            li.innerHTML += `<li>Beschrijving: ${user.description}</li>`
            li.innerHTML += `<li>Locatie booth: ${user.boothLocation}</li>`
            li.innerHTML += `<li>Duur speeddates: ${user.speeddateDuration}</li>`

        }
        //Add user logs, if they exist
        li.innerHTML += `<li>Logs</li>`
        const logList = document.createElement('ul');
        if (user.logs.length > 0) {
            let color;
            let severity;
            for (let log of user.logs) {
                switch (log.severity) {
                    case 0:
                        color = 'black';
                        severity = 'Normaal';
                        break;
                    case 1:
                        color = 'red';
                        severity = 'Kritiek';
                        break;
                    default:
                        color = 'grey';
                }

                logList.innerHTML += `<li class='logItem' style='color: ${color}'>
                <div class='logAction'>${log.action}</div>
                <div class='logDate'>${log.date}</div>
                <div class='severity'>Belang: ${severity}</div>
                </li>`
            }
        }
        //Else say no logs were found
        else logList.innerHTML = "Geen logs bij deze user"
        
        li.appendChild(logList);
        li.innerHTML += '</li>'
        
        response.appendChild(li);

        document.getElementById('detailList').innerHTML = response.innerHTML;
        switchDisplay('details')
    })
}
}

//remove forms from popup
export function removeForms () {
    document.getElementById('deletionForm').action = ''
    for (let element of document.getElementsByClassName('tempForm')) element.style.display = 'none'
}

export function sortLogs(searchType) {
    let color;
    let severity;
    document.getElementById('log-list').innerHTML = ''

    if (searchType == 'belang') {
        data.logs.sort((a, b) => {
        return a.severity - b.severity;
    })
    }
    else if (searchType == 'datum') {
        data.logs = data.logs.sort((a, b) => {
            return a.date.localeCompare(b.date);
        });
    }
        for (let log of data.logs) {
        switch (log.severity) {
            case 0:
                color = 'black';
                severity = 'Normaal';
                break;
            case 1:
                color = 'red';
                severity = 'Kritiek';
                break;
            default:
                color = 'grey';
        }
        document.getElementById('log-list').innerHTML += `<li class='logItem' style='color: ${color}'>
            <div class='hidden logId'>${log.id}</div>
            <div class='logAction'>${log.action}</div>
            <div class='logDate'>${log.date}</div>
            <div class='severity'>Belang: ${severity}</div>
            </li>`
    }
}
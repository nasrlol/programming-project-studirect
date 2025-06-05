const mainContainer = document.createElement('div')
mainContainer.id = 'main-container'

const nav = document.createElement('nav')
nav.innerHTML = "Admin<br>"

for (let button of ["Dashboard", "Gebruikers", "Bedrijven", "Logs"]) {
    const btn = document.createElement('button')
    btn.innerHTML = button
    btn.classList = "btn-nav"
    btn.id = button.toLocaleLowerCase()
    nav.appendChild(btn)
}

const resultContainer = document.createElement('div')
resultContainer.id = "result-container"

mainContainer.appendChild(nav)
mainContainer.appendChild(resultContainer)

document.querySelector('body').appendChild(mainContainer)


document.getElementById('dashboard').addEventListener('click', () => {
    dashboard(resultContainer)
})

document.getElementById('gebruikers').addEventListener('click', () => {
    gebruikers(resultContainer)
})

document.getElementById('bedrijven').addEventListener('click', () => {
    bedrijven(resultContainer)
})

window.addEventListener('load', () => {
    //Add link to stylesheet
    const head = document.head;
    //Code borowed from https://stackoverflow.com/questions/11833759/add-stylesheet-to-head-using-javascript-in-body
    const link = document.createElement('link')
    link.type = "text/css";
    link.rel= "stylesheet"
    link.href = "./src/admin.css"
    head.appendChild(link)
    //start with dashboard
    dashboard(resultContainer)
})
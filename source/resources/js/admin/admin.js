import { data } from "./adminVars"
import { dashboard, users, companies   } from "./adminText"

const mainContainer = document.createElement('div')
mainContainer.id = 'main-container'

const nav = document.querySelector('nav')

const resultContainer = document.createElement('div')
resultContainer.id = "result-container"

mainContainer.appendChild(nav)
mainContainer.appendChild(resultContainer)

document.querySelector('body').appendChild(mainContainer)


document.getElementById('dashboard').addEventListener('click', () => {
    dashboard(resultContainer)
})

document.getElementById('users').addEventListener('click', () => {
    users(resultContainer)
})

document.getElementById('companies').addEventListener('click', () => {
    companies(resultContainer)
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
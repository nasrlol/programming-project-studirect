const resultContainer = document.getElementById('result-container') 


document.getElementById('dashboard').addEventListener('click', () => {
    dashboard(resultContainer)
})

document.getElementById('gebruikers').addEventListener('click', () => {
    gebruikers(resultContainer)
})

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
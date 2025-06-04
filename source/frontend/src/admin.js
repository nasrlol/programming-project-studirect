const resultContainer = document.getElementById('result-container') 


document.getElementById('dashboard').addEventListener('click', () => {
    dashboard(resultContainer)
})

document.getElementById('gebruikers').addEventListener('click', () => {
    gebruikers(resultContainer)
})

dashboard(resultContainer)
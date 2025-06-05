console.log('test');

function laadHomeContent() {
    content.innerHTML = "";

    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const meldingenContainer = document.createElement("section");
    meldingenContainer.classList.add("meldingen");

    const titel = document.createElement("h2");
    titel.textContent = "recente meldingen:";
    meldingenContainer.appendChild(titel);

    const meldingen = [
        "steven heeft een speeddate geplant",
        "arda heeft je geswiped",
        "dries zijn afspraak is binne 5 minuten",
        "..."
    ];

    meldingen.forEach(melding => {
        const p = document.createElement("p");
        p.textContent = melding;
        meldingenContainer.appendChild(p);
    });

    const plattegrondContainer = document.createElement("section");
    plattegrondContainer.classList.add("plattegrond");

    const img = document.createElement("img");
    img.src = "/source/frontend/public/plattegrondvb.png";
    img.alt = "zaalplattegrond";
    plattegrondContainer.appendChild(img);

    mainContainer.appendChild(meldingenContainer);
    mainContainer.appendChild(plattegrondContainer);

    content.appendChild(mainContainer);
}
console.log("Pagina geladen");
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    const homeBtn = document.getElementById("homeBtn");
    const berichtenBtn = document.getElementById("berichtenBtn");

    // initialiseer bij laden
    laadHomeContent();

    homeBtn.addEventListener("click", () => {
        laadHomeContent();
    })
});



/*berichten page*/

berichtenBtn.addEventListener("click", () => {
    // Verwijder huidige content
    content.innerHTML = "";

    // Maak berichtencontainer (hoofdlayout met 2 kolommen)
    const berichtenContainer = document.createElement("div");
    berichtenContainer.classList.add("berichten-container");

    // LINKERKOLOM: lijst met gesprekken
    const gesprekkenLijst = document.createElement("div");
    gesprekkenLijst.classList.add("gesprekken-lijst");

    const gesprekkenTitel = document.createElement("h3");
    gesprekkenTitel.textContent = "berichten:";
    gesprekkenLijst.appendChild(gesprekkenTitel);

    const gebruiker1 = document.createElement("div");
    gebruiker1.classList.add("gebruiker");
    gebruiker1.textContent = "alexandra";
    gesprekkenLijst.appendChild(gebruiker1);

    // RECHTERKOLOM: chatvenster
    const chatVenster = document.createElement("div");
    chatVenster.classList.add("chat-venster");

    const naam = document.createElement("div");
    naam.classList.add("chat-naam");
    naam.textContent = "alexandra";
    chatVenster.appendChild(naam);

    const chatBubbel = document.createElement("div");
    chatBubbel.classList.add("chat-bubbel");
    chatBubbel.textContent = "ik ben geïnteresseerd in je bedrijf";
    chatVenster.appendChild(chatBubbel);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "typ een bericht";
    input.classList.add("chat-input");
    chatVenster.appendChild(input);

    // Voeg beide kolommen toe
    berichtenContainer.appendChild(gesprekkenLijst);
    berichtenContainer.appendChild(chatVenster);

    // Plaats alles in main content
    content.appendChild(berichtenContainer);
});
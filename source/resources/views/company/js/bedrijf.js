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
    const messageBtn = document.getElementById("messageBtn");
    const calenderBtn = document.getElementById("calenderBtn");
    // initialiseer bij laden
    laadHomeContent();
    setActiveButton("homeBtn");
    homeBtn.addEventListener("click", () => {
        laadHomeContent();
        setActiveButton("homeBtn");

    })
});



/*berichten page*/

messageBtn.addEventListener("click", () => {
    console.log("Klik op berichten-knop");
    setActiveButton("messag3Btn");
    content.innerHTML = "";

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const discussionList = document.createElement("div");
    discussionList.classList.add("discussion-list");

    const discussionTitel = document.createElement("h3");
    discussionTitel.textContent = "message:";
    discussionList.appendChild(discussionTitel);

    const user = [
        {
            naam: "alexandra",
            foto: "https://i.pravatar.cc/40?img=1",
            berichten: ["ik ben geïnteresseerd in je bedrijf"]
        },
        {
            naam: "steven",
            foto: "https://i.pravatar.cc/40?img=2",
            berichten: ["Wanneer begint de speeddating?"]
        },
        {
            naam: "kevin",
            foto: "https://i.pravatar.cc/40?img=6",
            berichten: ["Bedankt voor je bericht!"]
        }
    ];

    const chatWindow = document.createElement("div");
    chatWindow.classList.add("chat-Window");

    function laadChat(user) {
        chatWindow.innerHTML = "";

        const name = document.createElement("div");
        name.classList.add("chat-name");
        name.innerHTML = `<img src="${user.foto}" class="avatar"> ${gebruiker.name}`;
        chatWindow.appendChild(name);

        user.message.forEach(msg => {
            const chatBubble = document.createElement("div");
            chatBubble.classList.add("chat-bubbel");
            chatBubble.textContent = msg;
            chatWindow.appendChild(chatBubble);
        });

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "typ een bericht";
        input.classList.add("chat-input");

        input.addEventListener("keydown", e => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                const nieuwBericht = input.value;
                user.message.push(nieuwBericht);
                laadChat(gebruiker); // herlaad om het toe te voegen
            }
        });

        chatVenster.appendChild(input);
    }

    user.forEach(gebruiker => {
        const knop = document.createElement("div");
        knop.classList.add("gebruiker");
        knop.innerHTML = `<img src="${gebruiker.foto}" class="avatar"> ${gebruiker.naam}`;
        knop.addEventListener("click", () => laadChat(gebruiker));
        gesprekkenLijst.appendChild(knop);
    });

    berichtenContainer.appendChild(gesprekkenLijst);
    berichtenContainer.appendChild(chatVenster);
    content.appendChild(berichtenContainer);

    laadChat(gebruikers[0]); // standaard eerste gebruiker tonen
});

/* kalender pagina*/
kalenderBtn.addEventListener("click", () => {
    console.log("Klik op kalender-knop");
    setActiveButton("kalenderBtn");
    content.innerHTML = "";


    const kalenderContainer = document.createElement("div");
    kalenderContainer.classList.add("kalender-container");

    // LINKERKANT: lijst met afspraken
    const afsprakenLijst = document.createElement("div");
    afsprakenLijst.classList.add("afspraken-lijst");

    afsprakenLijst.innerHTML = `
    <h3>afspraken:</h3>
    <p>12:30</p>
    <ul><li>alexandra</li></ul>
    <p>12:45</p>
    <ul><li>Steven</li></ul>
  `;

    // RECHTERKANT: kalender-tabel
    const tableHTML = `
    <table id="kalender-tabel">
      <tr><th>Tijdslot</th><th>Maandag</th><th>Dinsdag</th><th>Woensdag</th><th>Donderdag</th><th>Vrijdag</th></tr>
      <tr><td>09:00</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
      <tr><td>09:15</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
      <tr><td>09:30</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
     
      <tr><td>12:30</td><td>–</td><td><span style="color:lightblue">alexandra</span></td><td>–</td><td>–</td><td>–</td></tr>
      <tr><td>12:45</td><td>–</td><td><span style="color:lightblue">Steven</span></td><td>–</td><td>–</td><td>–</td></tr>
      
    </table>
  `;

    const kalenderTabel = document.createElement("div");
    kalenderTabel.classList.add("kalender-tabel");
    kalenderTabel.innerHTML = tableHTML;

    // Voeg beide zijden toe
    kalenderContainer.appendChild(afsprakenLijst);
    kalenderContainer.appendChild(kalenderTabel);

    // Voeg toe aan content
    content.appendChild(kalenderContainer);
});

function setAfspraak(rowIndex, colIndex, text) {
    const table = document.getElementById("kalender-tabel");
    if (!table) return;
    const row = table.rows[rowIndex];
    if (row && row.cells[colIndex]) {
        row.cells[colIndex].innerText = text;
    }
};

/*code om de page button te onderlijnen */
function setActiveButton(activeId) {
    const buttons = document.querySelectorAll(".center button");
    buttons.forEach(btn => {
        if (btn.id === activeId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}




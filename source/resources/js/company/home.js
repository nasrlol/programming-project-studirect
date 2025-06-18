// home.js

export function loadHomeContent() {
    const content = document.getElementById("content");
    content.innerHTML = "";
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const notificationSection = document.createElement("section");
    notificationSection.classList.add("notifications");

    const title = document.createElement("h2");
    title.textContent = "Welkom op de careerlaunch!";
    notificationSection.appendChild(title);

    const notifications = document.createElement("p");
    notifications.textContent = "Wij zijn verheugd om u te verwelkomen als partner in het begeleiden van de professionals van morgen. Via CareerLaunch krijgt u de kans om uw bedrijf in de kijker te zetten, vacatures te delen en rechtstreeks in contact te komen met gemotiveerde studenten. Samen bouwen we aan de toekomst. Start vandaag nog met het ontdekken van talent!";
    notificationSection.appendChild(notifications);

    const mapSection = document.createElement("section");
    mapSection.classList.add("map");

    const img = document.createElement("img");
    img.src = "/images/plattegrondvb.png";
    img.alt = "venue map";
    mapSection.appendChild(img);

    mainContainer.appendChild(notificationSection);
    mainContainer.appendChild(mapSection);

    content.appendChild(mainContainer);
}

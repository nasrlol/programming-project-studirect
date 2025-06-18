# StuDirect

StuDirect is een Tinder-achtige webapplicatie die studenten en bedrijven met elkaar matcht de carreerlaunch. 
De applicatie is ontwikkeld als onderdeel van het programmeerproject en biedt een aangename gebruikerservaring, moderne technologieën en functies zoals swipen, chatten en profielen.

<p align="center">
  <img src="https://github.com/user-attachments/assets/8a2230b3-5fd6-4c3a-99ef-2bc7d66b84d1" alt="StuDirect UI">
</p>

De backend van deze applicatie is beschikbaar op [nasrlol/studirect-api](https://github.com/nasrlol/studirect-api).

## Functionaliteiten

- Swipe-functionaliteit om studenten en bedrijven te matchen
- Realtime chat tussen gematchte partijen
- Studentprofielen met interesses en cv
- Bedrijfsprofielen met stages, vacatures en algemene informatie
- Gescheiden versies voor mobiel, desktop en admin

## Technische Stack

- Laravel (PHP Framework)
- MySQL database

## Frontend Technologie

- Vite.js
- Blade (via Laravel)


## Installatie


**De installatie van de frontend is nog niet volledig afgerond. De pagina-navigatie werkt deels, maar het correct laden van de juiste pagina's via Laravel-routing moet nog verder onderzocht en uitgewerkt worden.**

1. Repository klonen

```bash
git clone https://github.com/nasrlol/programming-project-studirect
cd programming-project-studirect
```
2. Installatie

```bash
cd source 
npm install
npm run build
composer install
mv .env.example ./env
```

Hierna wordt u verwacht XAMPP te installeren (link: https://sourceforge.net/projects/xampp/), of het op een webserver te runnen.
Installatieinstructies voor de backend te vinden via https://github.com/nasrlol/studirect-api.

3. Starten
```bash
php artisan serve
```


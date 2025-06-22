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
(zie dat PHP geïnstalleerd is, en dat in php.ini extension=gd en extension=fileinfo geïnstalleerd zijn.)
composer install
mv .env.example ./env
```

Installatieinstructies voor de backend te vinden via https://github.com/nasrlol/studirect-api.

3. Starten
```bash
php artisan serve
```

## Bronnen

Voor het maken van deze site hebben we gebruik gemaakt van de volgende bronnen:

Bij aanmaken MessageController.php
https://chatgpt.com/share/684fd09e-f0c0-8005-90e4-9f3e6d9cbdee

source/resources/js/admin/js lijn 345: 
https://stackoverflow.com/questions/15843581/how-to-correctly-iterate-through-getelementsbyclassname

Laravel tutorial: https://www.youtube.com/playlist?list=PLqDySLfPKRn5d7WbN9R0yJA9IRgx-XBlU
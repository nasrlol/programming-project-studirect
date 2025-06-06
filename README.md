# StuDirect

StuDirect is een Tinder-achtige webapplicatie die studenten en bedrijven met elkaar matcht de carreerlaunch. 
De applicatie is ontwikkeld als onderdeel van het programmeerproject en biedt een aangename gebruikerservaring, moderne technologieën en functies zoals swipen, chatten en profielen.

![StuDirect UI](https://github.com/user-attachments/assets/8a2230b3-5fd6-4c3a-99ef-2bc7d66b84d1)

## Functionaliteiten

- Swipe-functionaliteit om studenten en bedrijven te matchen
- Realtime chat tussen gematchte partijen
- Studentprofielen met interesses en cv
- Bedrijfsprofielen met stages, vacatures en algemene informatie
- Gescheiden versies voor mobiel, desktop en admin

## Technische Stack

- Laravel (PHP Framework)
- MySQL database

## Installatie

### 1. Repository klonen

```bash
git clone https://github.com/nasrlol/studirect
cd studirect

2. installeren (Laravel)

cd source 
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

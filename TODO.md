# Dashboard Alerts & Notes Implementation - Approved Plan

## Step 1: ✅ Create TODO.md 

## Step 2: ✅ Enhance alertStore.js logic
- ✅ Update checkAlerts() for 7-day windows on assurance/visite
- ✅ Add 500km vidange threshold  
- ✅ Add category: 'voitures' filter
- ✅ Add voituresAlerts() getter

## Step 3: ✅ Update NewDashboardView.vue (Primary target)
- ✅ Alertes Voitures: Inline voitures filter computed (store getter fixed), dynamic list/badge/count, scrollable
- ✅ Notes: Local state array, localStorage 'dashboardNotes', add/delete funcs, UI list/input/button

## Step 4: Skip - DashboardView.vue already uses alertStore.totalAlerts with badge

## Step 5: Test & Verify
- Alerts populate on dashboard load
- Thresholds: 7 days, 500km correct
- Notes persist, add/delete work

## Step 6: attempt_completion


### ----------------------
## Voiture Done



  ## visite technique Done


  ## assurance Done
  

### ----------------------
## Clients Done

### ----------------------
## Nouvel agence Done

### ----------------------
## user managment Done

### ----------------------
## entretiens Done
## contrats
dropdown as véhicules that will contains:
==> Nouvelle Contrat
Heading: Informations Clients:
-dropdown client to select client
Heading: Information Contrat:
- N° de contrat:can be manuel so user can create what he like but make sure to be unique or add generate button to will generate it like 1/2026 so it is idcontrat/Year, idcontrat is datetimeNow/year 
-date de contrat user will choose date with time(h,m)
- lieu de contrat (auto fill by agence ville)
-date de sortir user will choose date with time(h,m)
-date de retour user will choose date with time(h,m)
- durée (jours) auto calcul (date de retour - date de sortir: calcule days)
-lieu livraison (dropdown list de villes and add ability to search filtre)
-lieu de récuperation (dropdown list de villes and add ability to search filtre)
-Matricule (dropdown select cars related to the agency)
-when matriculr select so autofill the followinf fields:
-véhicule
-prix par jour (ability to edit)
-km de départ (car current km and add ability to edit)
-carburant de départ (reserve,1/4,1/2,3/4,plein)
-avance
-total:autocalcul
-rest
-type de paiment(espece,cheque .... as you did before)
-etat:En cours / Retournée (checkboxes)
-deuxieme conducteur (if checkbox checked)
-Équipements inclus: display selected car équipements
-when click save check if any paper of car will be ended during rent périod like: visite technique,assurance,vidange (take km de départ + Kilométrage moyen/jour (already exists in car infos) need to be <  Prochaine vidange (km)
 + 500km)
 if any kind of alert show popup to let user know about paper or car entretiens issue will faced during the rent period (if user click confirm so continue normal and create contrat)
 -provide me contrat that include all information you have (agency logo,email,tel.... and client information include 2eme conducteur infos if available and make the contrat using html css so we can prepare the model later when you achieve that)
==>Liste Contrats:table that contains all informations with action(show,edit,delete,imprimer)


## TODO :

- make sure on traites ( to be reflect what in car, please handle it to be easy for use and make sure traite is handled in alerts)
-in dashboard addanalytics as shopify : Admin will see all agences compared by color
-> Gérant will see carscompares to know the car type most rent
## new features to be work on:


,taches,contrats,factures,accidents,vercements,financements,traits,statistiques,tapports,
option de chat between eployee
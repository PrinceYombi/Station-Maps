var APP = {
    API_STATION: "/api/stations.json",
    MAP: L.map('map').setView([47.49163, 4.33834], 9),
    MAKER : [],
    API_STATION_FIREBASE : "https://station-maps-6a34b-default-rtdb.firebaseio.com/station-maps.json",
    /**
     * 
     * @param {Event} e 
     * AFFICHER ET CACHER LE MENU
     */
    toggleNav: (e) => {

        document.getElementById('menu').classList.toggle('none')
    },

    setDetails: (fields) => {
        //console.log(fields);
        const {hdebut, hfin} = fields
        let horaire
        hdebut === hfin ? horaire = '24h/24' : horaire = hdebut+ " à "+hfin

        let { carburants, services} = fields
        carburants = carburants ?  "<li>"+carburants.split('|').join('<li></li>')+"</li>" : ""
        services = services ?  "<li>"+services.split('|').join('<li></li>')+"</li>" : ""

        let template = `
       <div class="station-cover">
       <img src="${fields.imageURL}" width="100%" alt="">
   </div>
   <div class="station-title">
      <h2> ${fields.name}</h2>
   </div>
   <div class="station-reviews flex gap-10 p-10">
       <div class="reviews-note">4.3</div>
       <div class="reviews-start">
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
       </div>
       <div class="reviews-resume">
          ${fields.countNotes} avis
       </div>
   </div>
   <div class="station-actions flex p-10">
       <div class="station-action-item flex column flex-1 aic">
           <i class="fas fa-road"></i>
           <span>Itinéraires</span>
       </div>
       <div class="station-action-item flex column flex-1 aic">
           <i class="fas fa-save"></i>
           <span>Enrégistrer</span>
       </div>
       <div class="station-action-item flex column flex-1 aic">
           <i class="fas fa-street-view"></i>
           <span>Proximité</span>
       </div>
       <div class="station-action-item flex column flex-1 aic">
           <i class="fas fa-mobile-alt"></i>
           <span>Phone</span>
       </div>
       <div class="station-action-item flex column flex-1 aic">
           <i class="fas fa-share-alt"></i>
           <span>Partager</span>
       </div>
   </div>
   <div class="station-description p-10">
      ${fields.description}
   </div>
   <div class="station-services p-10">
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/adresse.svg" width="50" height="50" alt="">
           <strong>Adresse : </strong>
           <span class="flex-1">${fields.adresse} <strong>${fields.codepostal}</strong> ${fields.commune}</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/phone.svg" width="50" height="50" alt="">
           <strong>Télephone : </strong>
           <span class="flex-1">+242 06 433 9009</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/horaire.svg" width="50" height="50" alt="">
           <strong>Horaire : </strong>
           <span class="flex-1">${horaire}</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/carburant.svg" width="50" height="50" alt="">
           <strong>Carburant : </strong>
           <ul class="flex-1">
               ${carburants}
           </ul>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/route.svg" width="50" height="50" alt="">
           <strong>Route : </strong>
           <span class="flex-1">A proximité d'autoroute</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/service.svg" width="50" height="50" alt="">
           <strong>Service : </strong>
           <ul class="flex-1">
               ${services}
           </ul>
       </div>
   </div>
       `
       
       let nav = document.querySelector('nav')
       nav.classList.contains('none') ? nav.classList.toggle('none') : null
       nav.innerHTML = template
       nav.scrollTop = 0 //Diriger l'ascensseur toujours en haut
    },

    messagePopup: (fields) => {


        let div = document.createElement('div')
        let button = document.createElement('button')
        div.className = "station-popup"
        div.innerHTML = `
        <strong>Nom : ${fields.name}</strong><br>
        <strong>Adresse : ${fields.adresse}</strong><br>
        <strong>Code Postal : ${fields.codepostal}</strong><br>
        
        `
        button.innerHTML = "En savoir plus"
        button.className = "btn-about-station"

        button.onclick = () => {

            //
            APP.setDetails(fields)
        }

        div.appendChild(button)

        return div
    },

    filterStations : (event)=>{

        let tag = event.target.value.trim()

        let stations = JSON.parse(localStorage.getItem("stations"))

        if (!tag) {
            
            APP.hideSuggestion()

            return;
        }

        stations = stations.filter(({fields})=>{

            tag = tag.toLowerCase()

            key_one = fields.name.toLowerCase()
            key_two = fields.adresse.toLowerCase()

            if (key_one.search(tag) >0 || key_two.search(tag) >0) {
                
                return true
            }

            return false
        })

        APP.autoComplate(stations)

    },

    autoComplate : (stations)=>{
        let container = document.querySelector('.search-bar-suggestion')
        container.innerHTML = ''

        //Affichage de la boite d'autocomplation
        container.classList.contains('none') ? container.classList.toggle('none') : null

        if (!stations.length) {
            
            container.innerHTML = `<div class="suggestion-item">Aucun resultat ne correspond à votre récherche</div>`

            return
        }

        stations = stations.slice(0, 15) //15 elements sur l'ensemble du tableau

        stations.forEach(({fields}) => {
            let div = document.createElement('div')
            div.className = "suggestion-item"

            div.innerHTML = `${fields.adresse} <trong> ${fields.adresse}</trong>
            <trong> ${fields.commune}</trong>`

            container.appendChild(div)
         
            div.onclick = ()=>{

                APP.setDetails(fields)
                APP.hideSuggestion()

                let maker = APP.MAKER.filter(e => e._id === fields._id)[0].maker
                maker.openPopup()

                //console.log(maker);
            }

        });
    },

    hideSuggestion : ()=>{

        let container = document.querySelector('.search-bar-suggestion')

        if (!container.classList.contains('none')) {
            container.classList.add('none')

        }
    },


}


/**
 * LES ABONNEMENTS
 */
var setupListener = () => {

    document.getElementById('bars').onclick = APP.toggleNav

    document.querySelector('input').oninput = APP.filterStations

    document.querySelector('input').onmouseover = APP.filterStations

    document.querySelector('.search-bar-suggestion').onmouseleave = APP.hideSuggestion


}



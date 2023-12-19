

/**
 * Fonction de recuperation des stations
 * 
 * @returns station
 */
var getStations = async()=>{

    let response = await fetch(APP.API_STATION)
    //let response = await fetch(APP.API_STATION_FIREBASE)

    if (!response.ok) {
        
        throw new Error('Erreur de recupération des données')
    }

    let stations = await response.json()

    //saveData(stations)

    return stations.slice(0, 1000)
}


var initMarkers = async()=>{

    let stations = await getStations()

    stations = stations.filter((station)=>{
        if (station.fields) {
            if (station.fields.latlng) {
                return true
            }
        }

        return false
    })

    localStorage.setItem('stations', JSON.stringify(stations))

    stations.forEach(({fields}) => {

        let popupMessage = APP.messagePopup(fields)
        
        let maker = L.marker(fields.latlng)
        .on('click', ()=>{
            APP.MAP.setView(fields.latlng, 11)
        })
        .addTo(APP.MAP)
        .bindPopup(popupMessage);
          //marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

          APP.MAKER.push({
            _id : fields._id,
            maker : maker,
          })
    });



    console.log(stations[15].fields.latlng);

    //Center suivant les coordonnées en 1er paramettre
    APP.MAP.setView(stations[15].fields.latlng, 9)

   // return stations
}



var initMaps = () => {

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

    }).addTo(APP.MAP);

    initMarkers()
    .then(()=>{
        console.log("Initialisation des markers");
    })
    .catch(()=>{
        console.log("Probleme d'initialisation des markers");
    })

}

/**
 * Envoyer des données au serveur
 * 
 * @param {Array} data 
 * @returns {data}
 */
var saveData = async(data)=>{

    var response = await fetch(APP.API_STATION_FIREBASE, {

        method : "PUT",
        body : JSON.stringify(data)
    })

    if (!response.ok) {
        
        throw new Error('Erreur de sauvegarde des données')
    }

    let result = await response.json()

    return result
}










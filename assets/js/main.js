window.onload = ()=>{

    setupListener()

    //INITIALISATION DE LA CARTE
    initMaps()

    //RECUPERATION DES DONNEES
    getStations()
    .then((response)=>{
        //console.log(response);
    })
    .catch((error)=>{
        console.log(error);
    })


    /*LES MARKERS
    initMarkers()
    .then((response)=>{
        console.log(response);
    })
    .catch((error)=>{
        console.log(error);
    })
    */
}




















//luodaan nappi ja lista johon tulostetaan haun tulokset
const nappi = document.querySelector('button');
const nappi2 = document.getElementById('button2');
const ul = document.getElementById("list");
// liitetään kartta elementtiin #map
var map = L.map('map');
const layerGroup = L.layerGroup().addTo(map);

//aloitetaan haku
function haku() {
  //muutetaan kartta-elementti näkyväksi
  document.querySelector('#muuta').setAttribute('class', 'visible');
  //tyhjennetään ensin mahdollinen edellinen haku
  ul.innerHTML = '';
  //haetaan hakukentän teksti muuttujaan
  const hakuteksti = document.querySelector('input[name=hakuteksti]');
  //haetaan songkickistä artistin ID
  fetch('https://api.songkick.com/api/3.0/search/artists.json?apikey=f5qqtnmlmZfbfrV5&query=' + hakuteksti.value)
  .then(response => response.json()) //muutetaan tulos JSON muotoon
  .then(data => haeKeikat(data)) //lähetetään saatu data seuraavalle funktiolle, joka hakee artistin keikat
}

function haeKeikat(data) {
  //haetaan artistin id edellisen haun tuloksista
  const artistId = data.resultsPage.results.artist[0].id;
  //haetaan artistin ID:llä artistin keikat ja muut tiedot
  fetch('https://api.songkick.com/api/3.0/artists/' + artistId + '/calendar.json?apikey=f5qqtnmlmZfbfrV5')
  //tulos JSON muotoon
  .then(response => response.json())
  //lähetetään tulos seuraavalle funktiolle
  .then(data => naytaTulos(data))
}

var haettuData;

//tällä funktiolla muokataan HTML:ää ja näytetään sivulla tulokset
function naytaTulos(data) {

  haettuData = data;

  //käydään keikat läpi
  for (let i = 0; i < data.resultsPage.results.event.length; i++) {

    //varaudutaan virheisiin
    try {

      //haetaan data-oliosta kaupunki -tieto
      const kaupunki = data.resultsPage.results.event[i].location.city;
      //haetaan venue
      const venue = data.resultsPage.results.event[i].venue.displayName;
      //haetaan pvm
      const pvm = data.resultsPage.results.event[i].start.date;

      //luodaan elementti, johon kaupunki -tieto asetetaan
      const kaupunkiHTML = document.createElement('h2');
      kaupunkiHTML.innerText = kaupunki;
      const pvmHTML = document.createElement('h4');
      pvmHTML.innerText = pvm;
      const venueHTML = document.createElement('h3');
      venueHTML.innerText = venue;

      const li = document.createElement('li');
      li.appendChild(pvmHTML);
      li.appendChild(kaupunkiHTML);
      li.appendChild(venueHTML);
      ul.appendChild(li);

      keikkapaikat(data);

    } catch (err) {
      document.getElementById("demo").innerHTML = err.message;
    }


  }

  fiksaaKartta();

}

function fiksaaKartta() {
  // maikan sähköautosovelluksesta kopioitua logiikkaa

  // tallennetaan oma paikka
  let paikka = null;

  // käytetään openstreetmapia
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Asetukset paikkatiedon hakua varten (valinnainen)
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  //haetaan oma sijainti
  navigator.geolocation.getCurrentPosition(success, error, options);
}

var omaPaikkaAlussa = '';

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
  paikka = pos.coords;
  omaPaikkaAlussa = paikka;
  const punainenIkoni = L.divIcon({className: 'punainen-ikoni'});

  // Tulostetaan paikkatiedot konsoliin
  console.log('Your current position is:');
  console.log(`Latitude : ${paikka.latitude}`);
  console.log(`Longitude: ${paikka.longitude}`);
  console.log(`More or less ${paikka.accuracy} meters.`);
  naytaKartta(paikka);
  lisaaMarker(paikka, 'Sijaintini maailmassa', punainenIkoni);
}

function naytaKartta(crd) {
  // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
  map.setView([crd.latitude, crd.longitude], 6);
}

function lisaaMarker(crd, teksti, ikoni) {
  const navigoi = document.querySelector('#navigoi a');
  L.marker([crd.latitude, crd.longitude], {icon: ikoni}).
      addTo(layerGroup).
      bindPopup(teksti).
      openPopup().
      on('popupopen', function(popup) {
        navigoi.href = `https://www.google.com/maps/dir/?api=1&origin=${paikka.latitude},
        ${paikka.longitude}&destination=${crd.latitude},${crd.longitude}&travelmode=driving`;
      });
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function keikkapaikat(data) {
    for (let i = 0; i < data.resultsPage.results.event.length; i++) {
      const teksti = data.resultsPage.results.event[i].venue.displayName;
      const vihreaIkoni = L.divIcon({className: 'vihrea-ikoni'});

      const koordinaatit = {
        latitude: data.resultsPage.results.event[i].location.lat,
        longitude: data.resultsPage.results.event[i].location.lng,
      };

      lisaaMarker(koordinaatit, teksti, vihreaIkoni, keikkapaikat[i]);
    }
}

function poistaMarkerit(){
  layerGroup.clearLayers();
}

function hakuJaClearaus(){
  poistaMarkerit(); //poistaa markerit
  haku(); //aloittaa bändin haun ja kartan piirtämisen
}

function haeKokoReitti() {

  console.log("funtiota kutsuttu");

  let reittiString = 'https://www.google.com/maps/dir/';

  reittiString += omaPaikkaAlussa.latitude + ',';
  reittiString += omaPaikkaAlussa.longitude + '/';

  for (let i = 0; i < haettuData.resultsPage.results.event.length; i++) {
    reittiString += haettuData.resultsPage.results.event[i].location.lat + ',';
    reittiString += haettuData.resultsPage.results.event[i].location.lng + '/';
  }

  reittiString += omaPaikkaAlussa.latitude + ',';
  reittiString += omaPaikkaAlussa.longitude + '/';

  console.log(reittiString);

  window.open(reittiString, '_blank');

}

nappi.onclick = hakuJaClearaus;
nappi2.onclick = haeKokoReitti;


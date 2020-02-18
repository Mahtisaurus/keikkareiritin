#Keikkareititin 1.0

Linkki sovellukseen: https://keikkareititin.plutonium74.com

Metropolian Web-tekniikat -toteutuksen projekti

Idea: sovellus etsii lempibändin keikat ja antaa reittiohjeet keikoille menoa varten

1. Syötetään bändin nimi hakukenttään
2. Sovellus hakee Songkick API:sta bändin keikat
3. Asetetaan karttaan markerit keikkapaikoista
4. Jos käyttäjä valitsee kartalta keikkapaikan ja painaa "navigoi" -nappia, sovellus avaa uuden ikkunan Google mapsiin, 
missä reittiohjeet keikkapaikalle.
5. Jos käyttäjä painaa "Hae koko kiertueen reitti" -nappia, sovellus avaa uuden ikkunan Google mapsiin, missä reittiohjeet 
kaikille keikkapaikoille sekä takaisin käyttäjän sijaintiin.

Käytettävät APIt
- Openstreetmap
- Songkick

Käytettävät JS-kirjastot
- Leaflet.js

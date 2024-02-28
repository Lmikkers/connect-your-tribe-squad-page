// 1. Opzetten van de webserver

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad')
const personData = await fetchJson(apiUrl + '/person') // TOEGEVOEGD VAN ZOE

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))


// 2. Routes die  HTTP Request and Responses afhandelen
// Voor de messages
const messages = []

// Maak een GET route voor de index
// Stap 1
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  // Stap 2
  fetchJson(apiUrl + '/person').then((apiData) => { // apidata kan persons worden
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view
    // Stap 3
    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    
    // Stap 4
    // HTML maken op basis van JSON data (index.ejs)
    response.render('index', 
      {persons: apiData.data, 
        squads: squadData.data,
        messages: messages
      })
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Voeg het nieuwe bericht toe aan de message array
  messages.push(request.body.bericht)
  messages.push(request.body.name)

  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', 
    {
      person: apiData.data,
      squads: squadData.data,
      messages: messages
    })
  })
})


// SQUAD (NIEUW)
// Maak een GET route voor een squad detailpagina met een request parameter id
// app.get('/squad/:id', function (request, response) {
//   // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
//   fetchJson(apiUrl + '/squad/' + request.params.id).then((apiData) => {
//     // Render squad.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd squad
//     response.render('squad', {squad: apiData.data, person: apiData.data, squads: squadData.data})
//   })
// })

app.get('/squad/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/squad/' + request.params.id).then((apiData) => {
    fetchJson(apiUrl + '/person?filter[squad_id]=' + request.params.id).then((personData) => {
      // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
      response.render('squad', {squad: apiData.data, persons: personData.data, squads: squadData.data})
    })
  })
})







// Maak een GET route voor find/filter dingen (NIEUW)
app.get('/filter/:q', function (request, response) {
  console.log(request.params.q)
  // Gebruik de request parameter filter en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/?filter=' + request.params.q).then((apiData) => {
    // Render filter.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('filter', {persons: apiData.data, squads: squadData.data})
  })
})
// HIER BOVEN IS (NIEUW)


// 3. Start de webserver

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

console.log("Dit is de server");
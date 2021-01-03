var socket_io = require("socket.io");
var io = socket_io();
var socketAPI = {};
const path = require("path");
const fs = require("fs");
var connectedUsers = 0;

//Verbindungen zu Clients
io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  console.log(++connectedUsers +" clients connected");

  socket.on("disconnect", (reason)=>{
    console.log(socket.id +" disconnected, because: " +reason);
    console.log(--connectedUsers +" clients connected after disconnect");
    socket.removeAllListeners();
  });

  //Client fordert Artikelliste an, Server sendet sie diesem Client
  socket.on("holeArtikelliste", () =>
    socket.emit("artikelListe", holeBestandsdaten())
  );

  socket.on("error",(errMsg)=>{
    console.log("FEHLER!!!!"+errMsg);
  });

  //Client sendet neuen / veraenderten Artikel
  socket.on("artikel", (artikel) => {
    verarbeiteNeueDaten(artikel);
  });

  //Client hat Artikel geloescht, Mitteilung an alle Clients diesen Artikel (Id) zu loeschen
  socket.on("artikelLoeschenS", (id) => {
    console.log("versuche zu loeschen: "+ id);
    loescheArtikel(id);
    console.log("geloescht: "+id)
  });
});

//JSON Daten werden von Festplatte eingelesen
function holeBestandsdaten() {
  const rohdaten = fs.readFileSync(
    path.join(__dirname, "..", "data", "listen.json")
  );

  return JSON.parse(rohdaten);
}

//Verarbeitung des Artikels (einfuegen falls neu, ueberschreiben falls schon verfuegbar)
//neuen Artikel an alle verbundene Clients schicken
function verarbeiteNeueDaten(artikel) {
  const bestand = holeBestandsdaten();
  let artikelId;

  bestand == "" ? (artikelId = 0) : (artikelId = holeLetzteId(bestand));

  if (artikel["id"] === "") {
    artikel["id"] = ++artikelId;
    bestand.push(artikel);
    aktualisiereBestandsliste(bestand);
  } else {
    artikelAendern(artikel, bestand);
  }
  io.emit("artikel", artikel);
}

//Artikel mit passender Id loeschenschen
function loescheArtikel(id) {
  const bestand = holeBestandsdaten();

  for (let i = 0; i < bestand.length; i++) {
    if (bestand[i]["id"] == id) {
      io.emit("artikelLoeschenC", id);
      bestand.splice(i, 1);
      break;
    }
  }

  aktualisiereBestandsliste(bestand);

  // io.emit("artikelLoeschen", id);
}

//gibt zuletzt verwendete Id zurueck
function holeLetzteId(bestand) {
  return bestand[bestand.length - 1]["id"];
}

//ueberschreibt im Bestand gewuenschten Artikel mit neuem Artikel (gleiche Id)
function artikelAendern(artikel, bestand) {
  const suchbegriffe = [
    "id",
    "name",
    "hersteller",
    "einkaufspreis",
    "verkaufspreis",
    "kategorie",
    "stueckzahl",
  ];

  for (let i = 0; i < bestand.length; i++) {
    if (bestand[i]["id"] == artikel["id"]) {
      suchbegriffe.forEach(
        (element) => (bestand[i][element] = artikel[element])
      );
    }
  }

  aktualisiereBestandsliste(bestand);
}

//schreibt neue Bestandsliste auf die Festplatte
function aktualisiereBestandsliste(bestandsliste) {
  const daten = JSON.stringify(bestandsliste);
  fs.writeFileSync(path.join(__dirname, "..", "data", "listen.json"), daten);
}

socketAPI.io = io;
module.exports = socketAPI;

var socket_io = require("socket.io");
var io = socket_io();
var socketAPI = {};
const path = require("path");
const fs = require("fs");
socketAPI.io = io;

io.on("connection", (socket) => {
  socket.emit("artikelListe", holeBestandsdaten());
  // sendeArtikelliste(socket);

  socket.on("artikel", (artikel) => {
    verarbeiteNeueDaten(artikel);
    // const neueArtikeldaten = JSON.parse(artikel);
    // const bestand = holeBestandsdaten();
    // let artikelId = holeLetzteId(bestand);
    // if (neueArtikeldaten["id"] === "") {
    //   neueArtikeldaten["id"] = ++artikelId;
    //   bestand.push(neueArtikeldaten);
    //   aktualisiereBestandsliste(bestand);
    // } else {
    //   artikelAendern(neueArtikeldaten, bestand);
    // }
  });

  socket.on("artikelLoeschen", (id) => {
    loescheArtikel(id);

    io.emit("artikelLoeschen", id);
  });
});

// function sendeArtikelliste(socket) {
//   socket.emit("artikelListe", holeBestandsdaten());
// }

function holeBestandsdaten() {
  const rohdaten = fs.readFileSync(
    path.join(__dirname, "..", "data", "listen.json")
  );

  return JSON.parse(rohdaten);
}

function verarbeiteNeueDaten(artikel) {
  const neueArtikeldaten = JSON.parse(artikel);
  const bestand = holeBestandsdaten();
  let artikelId;

  bestand == "" ? (artikelId = 0) : (artikelId = holeLetzteId(bestand));

  if (neueArtikeldaten["id"] === "") {
    neueArtikeldaten["id"] = ++artikelId;
    bestand.push(neueArtikeldaten);
    aktualisiereBestandsliste(bestand);
  } else {
    artikelAendern(neueArtikeldaten, bestand);
  }
}

function loescheArtikel(id) {
  const bestand = holeBestandsdaten();

  for (let i = 0; i < bestand.length; i++) {
    if (bestand[i]["id"] == id) {
      bestand.splice(i, 1);
      break;
    }
  }

  aktualisiereBestandsliste(bestand);
}

function holeLetzteId(bestand) {
  return bestand[bestand.length - 1]["id"];
}

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
      suchbegriffe.forEach((element) => {
        bestand[i][`${element}`] = artikel[`${element}`];
      });

      // bestand[i]["name"] = artikel["name"];
      // bestand[i]["hersteller"] = artikel["hersteller"];
      // bestand[i]["einkaufspreis"] = artikel["einkaufspreis"];
      // bestand[i]["verkaufspreis"] = artikel["verkaufspreis"];
      // bestand[i]["kategorie"] = artikel["kategorie"];
      // bestand[i]["stueckzahl"] = artikel["stueckzahl"];
      // console.log("id gefunden...updating...");
      break;
    }
  }
  aktualisiereBestandsliste(bestand);
}

function aktualisiereBestandsliste(bestandsliste) {
  const daten = JSON.stringify(bestandsliste);
  fs.writeFileSync(path.join(__dirname, "..", "data", "listen.json"), daten);
}

module.exports = socketAPI;

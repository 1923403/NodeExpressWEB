var socket_io = require("socket.io");
var io = socket_io();
var socketAPI = {};
const path = require("path");
const fs = require("fs");

io.on("connection", (socket) => {
  socket.emit("artikelListe", holeBestandsdaten());
  console.log("NEUE VERBINDUNG");

  socket.on("artikel", (artikel) => verarbeiteNeueDaten(artikel));

  socket.on("disconnect", (reason) => {
    console.log("disconnected... because " + reason);
  });

  socket.on("artikelLoeschen", (id) => loescheArtikel(id));
});

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

  io.emit("artikelLoeschen", id);
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
      console.log(bestand[i]["id"] == artikel["id"]);
      suchbegriffe.forEach(
        (element) => (bestand[i][element] = artikel[element])
      );
    }
  }
  aktualisiereBestandsliste(bestand);
}

function aktualisiereBestandsliste(bestandsliste) {
  const daten = JSON.stringify(bestandsliste);
  fs.writeFileSync(path.join(__dirname, "..", "data", "listen.json"), daten);
}

socketAPI.io = io;
module.exports = socketAPI;

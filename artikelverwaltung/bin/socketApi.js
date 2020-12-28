var socket_io = require("socket.io");
var io = socket_io();
var socketAPI = {};
const path = require("path");
const fs = require("fs");
socketAPI.io = io;

io.on("connection", (socket) => {
  sendeArtikelliste(socket);
  socket.on("artikel", (artikel) => {
    const neueArtikeldaten = JSON.parse(artikel);
    const bestand = holeBestandsdaten();
    let artikelId = holeLetzteId(bestand);
    if (neueArtikeldaten["id"] === "") {
      neueArtikeldaten["id"] = ++artikelId;
      bestand.push(neueArtikeldaten);
      aktualisiereBestandsliste(bestand);
    } else {
      artikelAendern(neueArtikeldaten, bestand);
    }
  });

  socket.on("artikelLoeschen", (id) => {
    console.log("artikel löschen");
    const bestand = holeBestandsdaten();
    loescheArtikel(bestand, id);
    io.emit("artikelLoeschen", id);
  });
});

function artikelAendern(artikel, bestand) {
  for (let i = 0; i < bestand.length; i++) {
    if (bestand[i]["id"] == artikel["id"]) {
      bestand[i]["name"] = artikel["name"];
      bestand[i]["hersteller"] = artikel["hersteller"];
      bestand[i]["einkaufspreis"] = artikel["einkaufspreis"];
      bestand[i]["verkaufspreis"] = artikel["verkaufspreis"];
      bestand[i]["kategorie"] = artikel["kategorie"];
      bestand[i]["stueckzahl"] = artikel["stueckzahl"];
      console.log("id gefunden...updating...");
      break;
    }
  }
  aktualisiereBestandsliste(bestand);
}

function sendeArtikelliste(socket) {
  socket.emit("artikelListe", holeBestandsdaten());
}

function loescheArtikel(bestand, id) {
  console.log("lösche" + id);
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

function holeBestandsdaten() {
  const rohdaten = fs.readFileSync(
    path.join(__dirname, "..", "data", "listen.json")
  );
  return JSON.parse(rohdaten);
}

function aktualisiereBestandsliste(bestandsliste) {
  const daten = JSON.stringify(bestandsliste);
  fs.writeFileSync(path.join(__dirname, "..", "data", "listen.json"), daten);
}

module.exports = socketAPI;

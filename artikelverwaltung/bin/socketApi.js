var socket_io = require("socket.io");
var io = socket_io();
var socketAPI = {};
const path = require("path");
const fs = require("fs");
socketAPI.io = io;

let artikelId = 0;
let listenId = 0;

io.on("connection", (socket) => {
  socket.on("artikel", (artikel) => {
    const neueArtikeldaten = JSON.parse(artikel);
    const bestand = holeBestandsdaten();

    if (neueArtikeldaten["id"] === "") {
      neueArtikeldaten["id"] = artikelId;
      artikelId++;
      bestand.push(neueArtikeldaten);
      aktualisiereBestandsliste(bestand);
    } else {
    }

    // parsedData = JSON.parse(artikel);
    // if (parsedData["id"] === "") {
    // UEBERARBEITEN!!!!!!!!!!!!!!!!!
    // parsedData["id"] = Math.floor(Math.random() * 10000);
    //   parsedData["id"] = artikelId;
    // } else {
    //   console.log("suche id");
    //   let artikelId2 = parsedData["id"];
    //   console.log(`artikelID2: ${artikelId2}`);
    //   console.log(rohdaten);
    //rohdaten fehlerhaft...überarbeiten...
    // rohdaten = JSON.parse(rohdaten);
    // console.log(rohdaten);
    // sucheArtikel(rohdaten, artikelId2);
    // }
    // console.log(parsedData["name"]);

    // jsonAusgeben(JSON.parse(artikel));
    // artikelliste = JSON.parse(rohdaten);
    // console.log(artikelliste);
    // artikelliste2 = JSON.stringify(artikelliste);
    // listenSpeichern(artikelliste2);
  });
});

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

function sucheArtikel(json, id) {
  console.log(typeof json);
  Object.entries(json).forEach(([key, value]) => {
    console.log(key);
    if (key === "id") {
      console.log("key gefunden...");
      if (value === id) {
        console.log("ID vorhanden");
      }
    }
  });
}

function listenSpeichern(daten) {
  fs.writeFile(
    path.join(__dirname, "..", "data", "listen2.json"),
    daten,
    (err) => {
      if (err) throw err;
      console.log("Artikellisten wurden gespeichert...");
    }
  );
}

function jsonAusgeben(json) {
  console.log(typeof json);
  Object.entries(json).forEach(([key, value]) => {
    console.log(`${key} ${value}`);
  });
}

module.exports = socketAPI;

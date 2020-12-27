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

  socket.on("artikelLoeschen", (id) => {
    console.log("artikel löschen");
    const bestand = holeBestandsdaten();
    loescheArtikel(bestand, id);
  });
});

function artikelAendern(artikel, bestand){
  for(let i = 0; i < bestand.length; i++){
    if(bestand[i]["id"] == artikel["id"]){
      bestand[i]["name"] = artikel["name"];
      bestand[i]["hersteller"] = artikel["hersteller"];
      bestand[i]["einkaufspreis"] = artikel["einkaufspreis"];
      bestand[i]["verkaufspreis"] = artikel["verkaufspreis"];
      //bestand[i]["beschreibung"] = artikel["beschreibung"];
      bestand[i]["kategorie"] = artikel["kategorie"];
      bestand[i]["stueckzahl"] = artikel["stueckzahl"];
      //bestand[i]["verfuegbar-seit"] = artikel["verfuegbar-seit"];
      // bestand[i].forEach(([key, value]) => {
        //   console.log(key + " " + value)
        // })
        // artikel.forEach(([key, value])=>{
          //   console.log("key"+key)
          //bestand[i][key] = artikel[key];
          //});
          console.log("id gefunden...updating...")
          break;
        }
      }
            aktualisiereBestandsliste(bestand);
}

function sendeArtikelliste(socket){
  // const user = await fetchUserId(socket);
  // socket.join(user);
  // io.to(user).emit("artikelliste", holeBestandsdaten());
  socket.emit("artikelListe", holeBestandsdaten());
}

function loescheArtikel(bestand, id) {
  console.log("lösche"+id);
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

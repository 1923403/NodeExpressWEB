const socket_io = require("socket.io");
const io = socket_io();
const socketAPI = {};
const path = require("path");
const fs = require("fs");

console.log("Server startet...");

// Verbindungen zu Clients
io.on("connection", (socket) => {
  // Client fordert Artikelliste an, Server sendet sie diesem Client
  socket.on("holeArtikelliste", () =>
    socket.emit("artikelliste", holeBestandsdaten())
  );

  // Client sendet neuen / veraenderten Artikel
  socket.on("artikel", (artikel) => {
    verarbeiteNeueDaten(artikel, socket);
  });

  // Client hat Artikel geloescht, Mitteilung an alle Clients diesen Artikel (Id) zu loeschen
  socket.on("artikelLoeschen", (id) => loescheArtikel(id, socket));
});

// JSON-Daten werden von Festplatte eingelesen
function holeBestandsdaten() {
  const rohdaten = fs.readFileSync(
    path.join(__dirname, "..", "data", "listen.json")
  );
  return JSON.parse(rohdaten);
}

// Verarbeitung des Artikels (einfuegen falls neu, ueberschreiben falls schon verfuegbar)
// neuen Artikel an alle verbundenen Clients schicken
function verarbeiteNeueDaten(artikel, socket) {
  const bestand = holeBestandsdaten();
  let artikelId;

  bestand == "" ? (artikelId = 0) : (artikelId = holeLetzteId(bestand));

  if (artikel["id"] === "") {
    artikel["id"] = ++artikelId;
    bestand.push(artikel);
    aktualisiereBestandsliste(bestand);
    io.emit("artikel", artikel);
  } else {
    artikelAendern(artikel, bestand);
    socket.broadcast.emit("artikel", artikel);
  }
}

// Artikel mit passender Id loeschen
function loescheArtikel(id, socket) {
  const bestand = holeBestandsdaten();

  for (let i = 0; i < bestand.length; i++) {
    if (bestand[i]["id"] == id) {
      socket.broadcast.emit("artikelLoeschen", id);
      bestand.splice(i, 1);
      break;
    }
  }

  aktualisiereBestandsliste(bestand);
}

// gibt zuletzt verwendete Id zurueck
function holeLetzteId(bestand) {
  return bestand[bestand.length - 1]["id"];
}

// ueberschreibt im Bestand gewuenschten Artikel mit neuem Artikel (gleiche Id)
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

// schreibt neue Bestandsliste im JSON-Format auf die Festplatte
function aktualisiereBestandsliste(bestandsliste) {
  const daten = JSON.stringify(bestandsliste);
  fs.writeFileSync(path.join(__dirname, "..", "data", "listen.json"), daten);
}

socketAPI.io = io;
module.exports = socketAPI;

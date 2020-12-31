const liste = document.querySelector("#elemente");
//io = require("socket.io-client");
var socket = io();

// EventListener, um Eintrag hinzuzufuegen
document.querySelector(".hinzufuegen").addEventListener("click", neuerArtikel);

socket.emit("holeArtikelliste");

socket.on("artikelListe", (artikelListe) => {
  console.log("neue Daten");
  artikelListe.forEach((artikel) => {
    istVorhanden(artikel["id"])
      ? aenderungenEinfuegen(artikel)
      : artikelHinzufuegen(artikel);
  });

  meldungAnzeigen();
});

socket.on("artikelLoeschen", (id) => {
  console.log(id);
  if (istVorhanden(id)) {
    const listenelemente = document.querySelectorAll(".listenelement");

    for (let i = 0; i < listenelemente.length; i++) {
      if (listenelemente[i].querySelector("#id").value == id) {
        console.log("LOESCHEN");
        listenelemente[i].remove();
      }
    }
  }
});

socket.on("neuerArtikel", (artikel) => {
  artikelHinzufuegen(artikel);
});

function istVorhanden(id) {
  const idNummern = liste.querySelectorAll("#id");
  let istVorhanden = false;

  idNummern.forEach((idNummer) => {
    if (idNummer.value == id) istVorhanden = true;
  });

  return istVorhanden;
}

function aenderungenEinfuegen(artikel) {
  const listenelemente = document.querySelectorAll(".listenelement");
  const suchbegriffe = [
    "name",
    "hersteller",
    "einkaufspreis",
    "verkaufspreis",
    "kategorie",
    "stueckzahl",
  ];

  for (let i = 0; i < listenelemente.length; i++) {
    if (listenelemente[i].querySelector("#id").value == artikel["id"]) {
      suchbegriffe.forEach((element) => {
        listenelemente[i].querySelector(`#${element}`).value = artikel[element];

        if (element === "name")
          listenelemente[i].querySelector(".eintragsname").innerText =
            artikel[element];
      });
    }
  }
}

function meldungAnzeigen() {
  const meldung = document.querySelector(".meldung");
  meldung.style.visibility = "visible";

  const nachricht = meldung.querySelector(".nachricht");
  nachricht.innerText = "synchronisiere";

  for (let i = 1; i < 7; i++)
    setTimeout(() => (nachricht.innerText += "."), i * 200);

  setTimeout(() => (meldung.style.visibility = "hidden"), 750);
}

function formularAuswerten(e) {
  const data = new FormData();
  // FIREFOX!!!!!!!!!!!!!!!
  const formularElement = e.path[2];
  const suchbegriffe = [
    "id",
    "name",
    "hersteller",
    "einkaufspreis",
    "verkaufspreis",
    "kategorie",
    "stueckzahl",
  ];

  suchbegriffe.forEach((element) => {
    element === "name" &&
    formularElement.querySelector(`#${element}`).value === ""
      ? data.append(element, "Neues Medikament")
      : data.append(
          element,
          formularElement.querySelector(`#${element}`).value
        );

    // FIREFOX!!!!!!!!!!!!!
    if (element === "name")
      e.path[3].querySelector(
        ".eintragsname"
      ).innerText = formularElement.querySelector(`#${element}`).value;
  });

  if (data.get("id") === "") {
    formularElement.parentNode.remove();
  }

  const neuerArtikel = JSON.stringify(Object.fromEntries(data));
  socket.emit("artikel", neuerArtikel);

  // FIREFOX!!!!!!!!!!!!!!!!!!!
  menueZuklappen(
    e.path[3].querySelector(".formular"),
    e.path[3].querySelector(".pfeil")
  );
  e.path[3].querySelector(".elementuebersicht").classList.toggle("aktiv");
}

function detailsAnzeigen(e) {
  // FIREFOX!!!!!!!!!!!!
  let path;

  e.path[2].querySelector(".formular") == null
    ? (path = e.path[3])
    : (path = e.path[2]);

  let formular = path.querySelector(".formular");
  let pfeil = path.querySelector(".pfeil");

  path.querySelector(".elementuebersicht").classList.toggle("aktiv");

  formular.style.maxHeight
    ? menueZuklappen(formular, pfeil)
    : menueAufklappen(formular, pfeil);
}

function menueAufklappen(formular, pfeil) {
  formular.style.maxHeight = formular.scrollHeight + "px";
  pfeil.style.transform = "rotate(90deg)";
}

function menueZuklappen(formular, pfeil) {
  formular.style.maxHeight = null;
  pfeil.style.transform = "rotate(0deg)";
}

function eintragEntfernen(e) {
  // CODE FUER FIREFOX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const id = e.target.parentNode.parentNode.querySelector("#id").value;
  if (id != "") socket.emit("artikelLoeschen", id);
  // FIREFOX!!!!!!!!!
  e.path[2].remove();
}

function neuerArtikel() {
  artikelHinzufuegen();

  menueAufklappen(
    liste.lastChild.querySelector(".formular"),
    liste.lastChild.querySelector(".pfeil")
  );

  liste.lastChild.querySelector(".elementuebersicht").classList.toggle("aktiv");
}

function artikelHinzufuegen(artikel) {
  const neuerArtikel = new Artikel(artikel).erstellen();

  neuerArtikel
    .querySelector(".pfeil-container")
    .addEventListener("click", detailsAnzeigen);

  neuerArtikel
    .querySelector(".eintragsname")
    .addEventListener("click", detailsAnzeigen);

  neuerArtikel
    .querySelector(".eintrag-entfernen")
    .addEventListener("click", eintragEntfernen);

  neuerArtikel
    .querySelector(".speichern-button")
    .addEventListener("click", formularAuswerten);

  liste.appendChild(neuerArtikel);
}

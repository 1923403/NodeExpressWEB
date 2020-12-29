const liste = document.querySelector("#elemente");
const listenelemente = document.querySelectorAll(".listenelement");
const loeschen = document.querySelectorAll(".eintrag-entfernen");
const hinzufuegen = document.createElement("div");
var socket = io();

socket.on("artikelListe", (artikelListe) => {
  artikelListe.forEach((artikel) => {
    if (istVorhanden(artikel["id"])) {
      aenderungenEinfuegen(artikel);
    } else {
      artikelHinzufuegen(artikel);
    }
  });

  meldungAnzeigen();
});

socket.on("artikelLoeschen", (id) => {
  if (istVorhanden(id)) {
    const listenelemente = document.querySelectorAll(".listenelement");

    // ueberfluessig, wenn e.path[3].remove in Eintrag entfernen behalten wird!
    for (let i = 0; i < listenelemente.length; i++) {
      if (listenelemente[i].querySelector("#id").value == id) {
        console.log("LOESCHEN");
        listenelemente[i].remove();
      }
    }
  }
});

function istVorhanden(id) {
  const idNummern = liste.querySelectorAll("#id");
  let istVorhanden = false;

  idNummern.forEach((idNummer) => {
    if (idNummer.value == id) {
      istVorhanden = true;
    }
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
        listenelemente[i].querySelector(`#${element}`).value =
          artikel[`${element}`];
        //  PRODUZIERT FEHLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (element === "name") {
          listenelemente[i].querySelector(".eintragsname").innerText =
            artikel[`${element}`];
          // listenelemente[i].querySelector(".artikelname").innerText =
          //   artikel[`${element}`];
        }
      });
    }
  }
}

function meldungAnzeigen() {
  const meldung = document.querySelector(".meldung");
  meldung.style.visibility = "visible";

  const nachricht = meldung.querySelector(".nachricht");
  nachricht.innerText = "synchronisiere";

  for (let i = 1; i < 7; i++) {
    setTimeout(() => {
      nachricht.innerText += ".";
    }, i * 200);
  }

  setTimeout(() => {
    meldung.style.visibility = "hidden";
  }, 750);
}

// Eintragsmenue ausklappen
listenelemente.forEach((element) =>
  element.addEventListener("click", detailsAnzeigen)
);

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
      ? data.append(`${element}`, "Neues Medikament")
      : data.append(
          `${element}`,
          formularElement.querySelector(`#${element}`).value
        );

    // FIREFOX!!!!!!!!!!!!!
    if (element === "name")
      e.path[3].querySelector(
        ".eintragsname"
      ).innerText = formularElement.querySelector(`#${element}`).value;
    // if (element === "name")
    //   e.path[3].querySelector(
    //     ".artikelname"
    //   ).innerText = formularElement.querySelector(`#${element}`).value;
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
  console.log(e.path[3]);
  let path;
  if (e.path[2].querySelector(".formular") == null) path = e.path[3];
  else path = e.path[2];
  let formular = path.querySelector(".formular");
  let pfeil = path.querySelector(".pfeil");
  path.querySelector(".elementuebersicht").classList.toggle("aktiv");
  // let formular = e.path[2].querySelector(".formular");
  // console.log("FORMULAR:");
  // console.log(formular);
  // let pfeil = e.path[2].querySelector(".pfeil");
  // console.log("PFEIL");

  // console.log(e.path[2].querySelector(".pfeil"));
  // console.log("e.path[3]");
  //console.log(e.path[3]);
  // console.log("pfeil:");
  // console.log(pfeil);
  // e.path[2].querySelector(".elementuebersicht").classList.toggle("aktiv");
  // console.log(e.path[2].querySelector(".elementuebersicht"));

  if (formular.style.maxHeight) {
    menueZuklappen(formular, pfeil);
  } else {
    menueAufklappen(formular, pfeil);
  }
}

function menueAufklappen(formular, pfeil) {
  formular.style.maxHeight = formular.scrollHeight + "px";
  pfeil.style.transform = "rotate(90deg)";
}

function menueZuklappen(formular, pfeil) {
  formular.style.maxHeight = null;
  pfeil.style.transform = "rotate(0deg)";
}

// Eintrag entfernen
loeschen.forEach((element) =>
  element.addEventListener("click", eintragEntfernen)
);

function eintragEntfernen(e) {
  // CODE FUER FIREFOX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const id = e.target.parentNode.parentNode.parentNode.querySelector("#id")
    .value;
  if (id != "") socket.emit("artikelLoeschen", id);
  // FIREFOX!!!!!!!!!
  // wenn Eintrag entfernt wird, können ungespeicherte Listen nicht geloescht werden!
  e.path[3].remove();
}

// Eintrag hinzufuegen
document.querySelector(".hinzufuegen").addEventListener("click", neuerArtikel);

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
    .firstChild.addEventListener("click", eintragEntfernen);

  neuerArtikel
    .querySelector(".speichern-button")
    .addEventListener("click", formularAuswerten);

  // console.log(neuerArtikel.querySelector(".eintrag-entfernen"));

  liste.appendChild(neuerArtikel);
  // console.log(liste);
}

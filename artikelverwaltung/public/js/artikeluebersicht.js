const liste = document.querySelector("#elemente");
var socket = io();

// EventListener, um Eintrag hinzuzufuegen
document.querySelector(".hinzufuegen").addEventListener("click", neuerArtikel);

// fordert bei erstmaliger Ausfuehrung Bestandsdaten an
socket.on("connect", () => {
  socket.emit("holeArtikelliste");
});

socket.on("disconnect", (reason) => {
  console.log("disconnected because " + reason);
});

// verarbeitet vom Server uebermittelte Bestandsdaten
socket.on("artikelliste", (artikelliste) => {
  const geparsteArtikelListe = JSON.parse(artikelliste);

  geparsteArtikelListe.forEach((artikel) => {
    verarbeiteArtikel(artikel);
  });

  meldungAnzeigen("Synchronisiere Bestandsdaten");
});

// verarbeitet auf dem Server aktualisierte Daten
socket.on("artikel", (artikel) => {
  const geparsterArtikel = JSON.parse(artikel);

  verarbeiteArtikel(geparsterArtikel);

  meldungAnzeigen("Aktualisiere Bestandsdaten");
});

// verarbeitet auf dem Server geloeschte Artikel
socket.on("artikelLoeschen", (id) => {
  const geparsteId = JSON.parse(id);

  if (istVorhanden(geparsteId)) {
    const listenelemente = document.querySelectorAll(".listenelement");

    for (let i = 0; i < listenelemente.length; i++) {
      if (listenelemente[i].querySelector("#id").value == geparsteId) {
        animiereEntfernen(listenelemente[i]);
      }
    }
  }
  meldungAnzeigen("Entferne Artikel");
});

// prueft, ob sich uebergebene ID in der Artikelliste befindet
function istVorhanden(id) {
  const idNummern = liste.querySelectorAll("#id");
  let istVorhanden = false;

  idNummern.forEach((idNummer) => {
    if (idNummer.value == id) istVorhanden = true;
  });

  return istVorhanden;
}

// prueft, ob ein Artikel in der Clientliste bereits vorhanden ist und
// bearbeitet diesen entsprechend
function verarbeiteArtikel(artikel) {
  istVorhanden(artikel["id"])
    ? aenderungenEinfuegen(artikel)
    : artikelHinzufuegen(artikel);
}

// ueberschreibt bestehende Artikeldaten mit neu vom Server empfangenen
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

  // geht alle Artikel in der Clientliste durch und vergleicht deren ID mit der
  // ID des vom Server uebermittelten Artikels und gleicht bei Uebereinstimmung
  // die restlichen Daten ab
  for (let i = 0; i < listenelemente.length; i++) {
    if (listenelemente[i].querySelector("#id").value == artikel["id"]) {
      suchbegriffe.forEach((element) => {
        listenelemente[i].querySelector(`#${element}`).value = artikel[element];

        // aktualisiert Anzeigenamen in der Liste
        if (element === "name")
          listenelemente[i].querySelector(".eintragsname").innerText =
            artikel[element];
      });
    }
  }
}

// blendet bei Aufruf oben mittig kurzzeitig den uebergebenen Text ein
function meldungAnzeigen(meldung) {
  const meldungselement = document.querySelector(".meldung");
  meldungselement.style.visibility = "visible";

  const nachrichtenelement = meldungselement.querySelector(".nachricht");
  nachrichtenelement.innerText = meldung;

  for (let i = 1; i < 8; i++)
    setTimeout(() => (nachrichtenelement.innerText += "."), i * 200);

  setTimeout(() => (meldungselement.style.visibility = "hidden"), 1000);
}

// wertet nach Klick auf Speichern das entsprechend uebergebene Formular aus
function formularAuswerten(e) {
  const data = new FormData();
  const formularElement = e.target.parentNode.parentNode;
  const suchbegriffe = [
    "id",
    "name",
    "hersteller",
    "einkaufspreis",
    "verkaufspreis",
    "kategorie",
    "stueckzahl",
  ];

  // geht alle Formularfelder durch und fuegt deren Inhalt data hinzu
  suchbegriffe.forEach((element) => {
    element === "name" &&
    formularElement.querySelector(`#${element}`).value === ""
      ? data.append(element, "Neues Medikament")
      : data.append(
          element,
          formularElement.querySelector(`#${element}`).value
        );

    // aktualisiert Anzeigenamen in der Liste
    if (element === "name")
      e.target.parentNode.parentNode.parentNode.querySelector(
        ".eintragsname"
      ).innerText = formularElement.querySelector(`#${element}`).value;
  });

  // falls keine ID vorhanden ist, wird der Eintrag entfernt, da die ID server-
  // seitig vergeben wird und das Objekt nicht mehr identifizierbar waere
  if (data.get("id") === "") {
    formularElement.parentNode.remove();
  }

  // uebermittelt die aktualisierten Daten an den Server
  const neuerArtikel = JSON.stringify(Object.fromEntries(data));
  socket.emit("artikel", neuerArtikel);

  menueZuklappen(
    e.target.parentNode.parentNode.parentNode.querySelector(".formular"),
    e.target.parentNode.parentNode.parentNode.querySelector(".pfeil")
  );

  e.target.parentNode.parentNode.parentNode
    .querySelector(".elementuebersicht")
    .classList.toggle("aktiv");
}

// klappt entsprechend des aktuellen Status Artikelmenue auf oder zu
function detailsAnzeigen(e) {
  let target;

  e.target.parentNode.parentNode.querySelector(".formular") == null
    ? (target = e.target.parentNode.parentNode.parentNode)
    : (target = e.target.parentNode.parentNode);

  let formular = target.querySelector(".formular");
  let pfeil = target.querySelector(".pfeil");

  target.querySelector(".elementuebersicht").classList.toggle("aktiv");

  formular.style.maxHeight
    ? menueZuklappen(formular, pfeil)
    : menueAufklappen(formular, pfeil);
}

// klappt Artikelmenue auf
function menueAufklappen(formular, pfeil) {
  formular.style.maxHeight = formular.scrollHeight + "px";
  pfeil.style.transform = "rotate(90deg)";
}

// klappt Artikelmenue zu
function menueZuklappen(formular, pfeil) {
  formular.style.maxHeight = null;
  pfeil.style.transform = "rotate(0deg)";
}

// loescht Artikel aus Liste
function eintragEntfernen(e) {
  const id = e.target.parentNode.parentNode.querySelector("#id").value;
  const element = e.target.parentNode.parentNode;

  animiereEntfernen(element);

  // sendet ID des zu loeschenden Artikels an den Server
  if (id != "") socket.emit("artikelLoeschen", JSON.stringify(id));
}

// geloeschtes Element gleitet nach rechts aus dem Bild
function animiereEntfernen(element) {
  element.animate({ transform: "translateX(200%)" }, { duration: 400 });

  setTimeout(() => {
    element.remove();
  }, 400);
}

// erstellt einen neuen Artikel in der Liste und klappt das Menue auf
function neuerArtikel() {
  artikelHinzufuegen();

  menueAufklappen(
    liste.lastChild.querySelector(".formular"),
    liste.lastChild.querySelector(".pfeil")
  );

  liste.lastChild.querySelector(".elementuebersicht").classList.toggle("aktiv");
}

// erstellt HTML-Elemente fuer neuen Artikel und fuegt entsprechenden Schalt-
// flaechen EventListener hinzu
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

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
        // PRODUZIERT FEHLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // if (element === "name") {
        //   listenelemente[i].querySelector(".eintragsname").innerText =
        //     artikel[`${element}`];
        // }
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
    data.append(
      `${element}`,
      formularElement.querySelector(`#${element}`).value
    );
  });

  if (data.get("id") === "") {
    formularElement.parentNode.parentNode.remove();
  }

  const neuerArtikel = JSON.stringify(Object.fromEntries(data));
  socket.emit("artikel", neuerArtikel);

  // FIREFOX!!!!!!!!!!!!!!!!!!!
  console.log(e.path[3]);
  menueZuklappen(
    e.path[3].querySelector(".formular"),
    e.path[4].querySelector(".pfeil")
  );
  e.path[4].querySelector(".elementuebersicht").classList.toggle("aktiv");
}

function detailsAnzeigen(e) {
  // FIREFOX!!!!!!!!!!!!
  let formular = e.path[3].querySelector(".formular");
  let pfeil = e.path[3].querySelector(".pfeil");
  e.path[3].querySelector(".elementuebersicht").classList.toggle("aktiv");

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
  // // Listenelement erstellen
  // const hinzufuegen = document.createElement("div");
  // hinzufuegen.className = "listenelement";

  // // ul erstellen
  // const ul = document.createElement("ul");
  // ul.className = "elementuebersicht";

  // // li - eintragsname
  // const liName = document.createElement("li");
  // liName.className = "eintragsname";
  // const imgPfeil = document.createElement("img");
  // imgPfeil.className = "pfeil";
  // imgPfeil.src = "./images/arrow-right-24px.svg";
  // const aName = document.createElement("a");

  // artikel != null
  //   ? (aName.innerText = artikel["name"])
  //   : (aName.innerText = "Neues Medikament");

  // // if (artikel != null) aName.innerText = artikel["name"];
  // // else aName.innerText = "Neues Medikament";
  // liName.appendChild(imgPfeil);
  // liName.appendChild(aName);
  // liName.addEventListener("click", detailsAnzeigen);

  // // li - eintrag-entfernen
  // const liEntfernen = document.createElement("li");
  // liEntfernen.className = "eintrag-entfernen";
  // const aEntfernen = document.createElement("a");
  // aEntfernen.addEventListener("click", eintragEntfernen);
  // aEntfernen.innerText = "Löschen";
  // liEntfernen.appendChild(aEntfernen);

  // // fuege lis der ul hinzu
  // ul.appendChild(liName);
  // ul.appendChild(liEntfernen);

  // // ul zu Liste hinzufuegen
  // hinzufuegen.appendChild(ul);

  // // div - formular
  // const divFormular = document.createElement("div");
  // divFormular.className = "formular";
  // hinzufuegen.appendChild(divFormular);

  // // Formular
  // const formular = document.createElement("form");
  // formular.action = "";
  // divFormular.appendChild(formular);

  // /*
  //   Formular-Gruppe 1 - Anfang
  // */

  // // Container erstellen
  // let divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // let input = document.createElement("input");
  // input.type = "number";
  // input.id = "id";
  // input.name = "id";
  // // input.readOnly = true;
  // input.disabled = "disabled";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["id"];

  // // Label erstellen
  // let label = document.createElement("label");
  // label.htmlFor = "id";
  // label.innerText = "ID";
  // divFormularGruppe.appendChild(label);

  // /*
  //   Formular-Gruppe 2 - Anfang
  // */

  // // Container erstellen
  // divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // input = document.createElement("input");
  // input.type = "text";
  // input.id = "name";
  // input.name = "name";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["name"];

  // // Label erstellen
  // label = document.createElement("label");
  // label.htmlFor = "name";
  // label.innerText = "Name";
  // divFormularGruppe.appendChild(label);

  // /*
  //   Formular-Gruppe 3 - Anfang
  // */

  // // Container erstellen
  // divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // input = document.createElement("input");
  // input.type = "text";
  // input.id = "hersteller";
  // input.name = "hersteller";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["hersteller"];

  // // Label erstellen
  // label = document.createElement("label");
  // label.htmlFor = "hersteller";
  // label.innerText = "Hersteller";
  // divFormularGruppe.appendChild(label);

  // /*
  //   Formular-Gruppe 4 - Anfang
  // */

  // // Container erstellen
  // divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // input = document.createElement("input");
  // input.type = "number";
  // input.id = "einkaufspreis";
  // input.name = "einkaufspreis";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["einkaufspreis"];

  // // Label erstellen
  // label = document.createElement("label");
  // label.htmlFor = "einkaufspreis";
  // label.innerText = "Einkaufspreis";
  // divFormularGruppe.appendChild(label);

  // /*
  //   Formular-Gruppe 5 - Anfang
  // */

  // // Container erstellen
  // divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // input = document.createElement("input");
  // input.type = "number";
  // input.id = "verkaufspreis";
  // input.name = "verkaufspreis";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["verkaufspreis"];

  // // Label erstellen
  // label = document.createElement("label");
  // label.htmlFor = "verkaufspreis";
  // label.innerText = "Verkaufspreis";
  // divFormularGruppe.appendChild(label);

  // /*
  //   Formular-Gruppe 7 - Anfang
  // */

  // // Container erstellen
  // divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // input = document.createElement("input");
  // input.type = "text";
  // input.id = "kategorie";
  // input.name = "kategorie";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["kategorie"];

  // // Label erstellen
  // label = document.createElement("label");
  // label.htmlFor = "kategorie";
  // label.innerText = "Kategorie";
  // divFormularGruppe.appendChild(label);

  // /*
  //   Formular-Gruppe 8 - Anfang
  // */

  // // Container erstellen
  // divFormularGruppe = document.createElement("div");
  // divFormularGruppe.className = "formular-gruppe";
  // formular.appendChild(divFormularGruppe);

  // // Input erstellen
  // input = document.createElement("input");
  // input.type = "number";
  // input.id = "stueckzahl";
  // input.name = "stueckzahl";
  // divFormularGruppe.appendChild(input);
  // if (artikel != null) input.value = artikel["stueckzahl"];

  // // Label erstellen
  // label = document.createElement("label");
  // label.htmlFor = "stueckzahl";
  // label.innerText = "Stückzahl";
  // divFormularGruppe.appendChild(label);

  // // Button erstellen
  // button = document.createElement("button");
  // button.type = "button";
  // button.className = "speichern-button";
  // button.innerText = "Speichern";
  // button.addEventListener("click", formularAuswerten);
  // divFormularGruppe.appendChild(button);

  // // Uebergabe an Liste
  // liste.appendChild(hinzufuegen);
  const neuerArtikel = new Artikel(artikel).erstellen();

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

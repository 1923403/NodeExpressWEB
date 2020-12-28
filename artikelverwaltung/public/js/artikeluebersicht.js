const liste = document.querySelector("#elemente");
const listenelemente = document.querySelectorAll(".listenelement");
const loeschen = document.querySelectorAll(".eintrag-entfernen");
const hinzufuegen = document.createElement("div");
var socket = io();

socket.on("artikelListe", (artikelListe) => {
  artikelListe.forEach((artikel) => {
    if (istSchonVerfuegbar(artikel["id"])) {
      aenderungenEinfuegen(artikel);
    } else {
      // console.log("hinzufuegen");
      artikelHinzufuegen(artikel);
    }
  });
  erfolgsmeldungAnzeigen();
});

socket.on("artikelLoeschen", (id) => {
  console.log("loesche " + id);
  if (istSchonVerfuegbar(id)) {
    let kinder = document.querySelectorAll(".listenelement");
    for (let i = 0; i < kinder.length; i++) {
      console.log(kinder[i].querySelector("#id").value);
      if (kinder[i].querySelector("#id").value == id) {
        console.log("removing...");
        kinder[i].remove();
      }
    }
  }
});

function istSchonVerfuegbar(id) {
  let listenIDs = liste.querySelectorAll("#id");
  let istVorhanden = false;

  listenIDs.forEach((elementId) => {
    if (elementId.value == id) {
      istVorhanden = true;
    }
  });
  return istVorhanden;
}

function aenderungenEinfuegen(artikel) {
  let kinder = document.querySelectorAll(".listenelement");
  // console.log(kinder);
  for (let i = 0; i < kinder.length; i++) {
    // console.log(kinder[i].querySelector("#id").value);
    if (kinder[i].querySelector("#id").value == artikel["id"]) {
      // console.log("ueberschreiben");
      kinder[i].querySelector("#name").value = artikel["name"];
      kinder[i].querySelector("#hersteller").value = artikel["hersteller"];
      kinder[i].querySelector("#einkaufspreis").value =
        artikel["einkaufspreis"];
      kinder[i].querySelector("#verkaufspreis").value =
        artikel["verkaufspreis"];
      kinder[i].querySelector("#kategorie").value = artikel["kategorie"];
      kinder[i].querySelector("#stueckzahl").value = artikel["stueckzahl"];
    }
  }
}

function erfolgsmeldungAnzeigen() {
  const div = document.createElement("div");
  div.className = "erfolgsmeldung";
  div.appendChild(document.createTextNode("synchronisiere..."));
  const infoContainer = document.querySelector(".info-container");
  infoContainer.appendChild(div);

  setTimeout(function () {
    document.querySelector(".erfolgsmeldung").remove();
  }, 2000);
}

// Eintragsmenue ausklappen
listenelemente.forEach((element) =>
  element.addEventListener("click", detailsAnzeigen)
);

function formularAuswerten(e) {
  const data = new FormData();
  formularElement = e.path[2];
  data.append("id", formularElement.querySelector("#id").value);
  data.append("name", formularElement.querySelector("#name").value);
  data.append("hersteller", formularElement.querySelector("#hersteller").value);
  data.append(
    "einkaufspreis",
    formularElement.querySelector("#einkaufspreis").value
  );
  data.append(
    "verkaufspreis",
    formularElement.querySelector("#verkaufspreis").value
  );
  data.append("kategorie", formularElement.querySelector("#kategorie").value);
  data.append("stueckzahl", formularElement.querySelector("#stueckzahl").value);
  console.log(data.get("id"));
  if (data.get("id") === "") {
    console.log(formularElement.parentNode.parentNode);
    formularElement.parentNode.parentNode.remove();
  }
  let neuerArtikel = JSON.stringify(Object.fromEntries(data));
  socket.emit("artikel", neuerArtikel);
  ansichtSchliessen(e.path[3], e.path[4].querySelector(".pfeil"));
  e.path[4].querySelector(".elementuebersicht").classList.toggle("aktiv");
}

function detailsAnzeigen(e) {
  let formular = e.path[3].querySelector(".formular");
  let pfeil = e.path[3].querySelector(".pfeil");
  e.path[3].querySelector(".elementuebersicht").classList.toggle("aktiv");
  if (formular.style.maxHeight) {
    ansichtSchliessen(formular, pfeil);
  } else {
    ansichtOeffnen(formular, pfeil);
  }
}

function ansichtOeffnen(formular, pfeil) {
  formular.style.maxHeight = formular.scrollHeight + "px";
  pfeil.style.transform = "rotate(90deg)";
}

function ansichtSchliessen(formular, pfeil) {
  formular.style.maxHeight = null;
  pfeil.style.transform = "rotate(0deg)";
}

// Eintrag entfernen
loeschen.forEach((element) =>
  element.addEventListener("click", eintragEntfernen)
);

function eintragEntfernen(e) {
  console.log("CLICK");
  console.log(e.target.parentNode.parentNode.parentNode.querySelector("#id"));
  let id = e.path[3].querySelector("#id").value;
  if (id != "") socket.emit("artikelLoeschen", id);
  e.path[3].remove();
}

// Eintrag hinzufuegen
document.querySelector(".hinzufuegen").addEventListener("click", neuerArtikel);

function neuerArtikel() {
  artikelHinzufuegen();
  console.log(liste.lastChild.querySelector(".pfeil"));
  ansichtOeffnen(
    liste.lastChild.querySelector(".formular"),
    liste.lastChild.querySelector(".pfeil")
  );
  liste.lastChild.querySelector(".elementuebersicht").classList.toggle("aktiv");
}

function artikelHinzufuegen(artikel) {
  // Listenelement erstellen
  const hinzufuegen = document.createElement("div");
  hinzufuegen.className = "listenelement";

  // ul erstellen
  const ul = document.createElement("ul");
  ul.className = " elementuebersicht";

  // li - eintragsname
  const liName = document.createElement("li");
  liName.className = "eintragsname";
  const imgPfeil = document.createElement("img");
  imgPfeil.className = "pfeil";
  imgPfeil.src = "./images/arrow-right-24px.svg";
  const aName = document.createElement("a");
  if (artikel != null) aName.innerText = artikel["name"];
  else aName.innerText = "Neues Medikament";
  liName.appendChild(imgPfeil);
  liName.appendChild(aName);
  liName.addEventListener("click", detailsAnzeigen);

  // li - eintrag-entfernen
  const liEntfernen = document.createElement("li");
  liEntfernen.className = "eintrag-entfernen";
  const aEntfernen = document.createElement("a");
  aEntfernen.addEventListener("click", eintragEntfernen);
  aEntfernen.innerText = "Löschen";
  liEntfernen.appendChild(aEntfernen);

  // fuege lis der ul hinzu
  ul.appendChild(liName);
  ul.appendChild(liEntfernen);

  // ul zu Liste hinzufuegen
  hinzufuegen.appendChild(ul);

  // div - formular
  const divFormular = document.createElement("div");
  divFormular.className = "formular";
  hinzufuegen.appendChild(divFormular);

  // Formular
  const formular = document.createElement("form");
  formular.action = "";
  divFormular.appendChild(formular);

  /*
    Formular-Gruppe 1 - Anfang
  */

  // Container erstellen
  let divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  let input = document.createElement("input");
  input.type = "number";
  input.id = "id";
  input.name = "id";
  input.readOnly = true;
  input.disabled = "disabled";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["id"];

  // Label erstellen
  let label = document.createElement("label");
  label.htmlFor = "id";
  label.innerText = "ID";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 2 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "text";
  input.id = "name";
  input.name = "name";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["name"];

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "name";
  label.innerText = "Name";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 3 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "text";
  input.id = "hersteller";
  input.name = "hersteller";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["hersteller"];

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "hersteller";
  label.innerText = "Hersteller";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 4 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "number";
  input.id = "einkaufspreis";
  input.name = "einkaufspreis";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["einkaufspreis"];

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "einkaufspreis";
  label.innerText = "Einkaufspreis";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 5 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "number";
  input.id = "verkaufspreis";
  input.name = "verkaufspreis";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["verkaufspreis"];

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "verkaufspreis";
  label.innerText = "Verkaufspreis";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 7 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "text";
  input.id = "kategorie";
  input.name = "kategorie";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["kategorie"];

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "kategorie";
  label.innerText = "Kategorie";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 8 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "number";
  input.id = "stueckzahl";
  input.name = "stueckzahl";
  divFormularGruppe.appendChild(input);
  if (artikel != null) input.value = artikel["stueckzahl"];

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "stueckzahl";
  label.innerText = "Stückzahl";
  divFormularGruppe.appendChild(label);

  // Button erstellen
  button = document.createElement("button");
  button.type = "button";
  button.className = "speichern-button";
  button.innerText = "Speichern";
  button.addEventListener("click", formularAuswerten);
  divFormularGruppe.appendChild(button);

  // Uebergabe an Liste
  liste.appendChild(hinzufuegen);
  // console.log(liste);
}

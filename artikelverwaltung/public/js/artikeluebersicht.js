const liste = document.querySelector("#elemente");
const listenelemente = document.querySelectorAll(".eintragsname");
const loeschen = document.querySelectorAll(".eintrag-entfernen");
const hinzufuegen = document.createElement("div");
let elemtenteAnzahl = 2;

// Eintragsmenue ausklappen
listenelemente.forEach((element) =>
  element.addEventListener("click", detailsAnzeigen)
);

function detailsAnzeigen(e) {
  let formular = e.path[3].querySelector(".formular");
  let pfeil = e.path[3].querySelector(".pfeil");
  e.path[3].querySelector(".elementuebersicht").classList.toggle("aktiv");
  if (formular.style.maxHeight) {
    formular.style.maxHeight = null;
    pfeil.style.transform= "rotate(0deg)";
  } else {
    formular.style.maxHeight = formular.scrollHeight + "px";
    pfeil.style.transform= "rotate(90deg)";
  }
}

// Eintrag entfernen
loeschen.forEach((element) =>
  element.addEventListener("click", eintragEntfernen)
);

function eintragEntfernen(e) {
  e.path[3].remove();
}

// Eintrag hinzufuegen
document
  .querySelector(".hinzufuegen")
  .addEventListener("click", elementHinzufuegen);

function elementHinzufuegen() {
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
  imgPfeil.src="./images/arrow-right-24px.svg";
  const aName = document.createElement("a");
  aName.innerText = "Name "+ ++elemtenteAnzahl;
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
  divFormularGruppe.appendChild(input);

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

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "verkaufspreis";
  label.innerText = "Verkaufspreis";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 6 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "text";
  input.id = "beschreibung";
  input.name = "beschreibung";
  divFormularGruppe.appendChild(input);

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "beschreibung";
  label.innerText = "Beschreibung";
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
  input.id = "verfuegbarkeit";
  input.name = "verfuegbarkeit";
  divFormularGruppe.appendChild(input);

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "verfuegbarkeit";
  label.innerText = "Verfügbarkeit";
  divFormularGruppe.appendChild(label);

  /*
    Formular-Gruppe 9 - Anfang
  */

  // Container erstellen
  divFormularGruppe = document.createElement("div");
  divFormularGruppe.className = "formular-gruppe";
  formular.appendChild(divFormularGruppe);

  // Input erstellen
  input = document.createElement("input");
  input.type = "date";
  input.id = "verfuegbar-seit";
  input.name = "verfuegbar-seit";
  divFormularGruppe.appendChild(input);

  // Label erstellen
  label = document.createElement("label");
  label.htmlFor = "verfuegbar-seit";
  label.innerText = "Verfügbar seit";
  divFormularGruppe.appendChild(label);

  // Uebergabe an Liste
  liste.appendChild(hinzufuegen);
  console.log(liste);
}

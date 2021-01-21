class Artikel {
  constructor(artikel) {
    this.artikel = artikel;
  }

  /*
    erstellt neues Listenelement und uebergibt dieses
  */
  erstellen() {
    // erstellt Listenelement, das spaeter uebergeben wird
    const listenelement = this.erstelleElement("div", "listenelement");

    // erstellt Container, die dem Listenelement angehaengt wird
    const elementuebersicht = this.erstelleElement("div", "elementuebersicht");
    listenelement.appendChild(elementuebersicht);

    // erstellt Container fuer Menuepfeil, der dem Listenelement angehaengt wird
    const pfeilContainer = this.erstelleElement("div", "pfeil-container");
    elementuebersicht.appendChild(pfeilContainer);

    // erstellt Menuepfeil, der dem Menue-Container angehaengt wird
    const menuePfeil = this.erstelleElement("img", "pfeil");
    pfeilContainer.appendChild(menuePfeil);

    // erstellt den im Listenelement angezeigten Namen des Artikels und haengt ihn dem Container an
    const eintragsname = this.erstelleElement("p", "eintragsname");
    this.artikel != null
      ? (eintragsname.innerText = this.artikel["name"])
      : (eintragsname.innerText = "Neues Medikament");
    elementuebersicht.appendChild(eintragsname);

    // erstellt Knopf, um Artikel zu entfernen, und haengt ihn dem Container an
    const eintragEntfernen = this.erstelleElement("button", "eintrag-entfernen");
    eintragEntfernen.innerText = "Löschen";
    elementuebersicht.appendChild(eintragEntfernen);

    // erstellt Formular und haengt es dem Listenelement an
    const formular = this.erstelleFormular();
    listenelement.appendChild(formular);

    return listenelement;
  }

  /*
    erstellt neues HTML-Element mit Klassennamen
  */
  erstelleElement(htmlElement, klassenname) {
    const neuesElement = document.createElement(htmlElement);
    neuesElement.className = klassenname;

    if (htmlElement === "img" && klassenname === "pfeil") {
      neuesElement.src = "./images/arrow-right-24px.svg";
    }

    return neuesElement;
  }

  /*
    erstellt neues Formularelement mit Knopf zum Speichern sowie input- und label-Tag jeweils zusammen in Container
  */
  erstelleFormular() {
    const formularContainer = this.erstelleElement("div", "formular");
    const formular = this.erstelleFormularGruppen();
    formularContainer.appendChild(formular);

    return formularContainer;
  }

  //erstllt Container für die einzelnen Elemente des Formulars und Speichern-Button
  erstelleFormularGruppen() {
    const formular = document.createElement("form");
    const formulargruppen = [
      "id",
      "name",
      "hersteller",
      "einkaufspreis",
      "verkaufspreis",
      "kategorie",
      "stueckzahl",
    ];

    formulargruppen.forEach((gruppenelement) => {
      const formulargruppenContainer = this.erstelleElement(
        "div",
        "formular-gruppe"
      );
      formular.appendChild(formulargruppenContainer);

      const label = this.erstelleLabel(gruppenelement);
      formulargruppenContainer.appendChild(label);

      const input = this.erstelleInput(gruppenelement);
      formulargruppenContainer.appendChild(input);
    });

    const button = this.erstelleButton();
    formular.appendChild(button);

    return formular;
  }

  //erstellt die Eingabefelder
  erstelleInput(gruppenelement) {
    const input = document.createElement("input");

    gruppenelement === "id" ||
    gruppenelement === "einkaufspreis" ||
    gruppenelement === "verkaufspreis" ||
    gruppenelement === "stueckzahl"
      ? (input.type = "number")
      : (input.type = "text");

    input.id = gruppenelement;
    input.name = gruppenelement;

    if (gruppenelement === "id") input.disabled = "disabled";
    if (this.artikel != null) input.value = this.artikel[gruppenelement];

    return input;
  }

  //erstellt die Bezeichner für die Eingabefelder
  erstelleLabel(gruppenelement) {
    const label = document.createElement("label");
    label.htmlFor = gruppenelement;

    gruppenelement === "id"
      ? (label.innerText = gruppenelement.toUpperCase())
      : (label.innerText = gruppenelement
          .split(" ")
          .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
          .join(" "));

    return label;
  }

  //erstellt den Speichern-Button
  erstelleButton() {
    const button = this.erstelleElement("button", "speichern-button");
    button.type = "button";
    button.innerText = "Speichern";

    return button;
  }
}

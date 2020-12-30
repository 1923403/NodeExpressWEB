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

    // erstellt unordered list, die dem Listenelement angehaengt wird
    const elementuebersicht = this.erstelleElement("ul", "elementuebersicht");
    listenelement.appendChild(elementuebersicht);

    // erstellt Container fuer Menuepfeil, der der unordered list angehaengt wird
    const pfeilContainer = this.erstelleElement("div", "pfeil-container");
    elementuebersicht.appendChild(pfeilContainer);

    // erstellt Menuepfeil, der dem Menue-Container angehaengt wird
    const menuePfeil = this.erstelleElement("img", "pfeil");
    pfeilContainer.appendChild(menuePfeil);

    // erstellt den in der Liste angezeigten Namen des Artikels und haengt ihn der unordered list an
    const eintragsname = this.erstelleElement("li", "eintragsname");
    this.artikel != null
      ? (eintragsname.innerText = this.artikel["name"])
      : (eintragsname.innerText = "Neues Medikament");
    elementuebersicht.appendChild(eintragsname);

    // erstellt Knopf, um Artikel zu entfernen, und haengt ihn der unordered list an
    const eintragEntfernen = this.erstelleElement("li", "eintrag-entfernen");
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

  erstelleButton() {
    const button = this.erstelleElement("button", "speichern-button");
    button.type = "button";
    button.innerText = "Speichern";

    return button;
  }
}

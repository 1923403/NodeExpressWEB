class Artikel {
  constructor(artikel) {
    this.artikel = artikel;
  }

  erstellen() {
    const listenelement = this.erstelleElement("div", "listenelement");

    const elementuebersicht = this.erstelleElement("ul", "elementuebersicht");
    listenelement.appendChild(elementuebersicht);

    const eintragsname = this.erstelleEintragsname();
    elementuebersicht.appendChild(eintragsname);

    const eintragEntfernen = this.erstelleEintragEntfernen();
    elementuebersicht.appendChild(eintragEntfernen);

    const formular = this.erstelleFormular();
    listenelement.appendChild(formular);

    return listenelement;
  }

  erstelleElement(htmlElement, klassenname) {
    const neuesElement = document.createElement(`${htmlElement}`);
    neuesElement.className = `${klassenname}`;

    if (htmlElement === "img" && klassenname === "pfeil") {
      neuesElement.src = "./images/arrow-right-24px.svg";
    }

    return neuesElement;
  }

  erstelleEintragsname() {
    const eintragsname = this.erstelleElement("li", "eintragsname");
    const menuePfeil = this.erstelleElement("img", "pfeil");
    const artikelname = document.createElement("a");

    this.artikel != null
      ? (artikelname.innerText = this.artikel["name"])
      : (artikelname.innerText = "Neues Medikament");

    eintragsname.appendChild(menuePfeil);
    eintragsname.appendChild(artikelname);

    return eintragsname;
  }

  erstelleEintragEntfernen() {
    const eintragEntfernen = this.erstelleElement("li", "eintrag-entfernen");
    const beschriftung = document.createElement("a");
    beschriftung.innerText = "Löschen";
    eintragEntfernen.appendChild(beschriftung);

    return eintragEntfernen;
  }

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

    formulargruppen.forEach((gruppe) => { //gruppe--> gruppenelement?
      const formulargruppenContainer = this.erstelleElement(
        "div",
        "formular-gruppe"
      );
      formular.appendChild(formulargruppenContainer);
      
      const label = this.erstelleLabel(gruppe);
      formulargruppenContainer.appendChild(label);
      
      const input = this.erstelleInput(gruppe);
      formulargruppenContainer.appendChild(input);

      // if (artikel != null) input.value = artikel["id"];

    });

    const button = this.erstelleButton();
    formular.appendChild(button);

    return formular;
  }

  erstelleInput(gruppe) {
    const input = document.createElement("input");

    gruppe === "id" ||
    gruppe === "einkaufspreis" ||
    gruppe === "verkaufspreis" ||
    gruppe === "stueckzahl"
      ? (input.type = "number")
      : (input.type = "text");

    input.id = `${gruppe}`;
    input.name = `${gruppe}`;

    if (gruppe === "id") input.disabled = "disabled";
    if (this.artikel != null) input.value = this.artikel[`${gruppe}`];

    return input;
  }

  erstelleLabel(gruppe) {
    const label = document.createElement("label");
    label.htmlFor = `${gruppe}`;

    gruppe === "id"
      ? (label.innerText = `${gruppe}`.toUpperCase())
      : (label.innerText = `${gruppe}`
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

// bla = new Artikel();
// bla.erstellen();

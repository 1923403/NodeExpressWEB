class Artikel {
  constructor(artikel) {
    this.artikel = artikel;
  }

  erstellen() {
    const listenelement = this.erstelleElement("div", "listenelement");

    const elementuebersicht = this.erstelleElement("ul", "elementuebersicht");
    listenelement.appendChild(elementuebersicht);

    const pfeilContainer = this.erstelleElement("div", "pfeil-container");
    elementuebersicht.appendChild(pfeilContainer);

    const menuePfeil = this.erstelleElement("img", "pfeil");
    pfeilContainer.appendChild(menuePfeil);

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
    // const menuePfeil = this.erstelleElement("img", "pfeil");
    // const artikelname = this.erstelleElement("a", "artikelname");

    this.artikel != null
      ? (eintragsname.innerText = this.artikel["name"])
      : (eintragsname.innerText = "Neues Medikament");

    // this.artikel != null
    //   ? (artikelname.innerText = this.artikel["name"])
    //   : (artikelname.innerText = "Neues Medikament");

    // eintragsname.appendChild(menuePfeil);
    // eintragsname.appendChild(artikelname);

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

    formulargruppen.forEach((gruppenelement) => {
      //gruppenelement--> gruppenelement?
      const formulargruppenContainer = this.erstelleElement(
        "div",
        "formular-gruppe"
      );
      formular.appendChild(formulargruppenContainer);

      const label = this.erstelleLabel(gruppenelement);
      formulargruppenContainer.appendChild(label);

      const input = this.erstelleInput(gruppenelement);
      formulargruppenContainer.appendChild(input);

      // if (artikel != null) input.value = artikel["id"];
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

    input.id = `${gruppenelement}`;
    input.name = `${gruppenelement}`;

    if (gruppenelement === "id") input.disabled = "disabled";
    if (this.artikel != null) input.value = this.artikel[`${gruppenelement}`];

    return input;
  }

  erstelleLabel(gruppenelement) {
    const label = document.createElement("label");
    label.htmlFor = `${gruppenelement}`;

    gruppenelement === "id"
      ? (label.innerText = `${gruppenelement}`.toUpperCase())
      : (label.innerText = `${gruppenelement}`
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

const liste = document.querySelector("#elemente");
//io = require("socket.io-client");
var socket = io();
//var socket = io({transports: ['websocket'], upgrade: false});

// EventListener, um Eintrag hinzuzufuegen
document.querySelector(".hinzufuegen").addEventListener("click", neuerArtikel);
socket.emit("holeArtikelliste");

socket.on("connect",()=>{
  console.log("verbunden");
});

socket.on("error",(errMsg)=>{
  console.log("FEHLER!!!!"+errMsg);
});

socket.on("artikelListe", (artikelListe) => {
  artikelListe.forEach((artikel) => {
    istVorhanden(artikel["id"])
    ? aenderungenEinfuegen(artikel)
    : artikelHinzufuegen(artikel);
  });
  
  //aktualisiereClientDaten(artikelListe)
  meldungAnzeigen();
});

function aktualisiereClientDaten(artikelListe){
  console.log("HALLO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  console.log(artikelListe)
  // const clientIds = holeClientIds();
  const clientIds = document.querySelectorAll(".listenlement");

  clientIds.forEach(clientId => {
    let vorhanden = false

  artikelListe.forEach(artikel => {

    if (!vorhanden) {
      console.log(clientId.querySelector("#id").value)
      if(clientId.querySelector("#id").value == artikel["id"]) {
        console.log()
        vorhanden = true
      }
    }
    console.log(artikel)
  })

  if (!vorhanden) {
    animiereEntfernen(clientId)
    console.log("loeschen")
  }
  
})

  // if(clientIds != null){
  //   clientIds.forEach(clientId =>{
  //     if(clientId.length != 0){
  //       console.log(artikelListe["id"].value);
  //       if(artikelListe[clientId] == null){
  //         console.log("zu loeschen: "+clientId);
  //       }
  //     }
  //   });
  // }

}

// function holeClientIds() {
//   const listenelemente = document.querySelectorAll(".listenelement");
//   const ids = [];
//   listenelemente.forEach(listenelement => {
//     ids.push(listenelement.querySelector("#id").value);
//     console.log(ids);
//   })
//   return ids;
// }

socket.on("disconnect", (reason)=>{
  console.log("disconnected because: "+reason);
});

socket.on("artikel", (artikel) => {
  istVorhanden(artikel["id"])
    ? aenderungenEinfuegen(artikel)
    : artikelHinzufuegen(artikel);
});

socket.on("artikelLoeschenC", (id) => {
  console.log("SOCKET ARTIKEL LOESCHEN");
  console.log(id);
  if (istVorhanden(id)) {
    const listenelemente = document.querySelectorAll(".listenelement");

    for (let i = 0; i < listenelemente.length; i++) {
      if (listenelemente[i].querySelector("#id").value == id) {
        console.log("LOESCHEN");
        const el = listenelemente[i];
        animiereEntfernen(listenelemente[i]);
      }
    }
  }
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
  const listenelement = e.target.parentNode.parentNode.parentNode;
  const formularElement = e.target.parentNode.parentNode;
  console.log(formularElement)
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
    if (element === "name"){
      listenelement.querySelector(
        ".eintragsname"
      ).innerText = formularElement.querySelector(`#${element}`).value;
    }
  });

  if (data.get("id") === "") {
    listenelement.remove();
  }

  const neuerArtikel = JSON.stringify(Object.fromEntries(data));
  // socket.emit("artikel", neuerArtikel);
  socket.emit("artikel", Object.fromEntries(data));

  // FIREFOX!!!!!!!!!!!!!!!!!!!
  menueZuklappen(
    listenelement.querySelector(".formular"),
    listenelement.querySelector(".pfeil")
  );
  listenelement.querySelector(".elementuebersicht").classList.toggle("aktiv");
}

function detailsAnzeigen(e) {
  // FIREFOX!!!!!!!!!!!!
  let path = e.target.parentNode.parentNode;
  console.log(e.target);
  if(path.querySelector(".elementuebersicht") == null){
    path = path.parentNode;
    console.log(path);
  }
  // e.path[2].querySelector(".formular") == null
  //   ? (path = path.parentNode)
  //   : (path = path.parentNode);

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
  console.log("ID");
  console.log(id);
  //if (id != "") socket.emit("artikelLoeschen", id);
  const el = e.target;//e.path[2];
  console.log(el);
  animiereEntfernen(el);
  // setTimeout(()=> {
    if (id != "") socket.emit("artikelLoeschenS", id);
  buttonDeaktivieren();
  // }, 300);

  

  // FIREFOX!!!!!!!!!
  //e.path[2].remove();
}

//zur Verhinderung von mehrfachem ungewollten loeschen
function buttonDeaktivieren(){
  const listenelemente = document.querySelectorAll(".listenelement")
  listenelemente.forEach(element=>{
    let button = element.querySelector(".eintrag-entfernen");
    button.classList.toggle("button-deaktivieren");
    button.removeEventListener("click", eintragEntfernen, false);
    setTimeout(()=>{
      button.addEventListener("click", eintragEntfernen);
      button.classList.toggle("button-deaktivieren");
    }, 2500);
  });
}

function animiereEntfernen(el){
  el.animate({transform: 'translateX(200%)'}, {duration: 400});
  setTimeout(()=> {
    el.remove();
  }, 400);
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

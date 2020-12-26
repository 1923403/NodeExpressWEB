var socket_io = require("socket.io");
var io = socket_io();
var socketAPI = {};
const path = require("path");
const fs = require("fs");
socketAPI.io = io;

io.on("connection", (socket) => {
  socket.on("artikel", (artikel) => {
    console.log("artikel angekommen: ");
    console.log(artikel);
    let rohdaten = fs.readFileSync(
      path.join(__dirname, "..", "data", "listen.json")
    );
    console.log(JSON.parse(rohdaten));
  });
});

module.exports = socketAPI;

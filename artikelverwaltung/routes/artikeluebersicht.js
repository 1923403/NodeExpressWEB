var express = require("express");
const path = require("path");
var router = express.Router();

/* GET artikeluebersicht page. */
router.get("/", (req, res) => {
  var data;
  console.log("a gesendet");
  res.render("artikeluebersicht", { name1: "test1", name2: "test2" });
  //res.sendFile(path.join(__dirname, "..", "public", "artikeluebersicht.html"));
  //res.sendFile(path.join(__dirname, "..", "data", "listen.json"));
});

router.get("/data", (req, res) => {});
module.exports = router;

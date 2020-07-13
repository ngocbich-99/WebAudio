const express = require("express");
const upload = require("express-fileupload");
const multer = require("multer");
const mysql = require("mysql");
const { request, response } = require("express");
const port = 8000;
const app = express();

app.use(express.static("public"));
var fs = require("fs");
var path = require("path");
app.use("/static", express.static("public"));
app.use(upload());

//connect to mysql
const conn = mysql.createConnection({
  password: "123456789",
  user: "root",
  database: "audioDB",
  host: "localhost",
  port: "3306",
});
conn.connect(function (error) {
  if (!!error) console.log(error);
  else console.log("database connected");
});

// set port, listen for requests
const server = app.listen(port, (error) => {
  if (error) return console.log(`Error: ${error}`);

  console.log(`Server listening on port ${server.address().port}`);
});

// read page index.html
app.get("/", (req, res) => {
  console.log(`browser request to server`);
  let sql = "select * from audioWeb";
  let query = conn.query(sql, (err, rows) => {
    if (err) throw err;
    res.sendFile(
      path.join(__dirname, "/public/index.html", {
        audioWeb: rows,
      })
    );
  });
});

//post upload audio and save it into mysql
app.post("/upload", (req, res) => {
  if (req.files) {
    console.log(req.files);
    var file = req.files.file;
    var filename = file.name;
    console.log(filename);

    file.mv("./audioList/" + filename, function (err) {
      if (err) {
        res.send(err);
      } else {
        //res.send("audio uploaded");
        let data = { fileName: filename, filePath: "./audioList/" + filename };
        let sqlInsert = "insert into audioWeb SET ?";
        let query = conn.query(sqlInsert, data, (err, rerults) => {
          if (err) throw err;
          res.redirect("/");
        });
      }
    });
  }
});

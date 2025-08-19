require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database/db.js")
const bukuRoutes = require("./routes/perpusdb.js");
const port = process.env.PORT;
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'main-layout'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use("/buku", bukuRoutes);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
  });
  
});

app.get("/buku-view", (req, res) => {
  db.query("SELECT * from buku", (err, buku) => { // Mengambil data dari tabel buku
    if (err) return res.status(500).send("Internal Server Error");
    res.render("buku", { // Merender file buku.ejs
      layout: "layouts/main-layout",
      buku: buku, // Mengirim data buku ke view
    });
  });
});

app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
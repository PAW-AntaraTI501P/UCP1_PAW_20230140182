const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const bookRoutes = require('./routes/books');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.use('/books', bookRoutes);

app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
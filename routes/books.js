const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM books ORDER BY id DESC');
    res.render('index', {
      layout: 'layouts/main-layout',
      title: 'Perpustakaan',
      books,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

router.get('/add', (req, res) => {
  res.render('add-book', {
    layout: 'layouts/main-layout',
    title: 'Tambah Buku',
  });
});

router.post('/', async (req, res) => {
  try {
    const { judul, penulis, penerbit, tahun_terbit } = req.body;
    await db.query(
      'INSERT INTO books (judul, penulis, penerbit, tahun_terbit) VALUES (?, ?, ?, ?)',
      [judul, penulis, penerbit, tahun_terbit]
    );
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambahkan buku');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    const book = rows[0];
    if (!book) {
      return res.status(404).send('Buku tidak ditemukan');
    }
    res.render('edit-book', {
      layout: 'layouts/main-layout',
      title: 'Edit Buku',
      book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { judul, penulis, penerbit, tahun_terbit } = req.body;
    await db.query(
      'UPDATE books SET judul = ?, penulis = ?, penerbit = ?, tahun_terbit = ? WHERE id = ?',
      [judul, penulis, penerbit, tahun_terbit, req.params.id]
    );
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengupdate buku');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menghapus buku');
  }
});

module.exports = router;
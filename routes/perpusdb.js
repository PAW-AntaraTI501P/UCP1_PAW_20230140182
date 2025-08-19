const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Buku tidak ditemukan');
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { judul, penulis, penerbit, tahun_terbit } = req.body;
    if (!judul || judul.trim() === '') {
        return res.status(400).send('Judul tidak boleh kosong');
    }
    if (!penulis || penulis.trim() === '') {
        return res.status(400).send('Penulis tidak boleh kosong');
    }

    const newBuku = { 
        judul: judul.trim(), 
        penulis: penulis.trim(), 
        penerbit: penerbit ? penerbit.trim() : null, 
        tahun_terbit: tahun_terbit || null 
    };

    db.query('INSERT INTO buku SET ?', newBuku, (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.status(201).json({ id: results.insertId, ...newBuku });
    });
});

router.put('/:id', (req, res) => {
    const { judul, penulis, penerbit, tahun_terbit } = req.body;

    db.query('UPDATE buku SET judul = ?, penulis = ?, penerbit = ?, tahun_terbit = ? WHERE id = ?', 
        [judul, penulis, penerbit, tahun_terbit, req.params.id], 
        (err, results) => {
            if (err) return res.status(500).send('Internal Server Error');
            if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
            res.json({ id: req.params.id, judul, penulis, penerbit, tahun_terbit });
    });
});

router.delete('/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Buku tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;
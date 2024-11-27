const express = require('express');
const path = require('path');
const app = express();

// Limit upload size to 25 MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'yourdatabase'
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM requests WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Request not found' });
        res.json(result[0]);
    });
});

app.put('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const { student_name, student_id, faculty, major, year, status } = req.body;

    db.query(
        'UPDATE requests SET student_name = ?, student_id = ?, faculty = ?, major = ?, year = ?, status = ? WHERE id = ?',
        [student_name, student_id, faculty, major, year, status, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Request updated successfully' });
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


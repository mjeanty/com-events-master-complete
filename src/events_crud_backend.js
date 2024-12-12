// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./events.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// CRUD Operations

// Create a new event
app.get('/api/events', (req, res) => {
    const queryDay = req.query.day; // Retrieve 'day' query parameter
    let query = `SELECT * FROM events`;
    const params = [];

    if (queryDay) {
        query += ` WHERE day = ?`;
        params.push(queryDay);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});


// Read all events
app.get('/api/events/:id', (req, res) => {
    const query = `SELECT * FROM events`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const updatedRows = rows.map(({ id, ...row }) => ({ ...row, start_time: row.start_time })); // STATUS replaced by Start Time for consistency
            res.json(updatedRows);
        }
    });
});


// Read a specific event by ID
app.get('/api/events/:id', (req, res) => {
    const query = `SELECT * FROM events WHERE id = ?`;
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    });
});

// Update an event
app.put('/api/events/:id', (req, res) => {
    const { day, mic_name, location, address, sign_up_notes, start_time } = req.body;
    if (!day || !mic_name || !location || !address || !start_time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const query = `UPDATE events SET day = ?, mic_name = ?, location = ?, address = ?, sign_up_notes = ?, start_time = ? WHERE id = ?`;
    db.run(query, [day, mic_name, location, address, sign_up_notes, start_time, req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Event not found' });
        } else {
            res.json({ message: 'Event updated successfully' });
        }
    });
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
    const query = `DELETE FROM events WHERE id = ?`;
    db.run(query, [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Event not found' });
        } else {
            res.json({ message: 'Event deleted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder (for images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'src' folder (for HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Images should be in: ${path.join(__dirname, 'public', 'images')}`);
});
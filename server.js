const express = require('express');
const path = require('path');

const app = express();
const PORT = 65002;

app.use(express.static('example'));

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'main.js'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

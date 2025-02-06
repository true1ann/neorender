const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 65002;

app.use(express.static('example'));

app.use((req, res, next) => {
  exec('pnpm buildDev', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Build failed');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    next();
  });
});

app.get('/main.js', (req, res) => {
  // TODO: make auto-build action when fetching
  res.sendFile(path.join(__dirname, 'dist', 'bundle.js'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

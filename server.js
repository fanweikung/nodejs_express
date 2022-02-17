const express = require('express');
const path = require('path');

const routes = require('./routes'); // will default to ./routes/index.js

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// use express static middleware with the directory
app.use(express.static(path.join(__dirname, './static')));

// use another route to catch all; need to call the routes() function to get the router object back
app.use('/', routes());

// app.get('/', (request, response) => {
//   // response.send('Hello Express :)')
//   // response.sendFile(path.join(__dirname, 'static/index.html'));
//   response.render('pages/index', { pageTitle: 'Welcome' });
// });

// app.get('/speakers', (request, response) => {
//   response.sendFile(path.join(__dirname, './static/speakers.html'));
// });

app.listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});

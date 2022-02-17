const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const SpeakerService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');

const speakerService = new SpeakerService('./data/speakers.json');
const feedbackService = new FeedbackService('./data/feedback.json');

const routes = require('./routes'); // will default to ./routes/index.js

const app = express();
const port = 3000;

// to be cleaned up?
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// make express trust cookies that are passed from reversed proxy
app.set('trust proxy', 1);

// session managment middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['AGEawgeASG', 'fasdgsajGAEr'],
  })
);

// use express static middleware with the directory
app.use(express.static(path.join(__dirname, './static')));

// use another route to catch all; need to call the routes() function to get the router object back
app.use('/', routes({ speakerService, feedbackService }));

// should  have a single place to mount/route
// app.use('/speakers', speakersRoute());

app.listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});

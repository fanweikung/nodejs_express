const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

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

app.locals.siteName = 'ROUX Meetups ';

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

app.use(async (request, response, next) => {
  // response.locals.someVariable = 'hello';
  const names = await speakerService.getNames();
  response.locals.speakerNames = names;
  console.log(response.locals.speakerNames);
  try {
    return next();
  } catch {
    return next(err);
  }
});

// use another route to catch all; need to call the routes() function to get the router object back
app.use('/', routes({ speakerService, feedbackService }));

// should  have a single place to mount/route
// app.use('/speakers', speakersRoute());

// if no matching route, returns 404 error
app.use((request, response, next) => {
  return next(createError(404, 'File not found'));
});

// Express convention: 4 argument is Error handling middleware
app.use((err, request, response, next) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});

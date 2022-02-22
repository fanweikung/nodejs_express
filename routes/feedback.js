const express = require('express');

const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();

      // In case an error happens, the request gets redirected to the get route, to the feedback route. And in the get route, we can now fetch those errors from the session object.
      const errors = request.session.feedback ? request.session.feedback.errors : false;

      const successMessage = request.session.feedback ? request.session.feedback.message : false;

      request.session.feedback = {}; // reset the state of session object to empty

      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors, // then add errors as a template variable when render
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  // When a request now comes into this route, all these checks will run and in the end, the last next handler, will lead to the actual handler function that we created.
  router.post(
    '/',
    [
      check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is required'),
      check('email').trim().isEmail().normalizeEmail().withMessage('A valid email is required'),
      check('title').trim().isLength({ min: 3 }).escape().withMessage('A title is required'),
      check('message').trim().isLength({ min: 5 }).escape().withMessage('A message is required'),
    ],
    async (request, response) => {
      const errors = validationResult(request); // function provided by express-validator to check if any errors
      if (!errors.isEmpty()) {
        // Createa a new object on request.session for evrything feedback related
        request.session.feedback = {
          // Create a property, errors, and then use a function provided by express-validator that is on the errors object, and it's array. So this will give us then an array of errors from express-validator.
          errors: errors.array(),
        };
        // The reason to store the errors on the session object: Because to display the feedback page again, we will now redirect to the get route again. So I'm now adding return response.redirect and I want to redirect to /feedback.
        // A good practice: Because every time you send a form, you want to avoid that a user can just hit the reload button to send it again.
        // In case an error happens, the request gets redirected to the get route, to the feedback route. And in the get route, we can now fetch those errors from the session object.
        return response.redirect('/feedback');
      }

      const { name, email, title, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);

      request.session.feedback = {
        message: 'Thank you for your feedback!',
      };
      return response.redirect('feedback');
    }
  );

  return router;
};

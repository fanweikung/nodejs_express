const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (request, response) => {
    const speakers = await speakerService.getList();

    //return response.json(speakers);
    response.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers });
  });

  router.get('/:shortname', async (request, response) => {
    const speaker = await speakerService.getSpeaker(request.params.shortname);
    console.log(speaker);

    response.render('layout', { pageTitle: 'Speaker', template: 'speakers-detail', speaker });
  });
  return router;
};

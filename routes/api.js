'use strict';
const IssueController = require('../controllers/issueController.js');

module.exports = function (app) {

  const issueController = new IssueController();

  app.route('/api/issues/:project')

    .get(async (req, res) => {
      try {
        const issues = await issueController.getIssues(req)

        res.json(issues)
      } catch (error) {
        console.log('error in GET /api/issues/project:\n', error)

        res.json({
          error: error.message || 'unexpected error occured'
        })
      }

    })

    .post(async (req, res) => {
      try {
        const issue = await issueController.createIssue(req)

        res.json(issue)
      } catch (error) {
        res.json({
          error: error.message
        })
      }
    })

    .put(async (req, res) => {
      try {
        const responseBody = await issueController.updateIssue(req)

        res.json(responseBody)
      } catch (error) {
        const responseBody = {
          error: error.message
        };

        if (req.body._id) {
          responseBody._id = req.body._id
        }

        res.json(responseBody)
      }
    })

    .delete(async (req, res) => {
      try {
        const responseBody = await issueController.deleteIssue(req)

        res.json(responseBody)
      } catch (error) {
        const responseBody = {
          error: error.message
        };

        if (req.body._id) {
          responseBody._id = req.body._id
        }

        res.json(responseBody)
      }
    })

};


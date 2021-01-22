const Issue = require('../models/issue.js');



class IssueController {
  async createIssue(request) {
    try {
      const project = request.params.project
      const { issue_title, issue_text, created_by, assigned_to } = request.body

      if (!issue_title || !issue_text || !created_by) {
        throw new Error('required field(s) missing')
      };

      const currentTime = new Date();

      const issue = new Issue({
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        created_on: currentTime,
        updated_on: currentTime,
        open: true,
        status_text: ''
      });

      const createdIssue = await issue.save()

      return createdIssue
    } catch (error) {
      console.log('error in createIssue:\n', error)

      throw error
    };
  };

  async getIssues(request) {
    try {
      const { project } = request.params;
      const filters = request.query;
      const issues = await Issue.find({ project, ...filters })

      return issues
    } catch (error) {
      console.log('error in getIssues:\n', error)
    };
  };

  async updateIssue(request) {
    const missingIdErrorMessage = 'missing _id';
    const noUpdateFieldsErrorMessage = 'no update field(s) sent';
    try {
      const { project } = request.params;
      const { _id, ...optionalProps } = request.body

      if (!_id) {
        throw new Error(missingIdErrorMessage)
      }

      if (Object.keys(optionalProps).length === 0) {
        throw new Error(noUpdateFieldsErrorMessage)
      }

      const updateBody = {
        project,
        ...optionalProps,
        updated_on: new Date()
      }

      const response = await Issue.findByIdAndUpdate(_id, updateBody, { useFindAndModify: false })
      console.log('response', response)

      if (response === null) {
        throw new Error('could not update')
      }

      return { result: 'successfully updated', _id }
    } catch (error) {
      console.log('error in updateIssue:\n', error)

      if (error.message !== missingIdErrorMessage && error.message !== noUpdateFieldsErrorMessage) {
        throw new Error('could not update')
      }

      throw error
    };
  };

  async deleteIssue(request) {
    const missingIdErrorMessage = 'missing _id';
    try {
      // const { project } = request.params;
      const { _id } = request.body;

      if (!_id) {
        throw new Error(missingIdErrorMessage)
      }

      const response = await Issue.findByIdAndDelete(_id, { useFindAndModify: false })

      if (response === null) {
        throw new Error('could not delete')
      }
      return { result: 'successfully deleted', _id }
    } catch (error) {
      console.log('error in deleteIssue:\n', error)

      if (error.message !== missingIdErrorMessage) {
        throw new Error('could not delete')
      }

      throw error
    };
  };





};

module.exports = IssueController;
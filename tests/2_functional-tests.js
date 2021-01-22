const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', function () {

  suite('Routing Tests', function () {

    suite('POST /api/issues/{project} => create an issue', function () {

      test('Create an issue with every field', async () => {
        const projectName = 'testProject'
        const requestBody = {
          issue_title: 'title',
          issue_text: 'text',
          created_by: 'name',
          assigned_to: 'other name',
          status_text: 'in qa'
        }
        const res = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(requestBody)

        assert.equal(res.body.issue_text, requestBody.issue_text)
        assert.equal(res.body.issue_title, requestBody.issue_title)
        assert.equal(res.body.created_by, requestBody.created_by)
        assert.equal(res.body.assigned_to, requestBody.assigned_to)
        assert.isNumber(Date.parse(res.body.created_on))
        assert.isNumber(Date.parse(res.body.updated_on))
        assert.property(res.body, 'open')
        assert.isBoolean(res.body.open)
        assert.isTrue(res.body.open)
        assert.property(res.body, '_id')
        assert.isNotEmpty(res.body._id)
        assert.equal(res.body.status_text, '')
        assert.equal(res.body.project, projectName)

      });

      test('Create an issue with required fields only', async () => {
        const projectName = 'testProject'
        const requestBody = {
          issue_title: 'title',
          issue_text: 'text',
          created_by: 'name'
        }
        const res = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(requestBody)

        assert.equal(res.body.issue_text, requestBody.issue_text)
        assert.equal(res.body.issue_title, requestBody.issue_title)
        assert.equal(res.body.created_by, requestBody.created_by)
        assert.equal(res.body.assigned_to, requestBody.assigned_to)
        assert.isNumber(Date.parse(res.body.created_on))
        assert.isNumber(Date.parse(res.body.updated_on))
        assert.property(res.body, 'open')
        assert.isBoolean(res.body.open)
        assert.isTrue(res.body.open)
        assert.property(res.body, '_id')
        assert.isNotEmpty(res.body._id)
        assert.equal(res.body.status_text, '')
        assert.equal(res.body.project, projectName)
      });

      test('Create an issue with missing required fields', async () => {
        const projectName = 'testProject'
        const requestBody = { created_by: 'name' }
        const res = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(requestBody)

        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'required field(s) missing')
      })

    });

    suite('GET /api/issues/{project}', function () {

      test('View issues on a project', async () => {
        const projectName = 'get_issues_test_' + Date.now().toString().substring(7);
        const reqBody1 = {
          issue_title: 'one',
          issue_text: 'text',
          created_by: 'name'
        }

        const reqBody2 = {
          issue_title: 'two',
          issue_text: 'text',
          created_by: 'jim'
        }

        const reqBody3 = {
          issue_title: 'three',
          issue_text: 'text',
          created_by: 'john'
        }

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody1)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody2)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody3)

        const res = await chai.request(server)
          .get(`/api/issues/${projectName}`)

        assert.equal(res.body.length, 3)

      })

      test('View issues on a project with one filter', async () => {
        const searchName = 'john'
        const projectName = 'get_issues_test_' + Date.now().toString().substring(7);
        const reqBody1 = {
          issue_title: 'one',
          issue_text: 'text',
          created_by: searchName
        }

        const reqBody2 = {
          issue_title: 'two',
          issue_text: 'text',
          created_by: 'jim'
        }

        const reqBody3 = {
          issue_title: 'three',
          issue_text: 'text',
          created_by: searchName
        }
        const reqBody4 = {
          issue_title: 'four',
          issue_text: 'text',
          created_by: searchName
        }

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody1)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody2)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody3)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody4)

        const res = await chai.request(server)
          .get(`/api/issues/${projectName}` + `?created_by=${searchName}`)

        assert.equal(res.body.length, 3)
      })

      test('View issues on a project with multiple filters', async () => {
        const searchName = 'john'
        const searchText = 'text'
        const projectName = 'get_issues_test_' + Date.now().toString().substring(7);
        const reqBody1 = {
          issue_title: 'one',
          issue_text: searchText,
          created_by: searchName
        }

        const reqBody2 = {
          issue_title: 'two',
          issue_text: 'lalala',
          created_by: 'jim'
        }

        const reqBody3 = {
          issue_title: 'three',
          issue_text: 'doodoo',
          created_by: searchName
        }
        const reqBody4 = {
          issue_title: 'four',
          issue_text: searchText,
          created_by: searchName
        }

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody1)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody2)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody3)

        await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(reqBody4)

        const res = await chai.request(server)
          .get(`/api/issues/${projectName}` + `?created_by=${searchName}&issue_text=${searchText}`)

        assert.equal(res.body.length, 2)
      })
    });

    suite('PUT /api/issues/{project} => update an issue', function () {

      test('Update one field on an issue', async () => {
        const projectName = 'testProject'
        const originalIssue = {
          issue_title: 'title to update',
          issue_text: 'text',
          created_by: 'name'
        }
        const newTitle = 'New Title'

        const issueToUpdate = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(originalIssue)

        const updateResponse = await chai.request(server)
          .put(`/api/issues/${projectName}`)
          .send({ _id: issueToUpdate.body._id, issue_title: newTitle })


        assert.equal(updateResponse.body.result, 'successfully updated')
        assert.equal(updateResponse.body._id, issueToUpdate.body._id)

        const url = `/api/issues/${projectName}?_id=${issueToUpdate.body._id}`

        const getResponse = await chai.request(server).get(url)

        const issue = getResponse.body[0]
        assert.equal(issue.issue_title, newTitle)
        assert.equal(issue.issue_text, originalIssue.issue_text)
        assert.equal(issue.created_by, originalIssue.created_by)
      })

      test('Update multiple fields on an issue', async () => {
        const projectName = 'testProject'
        const originalIssue = {
          issue_title: 'original title',
          issue_text: 'original text',
          created_by: 'original name'
        }
        const newTitle = 'new title'
        const newName = 'new name'

        const issueToUpdate = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(originalIssue)

        const updateResponse = await chai.request(server)
          .put(`/api/issues/${projectName}`)
          .send({ _id: issueToUpdate.body._id, issue_title: newTitle, created_by: newName })

        assert.equal(updateResponse.body.result, 'successfully updated')
        assert.equal(updateResponse.body._id, issueToUpdate.body._id)

        const url = `/api/issues/${projectName}?_id=${issueToUpdate.body._id}`

        const getResponse = await chai.request(server).get(url)

        const issue = getResponse.body[0]
        assert.equal(issue.issue_title, newTitle)
        assert.equal(issue.issue_text, originalIssue.issue_text)
        assert.equal(issue.created_by, newName)
      })

      test('Update an issue with missing _id', async () => {
        const projectName = 'Test_project'
        const response = await chai.request(server).put(`/api/issues/${projectName}`)
        console.log('response body', response.body)

        assert.equal(response.body.error, 'missing _id')
      })

      test('Update an issue with no fields to update', async () => {
        const projectName = 'Test_Project'
        const originalIssue = {
          issue_title: 'original title',
          issue_text: 'original text',
          created_by: 'original name'
        }

        const issueToUpdate = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(originalIssue)

        const response = await chai.request(server)
          .put(`/api/issues/${projectName}`)
          .send({ _id: issueToUpdate.body._id })

        assert.equal(response.body.error, 'no update field(s) sent')
        assert.equal(response.body._id, issueToUpdate.body._id)
      })

      test('Update issue with invalid _id', async () => {
        const projectName = 'Test_Project2'
        const invalidId = 'i2un3489'

        const response = await chai.request(server)
          .put(`/api/issues/${projectName}`)
          .send({ _id: invalidId, created_by: 'yo mama' })
        // console.log(response.body)

        assert.equal(response.body.error, 'could not update')
        assert.equal(response.body._id, invalidId)
      })
    });

    suite('DELETE /api/issues/{project} => delete an issue', function () {

      test('Delete an issue', async () => {
        const projectName = 'Test_Project_Delete'
        const originalIssue = {
          issue_title: 'original_title',
          issue_text: 'original_text',
          created_by: 'original_name'
        }
        const issueToDelete = await chai.request(server)
          .post(`/api/issues/${projectName}`)
          .send(originalIssue)

        const deleteResponse = await chai.request(server)
          .delete(`/api/issues/${projectName}`)
          .send({ _id: issueToDelete.body._id })

        assert.equal(deleteResponse.body.result, 'successfully deleted')
        assert.equal(deleteResponse.body._id, issueToDelete.body._id)
      })

      test('Delete issue with invalid _id', async () => {
        const projectName = 'invalid_id_delete_test'
        const invalid_id = '29384jfq938jf94'

        const response = await chai.request(server)
          .delete(`/api/issues/${projectName}`)
          .send({ _id: invalid_id })

        assert.equal(response.body.error, 'could not delete')
        assert.equal(response.body._id, invalid_id)
      })

      test('Delete an issue with missing _id', async () => {
        const projectName = 'missing_id_delete_test'
        const response = await chai.request(server).delete(`/api/issues/${projectName}`)

        assert.equal(response.body.error, 'missing _id')
      })
    });

  });
});

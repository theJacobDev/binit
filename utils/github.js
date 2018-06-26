const octokit = require('@octokit/rest')()
const CLI = require('clui')
const git = require('simple-git/promise')
const Spinner = CLI.Spinner
const Configstore = require('configstore')
const package = require('../package.json')
const inputs = require('./inputs')
const messages = require('./messages')

const conf = new Configstore(package.name)

module.exports = {
  getStoredToken: () => conf.get('token'),
  init: async () => await git().init(),
  clone: async (url) => {
    const status = new Spinner(messages.cloning)
    status.start()
    try {
      await git().clone(url, './')
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  },
  setRemoteUrl: async (url) => await git().addRemote('origin', url),
  authenticate: async (token) => {
    octokit.authenticate({
      type: 'oauth',
      token: token
    })
  },
  setCredentials: async () => {
    const credentials = await inputs.askForGithubCredentials()
    octokit.authenticate({ type: 'basic', ...credentials })
  },
  registerNewToken: async () => {
    const status = new Spinner(messages.authenticating)
    status.start()

    try {
      const response = await octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: messages.binitDescription
      })

      const token = response.data.token

      if (token) {
        conf.set('token', token)
        return token
      } else {
        throw new Error(messages.missingTokenInResponse)
      }
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  },
  createRemoteRepo: async () => {
    const answers = await inputs.askForNewRepositoryDetails()

    const data = {
      name: answers.name,
      description: answers.description,
      private: (answers.visibility === 'private')
    }

    const status = new Spinner(messages.creatingRepo)
    status.start()

    try {
      const response = await octokit.repos.create(data)
      return response.data.ssh_url
    } catch(err) {
      throw err
    } finally {
      status.stop()
    }
  },
  pushCommit: async (message) => {
    const status = new Spinner(messages.initPush)
    status.start()

    try {
      await git().add('./*')
      await git().commit(message)
      await git().push('origin', 'master')
    } catch (err) {
      throw err
    } finally {
      status.stop()
    }
  }
}
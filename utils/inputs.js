const inquirer = require('inquirer')
const files = require('./files')
const messages = require('./messages')

module.exports = {
  askForGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: messages.githubUsername,
        validate: value => value.length ? true : messages.githubUsernameError
      },
      {
        name: 'password',
        type: 'password',
        message: messages.githubPassword,
        validate: value => value.length ? true : messages.githubPasswordError
      }
    ]
    return inquirer.prompt(questions)
  },

  askForRepoToClone: () => {
    const questions = [
      {
        name: 'url',
        type: 'input',
        message: messages.cloneRepository,
        validate: value => value.length ? true : messages.cloneRepositoryError
      }
    ]
    return inquirer.prompt(questions)
  },

  askToCreateRepository: () => {
    const questions = [
      {
        name: 'create',
        type: 'confirm',
        message: messages.createRepository,
        default: true
      }
    ]
    return inquirer.prompt(questions)
  },

  askForNewRepositoryDetails: () => {
    const questions = [
      {
        name: 'name',
        type: 'input',
        message: messages.repositoryName,
        default: files.currentDirectoryPath(),
        validate: value => value.length ? true : messages.repositoryNameError
      },
      {
        name: 'description',
        type: 'input',
        message: messages.repositoryDescription
      },
      {
        name: 'visibility',
        type: 'list',
        message: messages.repositoryVisibility,
        choices: ['public', 'private'],
        default: 'public'
      }
    ]
    return inquirer.prompt(questions)
  },

  askToPush: () => {
    const questions = [
      {
        name: 'push',
        type: 'confirm',
        message: messages.commit,
        default: true
      }
    ]
    return inquirer.prompt(questions)
  },

  askForPushDetails: () => {
    const questions = [
      {
        name: 'message',
        type: 'input',
        message: messages.commitMessage,
        default: 'hello world',
        validate: value => value.length ? true : messages.commitMessageErorr
      }
    ]
    return inquirer.prompt(questions)
  }
}
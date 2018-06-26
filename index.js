const chalk = require('chalk')
const clear = require('clear')
const shell = require('shelljs')
const figlet = require('figlet')
const files = require('./utils/files')
const inputs = require('./utils/inputs')
const messages = require('./utils/messages')
const gh = require('./utils/github')
const log = console.log

clear()

log(chalk.green(
  figlet.textSync('Binit', { horizontalLayout: 'full', verticalLayout: 'full' })
))

// Start only in directories without git initialized
if (files.directoryExists('.git')) {
  log(chalk.red(messages.onlyEmptyDirectories))
  process.exit()
}

// Check if use has git installed
if (!shell.which('git')) {
  log(chalk.red(messages.gitNotInstalled))
  process.exit()
}

const getGithubToken = async () => {
  let token = gh.getStoredToken()

  if (token) {
    return token
  }

  await gh.setCredentials()
  token = await gh.registerNewToken()
  return token
}

const run = async () => {
  try {
    const cloneRepo = await inputs.askForRepoToClone()
    await gh.clone(cloneRepo.url)
    files.resetGitFiles()
    await gh.init()
  
    const createNewRepo = await inputs.askToCreateRepository()
  
    if (createNewRepo.create) {
      // First check for token and authenticate ourselves
      const token = await getGithubToken()
      await gh.authenticate(token)
  
      // Create repo and setup our local git
      const url = await gh.createRemoteRepo()
      await gh.setRemoteUrl(url)
  
      // Push first commit to new repo
      const push = await inputs.askToPush()
      if (push.push) {
        const commitMessage = await inputs.askForPushDetails()
        const done = await gh.pushCommit(commitMessage.message)
        if (done) {
          log(chalk.green(messages.thanksForUsingBinit))
        }
      }
    } else {
      log(chalk.green(messages.thanksForUsingBinit))
    }
  } catch (err) {
    if (err) {
      switch (err.code) {
        case 401:
          log(chalk.red(messages.authError))
          break
        case 422: 
          log(chalk.red(messages.repoExists))
          break
        default:
          log(chalk.red(err))
      }
    }
  }
}

run()
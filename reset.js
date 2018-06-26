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

const run = async () => {
  try {
    await gh.setCredentials()
    const token = await gh.registerNewToken()
    log(chalk.green(messages.successTokenReset))
  } catch(err) {
    log(chalk.red(err))
  }
}

run()

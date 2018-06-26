const path = require('path')
const fs = require('fs-extra')
const touch = require('touch')

const currentDirPath = path.basename(process.cwd())

module.exports = {
  currentDirectoryPath: () => currentDirPath,
  directoryExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory()
    } catch (err) {
      return false
    }
  },
  resetGitFiles: () => {
    fs.removeSync('.git')
    fs.removeSync('README.md')
    fs.removeSync('LICENSE')
    touch('README.md')
    touch('LICENSE')
  }
}
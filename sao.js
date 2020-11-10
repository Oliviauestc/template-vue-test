const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  template: 'handlebars',
  // 模板引擎参数
  templateOptions: {
    helpers: {
      if_or(v1, v2, options) {
        if (v1 || v2) {
          return options.fn(this)
        }
        return options.inverse(this)
      },
      if_eq(a, b, opts) {
        return a === b
          ? opts.fn(this)
          : opts.inverse(this)
      },
      unless_eq(a, b, opts) {
        return a === b
          ? opts.inverse(this)
          : opts.fn(this)
      }
    }
  },
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project',
    },
    author: {
      type: 'string',
      message: 'Author',
    }
  },
  post({log, folderName, isNewFolder, chalk}) {
    log.success(`Your new Vue project has been successfully generated in ${chalk.underline(folderName)}!`)
    console.log(chalk.bold(`  To get started:\n`))
    if (isNewFolder) console.log(`  cd ${folderName}`)
    console.log(`  yarn`)
    console.log(`  yarn dev\n`)
    console.log(chalk.bold(`  To build for production:\n`))
    console.log(`  yarn build\n`)
  }
}

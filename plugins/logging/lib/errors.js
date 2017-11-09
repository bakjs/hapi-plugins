const PrettyError = require('pretty-error')

// Start default instance
const pe = PrettyError.start()

// Skip dist artifacts and Node internals
const skipFiles = [
  'module.js',
  'bootstrap_node.js',
  'next_tick.js'
]

const skipPackages = [
  'items-promise'
]

pe.skip((traceLine, lineNumber) => {
  if (!traceLine.file || skipFiles.indexOf(traceLine.file) !== -1 ||
        skipPackages.indexOf(traceLine.packageName) !== -1) {
    return true
  }
})

pe.skipNodeFiles()

function error (err) {
  if (!err) {
    return
  }

  /* eslint-disable no-console */
  console.log(pe.render(err))
}

// Console error unhandled promises
process.on('unhandledRejection', err => {
  error(err)
})

// Hide config package warns
process.env.SUPPRESS_NO_CONFIG_WARNING = true

// Exports
exports.error = error

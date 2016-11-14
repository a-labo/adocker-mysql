'use strict'

const co = require('co')
const adockerMysql = require('adocker-mysql')

let mysql = adockerMysql('my-mysql-container-01', {
  onError: (err) => {
    // Error handler for each commands
    console.error(err)
    process.exit(1)
  }
})

let { run, start, stop, remove, logs } = mysql.cli()
co(function * () {
  yield run()
  /* ... */
  yield logs()
  /* ... */
  yield stop()
  /* ... */
  yield start()

  yield remove({ force: true })
})

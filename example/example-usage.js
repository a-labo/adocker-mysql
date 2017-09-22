'use strict'

const adockerMysql = require('adocker-mysql')

const mysql = adockerMysql('my-mysql-container-01', {
  onError: (err) => {
    // Error handler for each commands
    console.error(err)
    process.exit(1)
  }
})

const {run, start, stop, remove, logs} = mysql.cli()
;(async () => {
  await run()
  /* ... */
  await logs()
  /* ... */
  await stop()
  /* ... */
  await start()

  await remove({force: true})
})()

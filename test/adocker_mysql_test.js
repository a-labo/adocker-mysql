/**
 * Test case for adockerMysql.
 * Runs with mocha.
 */
'use strict'

const adockerMysql = require('../lib/adocker_mysql.js')
const {equal} = require('assert')

describe('adocker-mysql', function () {
  this.timeout(500000)

  before(async () => {

  })

  after(async () => {

  })

  it('Adocker mysql', async () => {
    const mysql = adockerMysql('adocker-mysql-test-01')

    const {run, remove, logs, stop, isRunning, hasBuild} = mysql.cli()

    equal(await isRunning(), false)
    equal(await hasBuild(), false)
    await run()

    equal(await isRunning(), true)
    equal(await hasBuild(), true)

    await logs()

    await stop()

    equal(await isRunning(), false)
    equal(await hasBuild(), true)

    await remove({force: true})
  })
})

/* global describe, before, after, it */

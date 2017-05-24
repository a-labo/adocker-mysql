/**
 * Test case for adockerMysql.
 * Runs with mocha.
 */
'use strict'

const adockerMysql = require('../lib/adocker_mysql.js')
const { equal } = require('assert')
const co = require('co')

describe('adocker-mysql', function () {
  this.timeout(500000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Adocker mysql', () => co(function * () {
    let mysql = adockerMysql('adocker-mysql-test-01')

    let { run, remove, logs, stop, isRunning, hasBuild } = mysql.cli()

    equal(yield isRunning(), false)
    equal(yield hasBuild(), false)
    yield run()

    equal(yield isRunning(), true)
    equal(yield hasBuild(), true)

    yield logs()

    yield stop()

    equal(yield isRunning(), false)
    equal(yield hasBuild(), true)

    yield remove({ force: true })
  }))
})

/* global describe, before, after, it */

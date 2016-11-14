/**
 * Test case for adockerMysql.
 * Runs with mocha.
 */
'use strict'

const adockerMysql = require('../lib/adocker_mysql.js')
const assert = require('assert')
const co = require('co')

describe('adocker-mysql', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Adocker mysql', () => co(function * () {
    let mysql = adockerMysql('adocker-mysql-test-01')

    let { run, remove, logs } = mysql.cli()
    yield run()
    yield logs()
    yield remove({ force: true })
  }))
})

/* global describe, before, after, it */

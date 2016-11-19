/**
 * Docker mysql utility
 * @module adocker-mysql
 * @version 1.2.4
 */

'use strict'

const adockerMysql = require('./adocker_mysql')

let lib = adockerMysql.bind(this)

Object.assign(lib, adockerMysql, {
  adockerMysql
})

module.exports = lib

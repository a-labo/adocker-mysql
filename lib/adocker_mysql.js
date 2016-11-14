/**
 * Define commands for docker mysql
 * @function adockerMysql
 * @param {string} name - Container name
 * @param {Object} options - Optional settings
 * @returns {Object}
 */
'use strict'

const {
  logs, remove, run,
  start, stop
} = require('adocker/commands')
const path = require('path')

const handleError = (err) => {
  console.error(err)
  process.exit(1)
}

/** @lends adockerMysql */
function adockerMysql (name, options = {}) {
  let {
    image = 'mysql:latest',
    rootPassword = 'root',
    varDir = 'var/mysql',
    onError = handleError
  } = options
  let bundle = {
    run: run.bind(null, {
      name,
      env: `MYSQL_ROOT_PASSWORD=${rootPassword}`,
      volume: `${path.resolve(varDir)}:/var/lib/mysql`,
      detach: true
    }, image),
    logs: logs.bind(null, name),
    start: start.bind(null, name),
    stop: stop.bind(null, name),
    remove: remove.bind(null, name)
  }
  return Object.assign(bundle, {
    cli () {
      return Object.assign({},
        ...Object.keys(bundle).map((name) => ({
          [name]: (...args) => bundle[ name ](...args).catch(onError)
        }))
      )
    }
  })
}

module.exports = adockerMysql

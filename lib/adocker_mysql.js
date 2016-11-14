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
    onError = handleError,
    cwd = process.cwd()
  } = options
  let bundle = {
    /**
     * Run mysql container
     */
    run: run.bind(null, {
      name,
      env: `MYSQL_ROOT_PASSWORD=${rootPassword}`,
      volume: `${path.resolve(varDir)}:/var/lib/mysql`,
      detach: true
    }, image),
    /**
     * Show logs of mysql container
     */
    logs: logs.bind(null, name),
    /**
     * Start mysql container
     */
    start: start.bind(null, name),
    /**
     * Stop mysql container
     */
    stop: stop.bind(null, name),
    /**
     * Remove mysql container
     */
    remove: remove.bind(null, name),
    /**
     * Open terminal of mysql container
     */
    terminal: run.bind(null, {
      interactive: true,
      tty: true,
      link: `${name}:mysql`,
      rm: true
    }, 'mysql', 'sh', '-c', 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"')
  }
  return Object.assign(bundle, {
    cli () {
      return Object.assign({},
        ...Object.keys(bundle).map((name) => ({
          [name]: (...args) => {
            process.chdir(cwd)
            return bundle[ name ](...args).catch(onError)
          }
        }))
      )
    }
  })
}

module.exports = adockerMysql

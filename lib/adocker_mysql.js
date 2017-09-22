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
  start, stop, inspect
} = require('adocker/commands')
const path = require('path')
const {mkdirpAsync} = require('asfs')

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
    publish = false,
    network = 'default',
    onError = handleError,
    cwd = process.cwd(),
    characterSetServer = 'utf8mb4',
    collationServer = 'utf8mb4_unicode_ci'
  } = options

  varDir = path.resolve(varDir)
  const host = network === 'default' ? '$MYSQL_PORT_3306_TCP_ADDR' : name
  const bundle = {
    /**
     * Run mysql container
     * @returns {Promise}
     */
    run: (...args) => mkdirpAsync(varDir)
      .then(() => run({
        name,
        network,
        publish,
        env: `MYSQL_ROOT_PASSWORD=${rootPassword}`,
        volume: `${varDir}:/var/lib/mysql`,
        detach: true
      }, image, ...args, `--character-set-server=${characterSetServer}`, `--collation-server=${collationServer}`)),
    /**
     * Check if running
     * @returns {Promise.<boolean>}
     */
    isRunning: () => inspect(name).then(([info]) => Boolean(info && info.State.Running)),
    /**
     * Check if build
     * @returns {Promise.<boolean>}
     */
    hasContainer: () => inspect(name).then(([info]) => !!info),

    hasBuild () {
      console.warn('`hasBuild()` is deprecated. use `hasContainer()` instead.')
      return inspect(name).then(([info]) => !!info)
    },
    /**
     * Show logs of mysql container
     * @returns {Promise}
     */
    logs: logs.bind(null, name),
    /**
     * Start mysql container
     * @returns {Promise}
     */
    start: start.bind(null, name),
    /**
     * Stop mysql container
     * @returns {Promise}
     */
    stop: stop.bind(null, name),
    /**
     * Remove mysql container
     * @param {Object} [options={}] - Optional settings
     * @param {boolean} [options.force=false] - Force to remove
     * @returns {Promise}
     */
    remove: remove.bind(null, name),
    /**
     * Open terminal of mysql container
     * @returns {Promise}
     */
    terminal: run.bind(null, {
      interactive: true,
      tty: true,
      network,
      link: `${name}:mysql`,
      rm: true
    }, image, 'sh', '-c', `exec mysql -h"${host}" -P"3306" -uroot -p"${rootPassword}"`)
  }
  return Object.assign(bundle, {
    cli () {
      return Object.assign({},
        ...Object.keys(bundle).map((name) => ({
          [name]: (...args) => {
            process.chdir(cwd)
            return bundle[name](...args).catch(onError)
          }
        }))
      )
    }
  })
}

module.exports = adockerMysql

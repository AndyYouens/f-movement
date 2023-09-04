/**
 * © FormaServe Systems Ltd 1990 - 2018
 * www.formaserve.co.uk
 *
 * Making Tax Digital
 * VAT Module
 *
 * December 2018
 * All rights reserved
 *
 * Show all history of submissions
 *
 */
'use strict'
/**
 * Module dependencies.
 */
const express = require('express')
const router = express.Router()
const moment = require('moment')

const qs = require('querystring')
const url = require('url')
const path = require('path')


const debug = require('debug')('movement:index')
const cookieParser = require('cookie-parser')

const scriptName = path.basename(path.basename(__filename), '.js')

let history = []

// get current timestamp
let today = moment().format('Do MMM YYYY')
let opts = { format: '%s%v %c', code: '', symbol: '£' }

const title = 'f_MTD VAT - Payment History'

// Home page
router.get('/', function (req, res, next) {
  debug('--> Into index.js')

  // Force cookie
  res.cookie('copyright', 'FormaServe')
  res.cookie('basePath', __basedir)
  res.cookie('script', 'history.js')

  const { Connection, Statement } = require('idb-pconnector')

  async function execHistory() {
    debug('  --> Into execHistory')
    let schema = 'IOT'

    let sql = `select * from ${schema}.history order by Processed_DateTime desc`
    debug(`SQL: ${sql}`)

    const connection = new Connection({ url: '*LOCAL' })
    const statement = new Statement(connection)

    const history = await statement.exec(sql)

    // Logging for dev only
    if (environment === 'DEV') {
      debug(`History Results: ${JSON.stringify(history, null, 2)}`)
    }

    // Are we logged on?
    let accessFlag = true

    if (!req.cookies.oauth2Token) {
      accessFlag = false
    }

    // Render History
    res.render('history', {
      company: config.company,
      moment,
      formatCurrency,
      opts,
      title,
      today,
      output: history,
      vatNo,
      accessFlag
    })
  }

  execHistory().catch(error => {
    log.error(error)
  })
})

module.exports = router

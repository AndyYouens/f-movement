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
 * Show all movement of submissions
 *
 */
'use strict'
/**
 * Module dependencies.
 */
const express = require('express')
const router = express.Router()
const moment = require('moment')
const formatCurrency = require('format-currency')
const qs = require('querystring')
const url = require('url')
const path = require('path')


const debug = require('debug')('movement:index')
const cookieParser = require('cookie-parser')

const scriptName = path.basename(path.basename(__filename), '.js')

let movement = []

// get current timestamp
let today = moment().format('Do MMM YYYY')
let opts = { format: '%s%v %c', code: '', symbol: '£' }
const vatNo = ''
const title = 'f_Movement - Intruder Access'

// Home page
router.get('/', function (req, res, next) {
  debug('--> Into index.js')

  // Force cookie
  res.cookie('copyright', 'FormaServe')
  // res.cookie('basePath', __basedir)
  res.cookie('script', 'index.js')

  const { Connection, Statement } = require('idb-pconnector')

  async function execMovement() {
    debug('  --> Into execMovement')
    let schema = 'IOT'

    // let sql = `Select * from ${schema}.MoveIFS order by add_ts desc FETCH FIRST 10 ROWS ONLY;`
    let sql = `Select * from ${schema}.MoveIFS order by ID desc;`
    debug(`SQL: ${sql}`)

    const connection = new Connection({ url: '*LOCAL' })
    const statement = new Statement(connection)

    const movement = await statement.exec(sql)

    // Logging for dev only
    // if (environment === 'DEV') {
    debug(`SQL Results: ${JSON.stringify(movement, null, 2)}`)
    // }

    // Are we logged on?
    let accessFlag = true



    // Render movement
    res.render('index', {
      company: 'FormaServe',
      moment,
      formatCurrency,
      opts,
      title,
      today,
      output: movement,
      accessFlag
    })
  }

  execMovement().catch(error => {
    console.error(error)
  })
})

module.exports = router

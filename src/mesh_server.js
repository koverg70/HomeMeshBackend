import express from 'express'
import { addRedirect } from './web_handlers'
import { storeJSON } from './trend_data'

require('es6-promise').polyfill()
require('isomorphic-fetch')

export const nconf = {
  port: 3001,
  dataPath: 'C:/Users/koverg/Documents/Learning/data',
  publicHtml: 'C:/Users/koverg/Documents/Learning/HomeMeshUI/build',
  masterNodeUrl: 'http://192.168.1.190'
}

const app = express()

addRedirect(app, nconf.publicHtml, express, nconf)

app.listen(nconf.port, function () {
  console.log(`HomeMeshBackend is running on port ${nconf.port}!`)
})

const readSensors = () => fetch(`${nconf.masterNodeUrl}/V0:*`)
  .then((response) => {
    return response.status < 400 ? response.json() : { 'success': false, 'status': response.status }
  }, (reason) => {
    return { 'success': false, reason }
  })

const schedule = () => {
  // run each 10 seconds
  const frequency = 10
  // last run time
  let lastDate = new Date()
  const startTime = lastDate.getTime()
  // next save in this minute (after sensors read)
  let nextMinute = (lastDate.getMinutes() + (lastDate.getSeconds() >= (59 - frequency) ? 1 : 0)) % 60
  /**
    This function runs in every 10 seconds and does the following:
    - reads the sensor values from Mesh master
    - updates the statistics of errors
    - updates the average values
    - in every two minutes writes the values for trend curves
  */
  const runRegularly = () => {
    let currentDate = new Date()
    let time = currentDate.getTime()
    console.log(`Sensor update: ${time - startTime}...`)

    readSensors().then((data) => {
      console.log(`Data reveiced: ${JSON.stringify(data)}...`)
      if (currentDate.getMinutes() === nextMinute) {
        storeJSON(nconf.dataPath, data)
        console.log('Saving trend values...')
        nextMinute = (lastDate.getMinutes() + 2) % 60
      }
    })

    lastDate = currentDate
  }

  setInterval(runRegularly, 1000 * frequency)
  console.log(`Sensor update scheduled for every ${frequency} seconds.`)

  runRegularly()
}

schedule()

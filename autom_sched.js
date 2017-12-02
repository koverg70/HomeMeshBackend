// Scheduled job for downloading sensor data

var http = require('http')
var path = require('path')
var fs = require('fs')

var home_path = '/mnt/HD/HD_a2/Felhasznalok/Automation/data/'

var options = {
  hostname: '192.168.1.190',
  port: 80,
  path: '/V0:*',
  method: 'GET'
}

/* Date-based scheduler */
function runOnDate (date, job) {
  console.log('Scheduled for: ' + date)

  var now = (new Date()).getTime()
  var then = date.getTime()

  if (then < now) {
    process.nextTick(job)
    return null
  }

  return setTimeout(job, (then - now))
}

function nextEvenMinute () {
  var date = new Date()
  date.setMilliseconds(0)
  date.setSeconds(0)
  date.setMinutes(date.getMinutes() + (2 - date.getMinutes() % 2))
  return date
}

function readSensors () {
  console.log('Download started...')
  var res = http.get('http://192.168.1.190/V0:*', function (res) {
    console.log('Got response: ' + res.statusCode)
    res.setEncoding('utf8')
    res.on('data', function (data) {
          // console.log("Got data: " + data);
      storeJSON(data)
      runOnDate(nextEvenMinute(), readSensors)
    })
  }).on('error', function (e) {
    console.log('Got error: ' + e.message)
    runOnDate(nextEvenMinute(), readSensors)
  })
}

runOnDate(nextEvenMinute(), readSensors)

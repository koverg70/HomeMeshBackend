import fs from 'fs'
import path from 'path'

Number.prototype.padLeft = function (n, str) {
  return Array(n - String(this).length + 1).join(str || '0') + this
}

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
  }
}

export function storeJSON (homePath, data) {
  // data = data.replace(/([a-z][a-zA-Z0-9]+):/g, '"$1":')

  // console.log(data);
  // data = JSON.parse(data);

  var ttt = new Date(Date.parse(data.time))
  console.log('Time: ' + ttt.toString())
  console.log(ttt.getDate().padLeft(2, '0') + '/' + ttt.getHours().padLeft(2, '0'))

  mkdirSync(path.join(homePath, (ttt.getYear() + 1900).padLeft(4, '0')))
  var ppp = path.join(homePath, (ttt.getYear() + 1900).padLeft(4, '0'), (ttt.getMonth() + 1).padLeft(2, '0'))
  mkdirSync(ppp)

  data.id = ttt.getHours().padLeft(2, '0') + ttt.getMinutes().padLeft(2, '0')

  var fname = 'day_' + ttt.getDate().padLeft(2, '0') + '.json'
  ppp = path.join(ppp, fname)

  var saved = []
  try {
    saved = JSON.parse(fs.readFileSync(ppp, { options: 'utf8' }))
    console.log('Saved JSON contains ' + saved.length + ' entries.')
  } catch (err) {
    console.log('No file, creating a new one.')
    console.log(err)
  }

  saved.push(data)

  fs.writeFile(ppp, JSON.stringify(saved), function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Successful append.')
    }
  })
}

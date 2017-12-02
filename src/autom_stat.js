/**
  NOTE: currently this file is not used

  Recursively iterates file in subdirectories and merges json file in a directory into one.
  This was used to migrate from one file per two seconds to one file per day version.
*/

var Promise = require('bluebird')
var fsp = require('fs-promise')
var home_path = '/mnt/HD/HD_a2/Felhasznalok/Automation/data/'
ű

function matchJson (name) {
  const MINUTE_JSON_PATTERN = /^([0-9]{2})([0-9]{2}).json$/g
  var m = MINUTE_JSON_PATTERN.exec(name)
  if (m !== null) {
    return [m[1], m[2]]
  } else {
    return null
  }
}

function mergeJsons (dir, list) {
    // dir String: a könyvtár, ahol vannak az állományok
    // list tömb: a file nevek listája
  var merged = []
  list.map(function (fn) {
    var stat = fsp.statSync(dir + fn)
    var content = fsp.readFileSync(dir + fn)
    try {
      var obj = JSON.parse(content)
      obj.id = fn.replace('.json', '')
      merged.push(obj)
    } catch (e) {
      console.log('ERROR:' + e + ' file: ' + fn)
    }
  })
  var m = /^.*\/([0-9]{2})\/$/g.exec(dir)
  if (m !== null) {
    var day = m[1]
    fsp.writeFileSync(dir + '../day_' + day + '.json', JSON.stringify(merged))
        // console.log(dir, day, merged.length);
  }
}

function listDir (d) {
  return new Promise(function (resolve) {
    return fsp.readdir(d)
            .then(function (dirs) {
              var files = []
              dirs.map(function (s) {
                   // console.log(d + s + " --> " + JSON.stringify(fsp.statSync(d + s)));
                var stat = fsp.statSync(d + s)
                if (stat.isDirectory()) {
                  listDir(d + s + '/')
                            .then(function (list) {
                              if (list.length > 0) {
                                console.log('Merge: ' + (d + s + '/') + ' size:' + list.length)
                                mergeJsons(d + s + '/', list)
                                    /*
                                    console.log("Listing of " + d + ":");
                                    list.map(function(f) {
                                        console.log(JSON.stringify(f));
                                        var ctime = new Date(Date.parse(f.ctime));
                                        console.log(ctime);
                                        console.log(s + ":" + (ctime.getMonth()+1) + "-" + ctime.getDate() + " " + ctime.getHours() + ":" + ctime.getMinutes());
                                        console.log();
                                    });
                                    */
                              }
                            })
                } else if (stat.isFile()) {
                  var mj = matchJson(s)
                  if (mj !== null) {
                            // files.push({"name": s, "mj": mj, "ctime": stat.ctime});
                    files.push(s)
                  }
                }
              })
                // console.log(files.length);
              resolve(files)
            })
  })
}

listDir(home_path)

import request from 'request'

export function addRedirect (app, path, express, nconf) {
  app.use('/*', function (req, res, next) {
    if (!(req.originalUrl.indexOf('/master/') === 0 || req.originalUrl.indexOf('/trend_data/') === 0)) {
  	console.log('Expires set: ' + req.originalUrl)
      res.setHeader('Cache-Control', 'public, max-age=86400')
      res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString())
    }

    // console.log(req.originalUrl) // '/admin/new'
    // console.log(req.baseUrl) // '/admin'
    // console.log(req.path) // '/new'
    next()
  })

  app.use(express.static(path))

  app.use('/master', function (req, res) {
    // console.log('Proxy start...');
    var url = 'http://192.168.1.190' + req.url
    var r = null

    if (req.method === 'POST') {
      // console.log('url:' + url);
      // console.log('body:' + req.body);
      r = request.post({ uri: url, json: req.body })
    } else {
      // console.log('url:' + url);
      r = request(url)
    }
    
    req.pipe(r).pipe(res)
    // console.log('Proxy end...');
  })

  app.use('/trend_data', express.static(nconf.dataPath))

  /*
  app.use('/trend_data', function (req, res) {
    var url = 'http://192.168.1.24/autom_data' + req.url
    var r = null

    if (req.method === 'POST') {
      // console.log('url:' + url);
      // console.log('body:' + req.body);
      r = request.post({ uri: url, json: req.body })
    } else {
      // console.log('url:' + url);
      r = request(url)
    }
    req.pipe(r).pipe(res)
    // console.log('Proxy end...');
  })
  */

  app.get('/*', function (req, res) {
    console.log('index.html returned for: ' + req.url)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString())
    res.sendFile(path + '/index.html')
  })
}

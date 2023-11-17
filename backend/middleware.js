const cors = require('cors')
const admin = require('firebase-admin')

const env = process.env.NODE_ENV || 'development'

const IS_TASK_HANDLER = process.env.LONCHE_TASK_HANDLER || 'false'
const IS_TASK_DISPATCH_DIRECT = process.env.LONCHE_TASKS_DIRECT || 'false'


function configure(api, dbInstance) {
    api.use(cors({ origin: true }))

    api.use(cacheControl)

    api.use((req, res, next) => authorization(dbInstance, req, res, next))

}

async function authorization(dbInstance, req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
      return
    }
    let ok = false
    req.currentUser = null
    const db = dbInstance
    req.topdb = db 
    req.db = db
    let unauthorized = true
    let authorization = req.headers.authorization
    if (authorization) {
      let token = authorization.substring('Bearer '.length)
      try {
        ok = true
        unauthorized = false
      } catch (e) {
        console.error(e)
      }
    } else if (IS_TASK_DISPATCH_DIRECT || IS_TASK_HANDLER || isNoAuth(req)) {
      ok = true
      unauthorized = false
    }
    if (ok) {
      next()
      return
    }
    if (unauthorized) {
      console.log(
        `Sending 404 for ${req.url}, authorization=${Boolean(authorization)}`,
      )
      res.status(401).send('requires authorization')
    }
  }

  function isNoAuth(req) {
    if (req.path === '/api/authorization') return true
    //else if (req.path === '/api/app') return true
    //else if (req.path === '/api/tasks') return true
    return false
  }

  function cacheControl(req, res, next) {
    let c = res.getHeader('Cache-Control')
    if (!c) {
      if (
        req.method === 'GET' ||
        req.method === 'HEAD' ||
        req.method === 'OPTIONS'
      ) {
        res.set('Cache-Control', 'private, max-age=0, must-revalidate')
      } else {
        res.set('Cache-Control', 'no-store')
      }
    }
    next()
  }

exports.configure = configure
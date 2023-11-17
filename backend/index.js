const cors = require('cors')
//const { getFirestore } = require('firebase-admin/firestore');
const path = require('path')
const admin = require('firebase-admin')
const middleware = require('./middleware')
const {Firestore} = require('@google-cloud/firestore');
const { sendEmailClient } = require('./email')
const { generateVerificationCode, getBaseUrl } = require('./utils/index');

// Create a new client
let firebaseApp = null

const env = process.env.NODE_ENV || 'development'
//const IS_PRODUCTION = env === 'production'
const IS_USER_HANDLER = (process.env.LONCHE_USER_HANDLER || 'true') === 'true'
//const MAILJET_API = process.env.MAILJET_API || ''

//const dbInstance = getFirestore()
const dbInstance = new Firestore();

function initializeApp() {
    if (firebaseApp !== null) return firebaseApp
    if (admin.apps.length > 0) firebaseApp = admin.apps[0]
    else firebaseApp = admin.initializeApp()
    return firebaseApp
}

async function loginIntoAccount(req, res) {}

async function doGetTask(req, res) {
    let now = new Date().toISOString()
    let tdocs = await req.db.collection('task').get()
    let list = []
    tdocs.docs.forEach((doc) => {
        let data = doc.data()
        list.push({ id: doc.id, data: data})
    })
    res.json({
        data: list,
        now: now
    })
}

async function doAddTask(req, res) {
    try {
        let data = req.body
        data.createdAt = new Date().toDateString()
        let tdoc = await req.db.collection('task').add(data);
        res.json({ id: tdoc.id, data: data})
    } catch(e) {

    }
}

async function doAddPlan(req, res) {
    try {
        let data = req.body
        data.created_at = new Date().toISOString()
        let pdoc = await req.db.collection('plan').add(data)
        res.json({ id: pdoc.id, data: data})
    } catch(e) {
        console.error(e)
    }
}

async function doUpdateTask(req, res) {
    try {
        let task_id = req.params.id
        let action = req.query.action
        let task_data = req.body
        let tdoc = req.db.collection('task').doc(task_id)
        let doc = await tdoc.get()
        let data = doc.data()
        if (action === 'completed') {
            data.completed = !data.completed
        }
        if (action === 'update') {
            data = task_data
        }
        let updatedAt = new Date().toISOString()
        data.updatedAt = updatedAt
        let r = await tdoc.update(data)
        res.json({id: doc.id, data: data})

    } catch(e) {
        console.error(e)
    }
}

async function doDeleteTask(req, res) {
    try {
        let task_id = req.params.id
        let resp = { status: ''}
        const r = await req.db.collection('task').doc(task_id).delete();
        resp.status = 'deleted'
        resp.id = task_id
        console.log(`Document with ID ${task_id} has been successfully deleted.`)
        res.json(resp)
    } catch (e) {
        console.error(e)
    }
}

async function doGetPlan(req, res) {
    let now = new Date().toISOString()
    console.log(now)
    let resp = {
        date: now,
        message: 'Hit the backend point.'
    }
    res.send({resp})
}

async function doAuthorize(req, res) {
    console.log('Authorize Breakpoint Hit.')
}

async function doSignUp(req, res) {
    let now = new Date().toISOString()
    res.json({
        status: 'success',
        now: now
    })
}

async function doGetPlans(req, res) {
    let now = new Date().toISOString()
    let created_by = req.query.pid
    let pdocs = await req.db.collection('plan').where('created_by', '==', created_by).get()
    let list = []
    pdocs.docs.forEach((doc) => {
        let data = doc.data()
        list.push({ id: doc.id, data: data})
    })
    res.json({
        data: list,
        now: now
    })
}

exports.account = async (req, res) => {
    if (['GET', 'POST'].indexOf(req.method) === -1) {
      res.sendStatus(405)
      return
    }
    let uid = req.path.substring(req.path.lastIndexOf('/') + 1)
    if (req.method === 'GET') {
      await findProfileWithUID(req, res, uid)
      return
    }
}

async function findProfileWithUID(req, res, uid) {
    try {
      //let create = req.query.create //For New Created
      if (!uid) return
      let snapshot = await req.db
        .collection('profile')
        .where('uid', '==', uid)
        .get()
      res.setHeader('Content-Type', 'application/json')
      let found = false
      if (snapshot.docs.length === 1) {
        const data = snapshot.docs[0].data()
        // Blocked profile
        if (data.blocked === true) {
          res.sendStatus(404)
          return
        }
        let payload =
          req.query.include === 'profile'
            ? { data: data, created: true }
            : { data: { fullname: data.fullname }, created: true }
        let profileId = snapshot.docs[0].id
        payload.id = profileId
        res.json(payload)
        found = true
      } 
      if (!found) {
        res.json(null)
      }
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  }

  async function createWaitlistSignup(req, res) {
    try {
        //Verify if there is a user
        let data = req.body
        let user = data.userData
        if (!user) return
        //Check for Profile Doc to not duplicate.
        let pdoc = await req.db.collection('profile').where('uid', '==', data.userId).get()
        let userProfile = {}
        if (pdoc.empty) {
            //Create user profile doc
            userProfile.created = new Date().toISOString()
            userProfile.firstname = user.firstname
            userProfile.lastname = user.lastname
            userProfile.email = user.email
            userProfile.verified = false
            userProfile.uid = data.userId
            console.log('No documents found. Creating New User pdoc!');
            let pdocRef = await req.db.collection('profile').add(userProfile)
            pdoc = await pdocRef.get()
        } 
        //Create Waitlist Document
        let emailClient = null
        let verified = false
        let profileData = pdoc.data()
        if (profileData.verified) {
            verified = true
            res.json({ id: '', email: {} , verified: verified})
        } else {
            let payload = {}
            payload.action = data.action
            payload.email = user.email
            payload.firstname = user.firstname
            payload.lastname = user.lastname
            payload.created_at = new Date().toISOString()
            let code = generateVerificationCode()
            payload.code = code
            let wdoc = await req.db.collection('waitlist').add(payload)
            //Send Waitlist Verification
            const baseUrl = getBaseUrl(req)
            if (wdoc.id) {
                const templateParams = {
                    user_email: user.email,
                    user_name: user.firstname,
                    login_link: `${baseUrl}/sign-up/verification?code=${code}&profileId=${pdoc.id}`,
                };
                const templateName = "user-verification"
                const verification = {}

                emailClient = await sendEmailClient(req.db, verification, templateName, templateParams, client = null)
            }
            res.json({ id: wdoc.id, email: emailClient , verified: verified})
        }
    } catch(e) {
        console.log('There was an error creating waitlist Doc.')
        console.error(e)
        res.sendStatus(500)
    }
  }

  async function validateVerificationCode(req, res) {
    try { 
        let code =  req.params.code
        let profileId = req.query.profileId
        let verified = false
        let verificationText = 'User Not Verified.'
        let pdocRef = await req.db.collection('profile').doc(profileId)
        let pdocSnapshot = await pdocRef.get();
        if (!pdocSnapshot.exists) {
            return res.json({ status: 500, verified: verified })
        }

        let profileData = await pdocSnapshot.data()

        if (profileData.verified) {
            verified = profileData.verified
            verificationText = 'Redirecting...'
            return res.json({ status: 200, verified: verified, text: verificationText })
        }

        let email = profileData.email
        let wdoc = null
        let snapshot = await req.db
            .collection('waitlist')
            .where('email', '==', email)
            .get()

        res.setHeader('Content-Type', 'application/json')

        let updated = false
        if (snapshot.docs.length === 1) {
            const waitlistDocRef = snapshot.docs[0].ref;
            
            wdoc = snapshot.docs[0].data();
            if (wdoc.expired) {
                verificationText = 'Verification Code Expired!'
            } else if (code === wdoc.code && email === wdoc.email && !wdoc.expired) {
                await waitlistDocRef.update({ expired: true });
                await pdocRef.update({ verified: true });
                verified = true;
                verificationText = 'Your Account is Verified!';
                updated = true;
            }
        } 

        if (updated) {
            res.json({ status: 200, verified: verified, text: verificationText });
        } else {
            res.json({ status: 500, verified: verified, text: verificationText });
        }
    } catch(e) {
        console.error(e)
    }
  }

if (require.main === module) {
    ;(async () => {
        const express = require('express')
        const app = express()
        app.use(express.json())
        app.use(cors({ origin: true}))
 
        //Not using anymore
        app.get('/tasks', doGetTask)
        app.post('/task', doAddTask)
        app.patch('/task/:id', doUpdateTask)

        //using
        app.post('/plan', doAddPlan)
        app.get('/plans', doGetPlans)
        app.get('/account/:uid', exports.account)
        //app.get('/app', doGetPlan)
        app.post('/waitlist', createWaitlistSignup)
        app.get('/verification/:code', validateVerificationCode)
        app.post('/authorization', doAuthorize)
        app.delete('/task/:id', doDeleteTask)
        app.post('/sign-up', doSignUp)

        if(IS_USER_HANDLER) {
            //END-POINTS here!
        }
        if(IS_USER_HANDLER) {
            //Any other end-point from different modules that is not Main App related
            //Admin, task, plans, schedules, etc...
        }

        const api = express()
        api.set('etag', false)
        app.set('etag', false)

        middleware.configure(api, dbInstance)

        api.use('/api', app)

        const port = process.env.PORT || 3000
        api.listen(port, () => 
        console.log(
            'lonche.app backend [' + env + '] listening on https',
            port,
        ))
    })()
}
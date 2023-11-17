async function sendEmailClient(db, data, templateName, templateParams, client) {
    if (!client) client = await getEmailClient(db)
    const config = client.config
    const emailjs = client.emailjs 

    const templateId = config.template[templateName].id || ''

    let response = await emailjs.send(config.serviceId, templateId, templateParams)
    if (response.text === 'OK') {
        console.log('Email Sent Success!')
        return response 
    }
    else {
        console.log('Email Sent Failed.')
    }
}

async function getEmailClient(db) {
    const ejsConfig = await db.collection('config').doc('emailjs').get();
    const config = ejsConfig.data();
    const emailjs = require('@emailjs/nodejs');
    emailjs.init({
        publicKey: config.pKey,
        privateKey: config.sKey,
    });
    return { config, emailjs }
  }

module.exports = {
  sendEmailClient,
  getEmailClient
};
function generateVerificationCode() {
    var code = Math.floor(Math.random() * 900000) + 100000;
    var code = code.toString();
    return code;
}

function getBaseUrl(req) {
  const headers = req.headers
  const baseUrl = headers?.origin || ''
  return baseUrl;
}

exports.generateVerificationCode = generateVerificationCode
exports.getBaseUrl = getBaseUrl
export function email(value) {
    /* eslint-disable no-useless-escape */
    const EMAIL_REGEX = /[^\@]+\@[^\@\.]+\.[^\@]+/
    /* eslint-enable no-useless-escape */
    let email = value.trim().toLowerCase()
    let result = EMAIL_REGEX.test(email)
    return {
      value: email,
      result: result,
    }
  }
export function phone(value) {
    let phone = value.replace(/[^[+\d]/g, '')
    if (!phone.startsWith('+')) phone = '+1' + phone
    let result = phone.length >= 12
    return {
      value: phone,
      result: result,
    }
  }

const Config = require('config')
const Minio = require('minio')

// Create and export client by default using env config
const default_config = {
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: '',
  secretKey: ''
}

const config = Object.assign({}, default_config, Config.has('minio') ? Config.get('minio') : null)
config.port = parseInt(config.port)
config.useSSL = Boolean(config.useSSL) || Boolean(config.secure)

const client = new Minio.Client(config)
module.exports = client

// Generate public url using client config (if not provided)
const public_url = config.public_url || `${client.protocol}//${client.host}:${client.port}`

/**
 * Upload buffer to client
 * @param bucket
 * @param objName
 * @param buff
 * @param contentType
 * @returns {Promise.<String>}
 */
module.exports.upload = function upload (bucket, objName, buff, contentType = 'application/octet-stream') {
  return new Promise((resolve, reject) => {
    client.putObject(bucket, objName, buff, contentType, (err, etag) => {
      if (err) return reject(err)
      resolve(etag)
    })
  })
}

/**
 * Generate public URL
 * @param bucket
 * @param objName
 * @param etag
 * @param content_type
 * @returns {string}
 */
module.exports.url = function url (bucket, objName, etag, content_type) {
  let suffix = (etag || content_type) ? '?' : ''
  if (etag) { suffix += `e=${etag.substr(0, 7)}` }
  if (content_type) { suffix += `&response-content-type=${content_type}` }

  return `${public_url}/${bucket}/${objName}${suffix}`
}

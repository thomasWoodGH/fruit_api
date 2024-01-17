const logger = (req, res, next) => {
    const method = req.method
    const url = req.url
    const timestamp = new Date().toISOString()
    console.log(`Time: ${timestamp}, Method: ${method}, URL: ${url}`)
    next()
}

module.exports = logger
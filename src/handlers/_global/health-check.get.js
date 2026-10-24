const getHealthCheck = (req, res) => res.status(200).send('OK')

module.exports = { getHealthCheck }
const jwt = require('jsonwebtoken');
const keys = require('../keys');

module.exports = async function (req, res, proceed) {
  
  if (req.headers['access-token']) {
    jwt.verify(req.headers['access-token'], keys.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: 'Unauthorized access' });
      }
      else {
        req.user = decoded;
        proceed();
      }
    });
  }
  else {
    return res.status(401).send({ error: 'Access token not found' });
  }
  
};
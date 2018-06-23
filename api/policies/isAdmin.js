module.exports = async function (req, res, proceed) {
  
  if (req.user && req.user.role === 'admin') {
      proceed();
  }
  else {
    res.forbidden();
  }  
};
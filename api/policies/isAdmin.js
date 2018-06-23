module.exports = async function (req, res, proceed) {
  
  if (req.user && req.user.role === 'admin') {
      proceed();
  }
  else {
    res.status(403).json({ error: 'Unauthorized Action' });
  }  
};
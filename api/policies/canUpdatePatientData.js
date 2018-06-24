module.exports = async function (req, res, proceed) {
  
    if (req.user && (req.user.role === 'admin' || req.user.role === 'assistant')) {
        proceed();
    }
    else {
      res.status(403).json({ error: 'Unauthorized Action' });
    }  
  };
export const isDriver = (req, res, next) => {
  if (req.userRole !== 'driver') {
    return res.status(403).json({ error: 'Acesso permitido apenas para motoristas' });
  }
  next();
};

export const isPassenger = (req, res, next) => {
  if (req.userRole !== 'passenger') {
    return res.status(403).json({ error: 'Acesso permitido apenas para passageiros' });
  }
  next();
};
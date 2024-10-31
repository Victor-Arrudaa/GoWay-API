export default (err, req, res, next) => {
  console.error(err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: Object.values(err.errors).map(error => error.message)
    });
  }

  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
};
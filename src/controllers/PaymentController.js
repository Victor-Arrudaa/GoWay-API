import Ride from '../models/Ride.js';
import User from '../models/User.js';

export const processPayment = async (req, res) => {
  const { rideId, paymentMethod, amount } = req.body;
  
  const ride = await Ride.findById(rideId);
  if (!ride) {
    return res.status(404).json({ error: 'Corrida não encontrada' });
  }
  
  // Aqui você implementaria a integração com gateway de pagamento
  const paymentSuccess = true;
  
  if (paymentSuccess) {
    ride.status = 'completed';
    await ride.save();
    
    req.io.emit('paymentCompleted', { rideId });
    res.json({ message: 'Pagamento processado com sucesso' });
  } else {
    res.status(400).json({ error: 'Falha no processamento do pagamento' });
  }
};

export const getPaymentHistory = async (req, res) => {
  const rides = await Ride.find({
    $or: [
      { passenger: req.userId },
      { driver: req.userId }
    ],
    status: 'completed'
  })
  .select('price paymentMethod createdAt')
  .sort('-createdAt');
  
  res.json(rides);
};
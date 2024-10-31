import Ride from '../models/Ride.js';
import User from '../models/User.js';

export const rateRide = async (req, res) => {
  const { rideId, rating, userType } = req.body;
  
  const ride = await Ride.findById(rideId);
  if (!ride) {
    return res.status(404).json({ error: 'Corrida não encontrada' });
  }
  
  // Atualiza a avaliação da corrida
  ride.rating[userType] = rating;
  await ride.save();
  
  // Atualiza a média de avaliação do usuário
  const targetUserId = userType === 'passenger' ? ride.driver : ride.passenger;
  const targetUser = await User.findById(targetUserId);
  
  const userRides = await Ride.find({
    $or: [
      { passenger: targetUserId },
      { driver: targetUserId }
    ],
    [`rating.${userType}`]: { $exists: true }
  });
  
  const totalRating = userRides.reduce((sum, ride) => sum + ride.rating[userType], 0);
  targetUser.rating = totalRating / userRides.length;
  await targetUser.save();
  
  res.json({ message: 'Avaliação registrada com sucesso' });
};
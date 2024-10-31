import Ride from '../models/Ride.js';
import User from '../models/User.js';

export const requestRide = async (req, res) => {
  const {
    pickup,
    destination,
    price,
    distance,
    duration,
    paymentMethod
  } = req.body;

  const ride = await Ride.create({
    passenger: req.userId,
    pickup,
    destination,
    price,
    distance,
    duration,
    paymentMethod
  });

  // Notifica motoristas próximos via Socket.IO
  const nearbyDrivers = await User.find({
    role: 'driver',
    isAvailable: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pickup.coordinates
        },
        $maxDistance: 5000 // 5km
      }
    }
  });

  req.io.emit('newRide', { ride, nearbyDrivers });

  res.status(201).json(ride);
};

export const acceptRide = async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findById(rideId);

  if (!ride || ride.status !== 'pending') {
    return res.status(400).json({ error: 'Corrida não disponível' });
  }

  ride.driver = req.userId;
  ride.status = 'accepted';
  await ride.save();

  req.io.emit('rideAccepted', ride);

  res.json(ride);
};

export const updateRideStatus = async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    return res.status(404).json({ error: 'Corrida não encontrada' });
  }

  ride.status = status;
  await ride.save();

  req.io.emit('rideStatusUpdated', ride);

  res.json(ride);
};

export const getRideHistory = async (req, res) => {
  const rides = await Ride.find({
    $or: [
      { passenger: req.userId },
      { driver: req.userId }
    ]
  }).populate('passenger driver', 'name rating');

  res.json(rides);
};
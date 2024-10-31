import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  const { name, phone, vehicleInfo } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, phone, vehicleInfo },
    { new: true }
  );
  
  user.password = undefined;
  res.json(user);
};

export const updateLocation = async (req, res) => {
  const { coordinates } = req.body;
  
  await User.findByIdAndUpdate(req.userId, {
    currentLocation: {
      type: 'Point',
      coordinates
    }
  });
  
  res.sendStatus(200);
};

export const toggleAvailability = async (req, res) => {
  const user = await User.findById(req.userId);
  user.isAvailable = !user.isAvailable;
  await user.save();
  
  res.json({ isAvailable: user.isAvailable });
};
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Schema base com campos comuns
const baseUserSchema = {
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  profilePhoto: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
};

// Schema específico para passageiros
const passengerSchema = new mongoose.Schema({
  ...baseUserSchema,
  role: {
    type: String,
    default: 'passenger',
    immutable: true
  },
  favoriteAddresses: [{
    name: {
      type: String,
      required: true
    },
    address: {
      street: String,
      number: String,
      complement: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        type: [Number],
        required: true
      }
    }
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'pix'],
      required: true
    },
    stripePaymentMethodId: String,
    last4: String,
    brand: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  stripeCustomerId: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

// Schema específico para motoristas
const driverSchema = new mongoose.Schema({
  ...baseUserSchema,
  role: {
    type: String,
    default: 'driver',
    immutable: true
  },
  documents: {
    cnh: {
      number: {
        type: String,
        required: true
      },
      expiryDate: {
        type: Date,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      photo: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    },
    backgroundCheck: {
      document: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      expiryDate: Date
    }
  },
  bankAccount: {
    bank: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      enum: ['checking', 'savings'],
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    agency: {
      type: String,
      required: true
    },
    pixKey: {
      type: String,
      required: true
    }
  },
  vehicle: {
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    plate: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    document: {
      type: String,
      required: true
    },
    insurance: {
      company: String,
      policyNumber: String,
      expiryDate: Date,
      document: String
    }
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  rating: {
    average: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Adiciona índices
driverSchema.index({ currentLocation: '2dsphere' });
driverSchema.index({ 'vehicle.plate': 1 }, { unique: true });
passengerSchema.index({ email: 1 }, { unique: true });
driverSchema.index({ email: 1 }, { unique: true });

// Middleware para criptografar senha
const hashPassword = async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
};

passengerSchema.pre('save', hashPassword);
driverSchema.pre('save', hashPassword);

// Método para comparar senha
const comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

passengerSchema.methods.comparePassword = comparePassword;
driverSchema.methods.comparePassword = comparePassword;

export const Passenger = mongoose.model('Passenger', passengerSchema);
export const Driver = mongoose.model('Driver', driverSchema);
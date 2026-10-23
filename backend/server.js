const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Gym Leader Model Schema
const GymLeader = mongoose.model('GymLeader', new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Gym Leader name is required'],
    minlength: [2, 'Name must have at least 2 characters'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: {
      values: ['Kanto', 'Johto', 'Hoenn'],
      message: '{VALUE} is not a valid region'
    }
  },
  town: {
    type: String,
    required: [true, 'Town is required'],
    trim: true
  },
  badge: {
    type: String,
    required: [true, 'Badge name is required'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true
  },
  aceLevel: {
    type: Number,
    required: [true, 'Ace Pokémon level is required'],
    min: [1, 'Ace level must be at least 1'],
    max: [100, 'Ace level cannot exceed 100'],
    validate: {
      validator: Number.isInteger,
      message: 'Ace level must be a whole integer'
    }
  },
  motto: {
    type: String,
    maxlength: [150, 'Motto cannot exceed 150 characters'],
    default: '',
    trim: true
  }
}, { timestamps: true }));

// [READ ALL] GET: Fetch all Gym Leaders
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find().sort({ createdAt: -1 });
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gym leaders', error: err });
  }
});

// [READ ONE] GET: Fetch a single Gym Leader by ID
app.get('/api/leaders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    const leader = await GymLeader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    res.json(leader);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gym leader', error: err });
  }
});

// [CREATE] POST: Insert new Gym Leader
app.post('/api/leaders', async (req, res) => {
  try {
    const leader = new GymLeader(req.body);
    await leader.save();
    res.status(201).json(leader);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', error: err.message });
    }
    res.status(500).json({ message: 'Error saving gym leader', error: err });
  }
});

// [UPDATE] PUT: Modify an existing Gym Leader by ID
app.put('/api/leaders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    const updatedLeader = await GymLeader.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Returns modified doc and enforces schema rules
    );
    if (!updatedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    res.json(updatedLeader);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', error: err.message });
    }
    res.status(500).json({ message: 'Error updating gym leader', error: err });
  }
});

// [DELETE] DELETE: Remove a Gym Leader by ID
app.delete('/api/leaders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    const deletedLeader = await GymLeader.findByIdAndDelete(req.params.id);
    if (!deletedLeader) {
      return res.status(404).json({ message: 'Gym Leader not found' });
    }
    res.json({ message: 'Gym Leader successfully removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting gym leader', error: err });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
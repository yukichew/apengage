const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const Transport = require('../../models/logistic/transport');

// transport
exports.createTransport = async (req, res) => {
  const { name, type, capacity } = req.body;

  const transport = await Transport.findOne({ name });
  if (transport) {
    return res.status(400).json({ error: 'Transport name already exists' });
  }

  const newTransport = new Transport({
    name: name.toUpperCase(),
    type,
    capacity,
  });

  await newTransport.save();

  res.json({
    Transport: {
      id: newTransport._id,
      name: newTransport.name,
      type: newTransport.type,
      capacity: newTransport.capacity,
    },
  });
};

exports.updateTransport = async (req, res) => {
  const { name, type, capacity } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid transport id');

  const transport = await Transport.findById(id);
  if (!transport) return sendError(res, 404, 'Transport not found');

  transport.name = name;
  transport.type = type;
  transport.capacity = capacity;

  await transport.save();

  res.json({
    transport: {
      id: transport._id,
      name: transport.name,
      type: transport.type,
      capacity: transport.capacity,
    },
  });
};

exports.deleteTransport = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid transport id');

  const transport = await Transport.findById(id);
  if (!transport) return sendError(res, 404, 'Transport not found');

  await Transport.findByIdAndDelete(id);

  res.json({ message: 'Transport deleted' });
};

exports.getTransportation = async (req, res) => {
  const transportation = await Transport.find({}).sort({ createdAt: -1 });
  const count = await Transport.countDocuments();
  res.json({
    transportation: transportation.map((transport) => {
      return {
        id: transport._id,
        name: transport.name,
        type: transport.type,
        capacity: transport.capacity,
        status: transport.isActive ? 'Active' : 'Inactive',
        createdAt: transport.createdAt,
        updatedAt: transport.updatedAt,
      };
    }),
    count,
  });
};

exports.getTransport = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid transport id');

  const transport = await Transport.findById(id);
  if (!transport) return sendError(res, 404, 'Transport not found');

  res.json({
    transport: {
      id: transport._id,
      name: transport.name,
      type: transport.type,
      capacity: transport.capacity,
      status: transport.isActive ? 'Active' : 'Inactive',
    },
  });
};

exports.searchTransport = async (req, res) => {
  const { name, type } = req.query;

  const query = {
    name: { $regex: name, $options: 'i' },
  };

  if (type) {
    query.type = type;
  }

  const result = await Transport.find(query);

  res.json({
    transportation: result.map((transport) => {
      return {
        id: transport._id,
        name: transport.name,
        type: transport.type,
        capacity: transport.capacity,
        status: transport.isActive ? 'Active' : 'Inactive',
        createdAt: transport.createdAt,
        updatedAt: transport.updatedAt,
      };
    }),
  });
};

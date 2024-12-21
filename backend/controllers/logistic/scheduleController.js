const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');

// schedule
exports.createSchedule = async (req, res) => {
  const {
    transportId,
    from,
    to,
    startTime,
    endTime,
    recurring,
    exceptionDates,
  } = req.body;

  const transport = await Transport.findById(transportId);
  if (!transport) return res.status(404).json({ error: 'Transport not found' });

  const newSchedule = new TransportSchedule({
    transport: transportId,
    from,
    to,
    startTime,
    endTime,
    recurring,
    exceptionDates: exceptionDates,
    createdBy: req.admin._id,
  });

  await newSchedule.save();

  res.json({
    schedule: {
      id: newSchedule._id,
      transport: newSchedule.transport,
      from: newSchedule.from,
      to: newSchedule.to,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      recurring: newSchedule.recurring,
      exceptionDates: newSchedule?.exceptionDates,
      status: newSchedule.isActive ? 'Active' : 'Inactive',
      createdAt: newSchedule.createdAt,
      updatedAt: newSchedule.updatedAt,
    },
  });
};

exports.updateFacility = async (req, res) => {
  const { name, type, quantity } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid facility id');

  const facility = await Facility.findById(id);
  if (!facility) return sendError(res, 404, 'Facility not found');

  facility.name = name;
  facility.type = type;
  facility.quantity = quantity;

  await facility.save();

  res.json({
    facility: {
      id: facility._id,
      name: facility.name,
      type: facility.type,
      quantity: facility.quantity,
    },
  });
};

exports.deleteFacility = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid Facility id');

  const facility = await Facility.findById(id);
  if (!facility) return sendError(res, 404, 'Facility not found');

  await Facility.findByIdAndDelete(id);

  res.json({ message: 'Facility deleted' });
};

exports.getFacilities = async (req, res) => {
  const facilities = await Facility.find({}).sort({ createdAt: -1 });
  const count = await Facility.countDocuments();
  res.json({
    facilities: facilities.map((facility) => {
      return {
        id: facility._id,
        name: facility.name,
        type: facility.type,
        quantity: facility.quantity,
        status: facility.isActive ? 'Active' : 'Inactive',
        createdAt: facility.createdAt,
        updatedAt: facility.updatedAt,
      };
    }),
    count,
  });
};

exports.getFacility = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid Facility id');

  const facility = await Facility.findById(id);
  if (!facility) return sendError(res, 404, 'Facility not found');

  res.json({
    facility: {
      id: facility._id,
      name: facility.name,
      type: facility.type,
      quantity: facility.quantity,
      status: facility.isActive ? 'Active' : 'Inactive',
    },
  });
};

exports.searchFacility = async (req, res) => {
  const { name, type } = req.query;

  const query = {
    name: { $regex: name, $options: 'i' },
  };

  if (type) {
    query.type = type;
  }

  const result = await Facility.find(query);

  res.json({
    facilities: result.map((facility) => {
      return {
        id: facility._id,
        name: facility.name,
        type: facility.type,
        quantity: facility.quantity,
        status: facility.isActive ? 'Active' : 'Inactive',
        createdAt: facility.createdAt,
        updatedAt: facility.updatedAt,
      };
    }),
  });
};

// transport booking
exports.bookTransport = async (req, res) => {
  const { from, to, startTime, endTime } = req.body;

  const schedule = await TransportSchedule.findOne({
    from,
    to,
    startTime: { $lte: startTime },
    endTime: { $gte: endTime },
    $nor: [{ exceptionDates: start }],
  });

  const transport = new TransportRequest({
    createdBy: req.user._id,
    schedule: schedule?._id,
    customRequest: { from, to, startTime, endTime },
    status: schedule ? 'Approved' : 'Pending',
  });

  await transport.save();

  res.json({
    transport: {
      id: transport._id,
      schedule: transport.schedule,
      customRequest: transport.customRequest,
      status: transport.status,
    },
  });
};

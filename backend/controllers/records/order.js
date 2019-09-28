const Order = require('../../models/records/order');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newOrder = new Order({
        created: req.body.created,
        patientId: req.body.patientId,
        order: req.body.order
    });
    let order = await newOrder.save();
    if (!order) {
      throw new Error('Something went wrong. Cannot create complaint!');
    }
    res.status(201).json({
        message: 'Successfully added',
        order: {
            ...order,
            id: order._id,
        }
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.update = async(req, res, next) => {
  try {
    const newOrder = new Order({
        _id: req.body.orderId,
        created: req.body.created,
        patientId: req.body.patientId,
        order: req.body.order
    });
    let order = await Order.updateOne({ _id: req.params.orderId }, newOrder).exec();
    if (!order) {
      throw new Error('Something went wrong. Cannot update order!');
    }
    res.status(200).json({ message: 'Update successful!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getAll = async(req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const query = Order.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let order = await query.exec();

    let count = await Order.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        orders: order,
        max: count
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.get = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.orderId).exec();
    if (!order) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.orderId);
    }
    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let order = await Order.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let order = await Order.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Order.deleteOne({ _id: req.params.orderId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

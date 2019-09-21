const Setting = require('../models/setting');

exports.create = async (req, res, next) => {
  try {
    const setting = new Setting({
        licenseId: req.body.licenseId,
        clinicName: req.body.name,
        clinicOwner: req.body.owner,
        clinicAddress: req.body.address,
        clinicUrl: req.body.url,
        clinicEmail: req.body.email,
        prc: req.body.prc,
        ptr: req.body.ptr,
        s2: req.body.s2
    });
    phoneData = req.body.phones;
    for (let index = 0; index < phoneData.length; index++) {
        setting.clinicPhone.push(phoneData[index]);
    }
    hourData = req.body.hours;
    for (let index = 0; index < hourData.length; index++) {
        setting.clinicHours.push(hourData[index]);
    }
    let settings = await setting.save();
    if (!settings) {
      throw new Error('Something went wrong.Cannot create settings!');
    }

    res.status(201).json({
        message: 'Setting added successfully',
        setting: {
            ...settings,
            id: settings._id,
        }
    });
  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.update = async(req, res, next) => {
  try {
    const setting = new Setting({
        _id: req.body.id,
        clinicName: req.body.name,
        clinicOwner: req.body.owner,
        clinicAddress: req.body.address,
        clinicEmail: req.body.email,
        prc: req.body.prc,
        ptr: req.body.ptr,
        s2: req.body.s2,
        nobreak: req.body.nobreak
    });
    phoneData = req.body.phones;
    for (let index = 0; index < phoneData.length; index++) {
        setting.clinicPhone.push(phoneData[index]);
    }
    hourData = req.body.hours;
    for (let index = 0; index < hourData.length; index++) {
        setting.clinicHours.push(hourData[index]);
    }
    let settings = await Setting.updateOne({ licenseId: req.params.licenseId }, setting).exec();
    if (!settings) {
      throw new Error('Something went wrong.Cannot update settings!');
    }

    res.status(200).json({ message: 'Settings update successful!' });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.get = async(req, res, next) => {
  try {
    let setting = await Setting.findOne({ 'licenseId': req.params.licenseId }).exec();

    res.status(200).json(setting);

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

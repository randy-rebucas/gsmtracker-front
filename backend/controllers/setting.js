const Setting = require('../models/setting');

exports.create = (req, res, next) => {
    const setting = new Setting({
      userId: req.body.userId,
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
    setting.save().then(createdSetting => {
            res.status(201).json({
                message: 'Setting added successfully',
                setting: {
                    ...createdSetting,
                    id: createdSetting._id,
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating a setting failed!'
            });
        });
};

exports.update = (req, res, next) => {
    const setting = new Setting({
        _id: req.body.id,
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
    Setting.updateOne({ _id: req.params.userId },
            setting
        )
        .exec()
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Settings update successful!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Unable to update settings!'
            });
        });
};

exports.get = (req, res, next) => {
    Setting.findOne({ 'userId': req.params.userId })
    .exec()
    .then(setting => {
            if (setting) {
                res.status(200).json(setting);
            } else {
                res.status(404).json({ message: 'setting not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

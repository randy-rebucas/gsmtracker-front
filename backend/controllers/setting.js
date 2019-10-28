const Setting = require('../models/setting');
const sharp = require('sharp');
exports.create = async(req, res, next) => {
    try {
        const setting = new Setting({
            clinicName: req.body.name,
            clinicOwner: req.body.owner,
            // clinicAddress: req.body.address,
            clinicUrl: req.body.url,
            clinicEmail: req.body.email,
            prc: req.body.prc,
            ptr: req.body.ptr,
            s2: req.body.s2
        });
        addressData = req.body.address;
        for (let index = 0; index < addressData.length; index++) {
            setting.clinicAddress.push(addressData[index]);
        }
        pho
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
            clinicEmail: req.body.email,
            prc: req.body.prc,
            ptr: req.body.ptr,
            s2: req.body.s2,
            nobreak: req.body.nobreak
        });
        addressData = req.body.address;
        for (let index = 0; index < addressData.length; index++) {
            setting.address.push(addressData[index]);
        }
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
        let setting = await Setting.find().exec();
        // console.log(setting);
        res.status(200).json(setting);

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.uploadLogo = async(req, res, next) => {
    try {
        let clinicLogo = await sharp(req.file.path).resize(200, 200).toBuffer();
        if (!clinicLogo) {
            throw new Error('Error in updating clinic logo!');
        }
        const newSetting = new Setting({
            _id: req.body.settingId,
            logoPath: `data:${req.file.mimetype};base64,${clinicLogo.toString('base64')}`
        });

        let setting = await Setting.updateOne({ _id: req.params.settingId }, newSetting);
        if (!setting) {
            throw new Error('Error in updating settings!');
        }

        res.status(200).json({
            imagePath: newSetting.logoPath,
            message: 'Clinic logo updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

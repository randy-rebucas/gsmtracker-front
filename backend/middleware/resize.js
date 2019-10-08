const sharp = require('sharp');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
module.exports = async(req, res, next) => {
    try {
        const name = req.file.originalname
            .toLowerCase()
            .split(" ")
            .join("-");
        const ext = MIME_TYPE_MAP[req.file.mimetype];

        sharp(req.file.path).resize(200, 200).toBuffer()
            .then(data => {
                // 100 pixels wide, auto-scaled height
                // console.log(data);
                // console.log(`data:${req.file.mimetype};base64,${data.toString('base64')}`);
                req.userPicture = `data:${req.file.mimetype};base64,${data.toString('base64')}`;
            })
            .catch((err) => {
                console.log(err);
            });

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
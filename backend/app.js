var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var settingRouter = require('./routes/setting');
var patientRouter = require('./routes/patient');

var heightRouter = require('./routes/records/height');
var weightRouter = require('./routes/records/weight');
var temperatureRouter = require('./routes/records/temperature');
var bpsRouter = require('./routes/records/blood_pressure');
var rprRouter = require('./routes/records/respiratory_rate');
var prRouter = require('./routes/records/pulse_rate');
var complaintRouter = require('./routes/records/complaint');
var historyRouter = require('./routes/records/history');
var prescriptionRouter = require('./routes/records/prescription');
var notesRouter = require('./routes/records/progress_note');
var assessmentsRouter = require('./routes/records/assessment');
var orderRouter = require('./routes/records/order');
var familyHistoryRouter = require('./routes/records/family_history');
var presentIllnessRouter = require('./routes/records/present_illness');
var pastMedicalRouter = require('./routes/records/past_medical');
var socialRouter = require('./routes/records/social');
var allergyRouter = require('./routes/records/allergy');
var endorsementRouter = require('./routes/records/endorsement');
var immunizationRouter = require('./routes/records/immunization');

var threadRouter = require('./routes/thread');
var messagesRouter = require('./routes/message');
var networkRouter = require('./routes/network');
var appointmentsRouter = require('./routes/appointment');
var uploadRouter = require('./routes/upload');

var queRouter = require('./routes/que');
var encounterRouter = require('./routes/encounter');
var driveRouter = require('./routes/drive');
var cors = require('cors');

var app = express();

// admin@myclinicsoft.com
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(
        'mongodb+srv://myclinicsoft:' +
        process.env.MONGO_ATLAS_PW +
        '@main-cndu1.mongodb.net/myclinicsoft?retryWrites=true&w=majority',
        options
    )
    .then((connecting) => {
        console.log('connecting...');
    })
    .then((connected) => {
        mongoose.set('dbkey', 'secret');
        console.log(mongoose.get('dbkey'));
        console.log('connected!');
    })
    .catch((error) => {
        console.log(error);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/attachments', express.static(path.join(__dirname, 'attachments')));
//app.use('/', express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/patients', patientRouter);
app.use('/api/setting', settingRouter);

app.use('/api/heights', heightRouter);
app.use('/api/weights', weightRouter);
app.use('/api/temperatures', temperatureRouter);
app.use('/api/bps', bpsRouter);
app.use('/api/respiratory-rate', rprRouter);
app.use('/api/pulse-rate', prRouter);
app.use('/api/chief-complaints', complaintRouter);
app.use('/api/histories', historyRouter);
app.use('/api/prescriptions', prescriptionRouter);
app.use('/api/progress-notes', notesRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/orders', orderRouter);
app.use('/api/family-histories', familyHistoryRouter);
app.use('/api/present-illneses', presentIllnessRouter);
app.use('/api/past-medicals', pastMedicalRouter);
app.use('/api/socials', socialRouter);
app.use('/api/allergies', allergyRouter);
app.use('/api/endorsements', endorsementRouter);
app.use('/api/immunizations', immunizationRouter);

app.use('/api/thread', threadRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/networks', networkRouter);
app.use('/api/appointments', appointmentsRouter);

app.use('/api/drive', driveRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/que', queRouter);
app.use('/api/encounter', encounterRouter);
//app.use((req, res, next) => {
//    res.sendFile(path.join(__dirname, 'angular', 'index.html'));
//});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

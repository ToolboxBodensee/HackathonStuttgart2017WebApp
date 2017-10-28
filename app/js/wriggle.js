const backendPath = (
    //'wriggle-backend.herokuapp.com'
    '10.200.19.196:3000'
);

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// @formatter:off
var   lastBeta        = null;
var   lastGamma       = null;
var   lastRad         = null;
const socket          = io(backendPath);
var   socketConnected = false;
// @formatter:on

$(document).ready(function () {
    initSocket();
    registerOrientationHandler();
    startTimer();

    $('#debug').click(function () {
        $(this).addClass('visible');
    })
});

function handleOrientation (event) {
    // @formatter:off
    const beta  = event.beta;
    const gamma = event.gamma;
    lastBeta    = beta;
    lastGamma   = gamma;
    lastRad     = Math.radians(lastGamma);
    // @formatter:on

    $('#beta').text(lastBeta.toFixed(4));
    $('#gamma').text(lastGamma.toFixed(4));
}

function initSocket () {
    socket.on('connect', function () {
        socketConnected = true;
        socket.emit()
    });
}

function registerOrientationHandler () {
    window.addEventListener('deviceorientation', handleOrientation);
}

function startTimer () {
    window.setInterval(timerTick, 100);
}

function timerTick () {
    if (socketConnected && lastGamma !== null && lastBeta !== null && lastBeta < 89.99) {
        console.log('Tick and send');

        socket.emit('changeDirection', lastRad);
    }
}

// TODO: name
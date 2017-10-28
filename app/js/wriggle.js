const backendPath = (
    'wriggle-backend.herokuapp.com'
    //'10.200.19.196:3000'
);

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// @formatter:off
var lastBeta        = null;
var lastGamma       = null;
var lastRad         = null;
var socket          = null;
var socketConnected = false;
// @formatter:on

$(document).ready(function () {
    registerOrientationHandler();
    startTimer();

    const playerNameInput = $('#player-name');

    $('#debug').click(function () {
        $(this).addClass('visible');
    });

    $('#submit-button').click(function () {
        const playerName = playerNameInput.val();

        if (playerName) {
            $('#loading').fadeIn(250);

            initSocket(playerName);
        } else {
            alert('Please enter a name');
        }
    });
});

function handleOrientation (event) {
    // @formatter:off
    const beta  = event.beta || 0;
    const gamma = event.gamma || 0;
    lastBeta    = beta;
    lastGamma   = gamma;
    lastRad     = Math.radians(lastGamma);
    // @formatter:on

    $('#beta').text(lastBeta.toFixed(4));
    $('#gamma').text(lastGamma.toFixed(4));
}

function initSocket (playerName) {
    socket = io(backendPath, { query: 'name=' + encodeURIComponent(playerName) });

    socket.on('connect', function () {
        socketConnected = true;

        $('#loading').fadeOut(250);
        $('#form').fadeOut(250);
        $('#wriggler').addClass('visible');
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
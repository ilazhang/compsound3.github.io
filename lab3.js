//I'm sorry in advance. This sounds more like a whitewater rafting nightmare than a babbling brook. I am very sick with the flu and doing my best.
//Also did this part individually because I was out sick :(

//part1
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let brookPlaying = false;
let brownNoiseSource = null;

function brownNoise() {
    var bufferSize = 10 * audioCtx.sampleRate;
    var noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    //filters
    const lpFilter = audioCtx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = 14;

    const rhpfFilter = audioCtx.createBiquadFilter();
    rhpfFilter.type = 'highpass';
    rhpfFilter.frequency.value = 20;
    rhpfFilter.Q.value = 0.5;

    source.connect(lpFilter);
    lpFilter.connect(rhpfFilter);
    rhpfFilter.connect(audioCtx.destination);

    return source;
}

function toggleBrookSound() {
    if (brookPlaying) {
        brownNoiseSource.stop();
        brownNoiseSource.disconnect();
        brookPlaying = false;
    } else {
        brownNoiseSource = brownNoise();
        brownNoiseSource.connect(audioCtx.destination);
        brownNoiseSource.start();
        brookPlaying = true;
    }
}

const brookButton = document.getElementById('brookButton');

brookButton.addEventListener('click', function () {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    toggleBrookSound();
});


//part2
function createAlarmOscillator(frequency) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.start();
    return oscillator;
}

function playAlarmSequence() {
    const frequencies = [800, 600];
    const durations = [0.2, 0.2];

    let startTime = audioCtx.currentTime;

    frequencies.forEach((frequency, index) => {
        const oscillator = createAlarmOscillator(frequency);
        oscillator.connect(audioCtx.destination);
        oscillator.stop(startTime + durations[index]);
        startTime += durations[index];
    });
}

const alarmButton = document.getElementById('alarmButton');

alarmButton.addEventListener('click', function() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    playAlarmSequence();
});

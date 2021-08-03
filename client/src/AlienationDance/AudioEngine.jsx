class Audio {
    static context = new (window.AudioContext || window.webkitAudioContext)();
    
    // TODO: Add Limiter to master gain node
    static masterGainNode = Audio.context.createGain();
}

export default Audio;
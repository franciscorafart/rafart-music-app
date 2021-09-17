class Audio {
    static context = new (window.AudioContext || window.webkitAudioContext)();
    // TODO: Add Limiter to master gain node
    static initializeMasterGain(){
        this.masterGainNode = this.context.createGain();
        this.masterGainNode.connect(this.context.destination);
        this.masterGainNode.gain.setValueAtTime(1, this.context.currentTime);
    }
}

export default Audio;
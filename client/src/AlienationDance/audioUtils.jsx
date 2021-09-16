const _getFile = async (audioCtx, filepath) => {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    let audioBuffer;
    try {
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e){
        console.error(e)
    }

    return audioBuffer;
}

export const addAudioBuffer = async (audioCtx, filepath) => {
    const buffer = await _getFile(audioCtx, filepath);
    return buffer;
}

export const playBuffer = (audioCtx, masterGainNode, buffer, time) => {
    const stemAudioSource = audioCtx.createBufferSource();
    stemAudioSource.buffer = buffer;

    const panNode = audioCtx.createStereoPanner();
    panNode.pan.setValueAtTime(0, audioCtx.currentTime);

    const stemGainNode = audioCtx.createGain();
    stemGainNode.gain.setValueAtTime(1, audioCtx.currentTime);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    // analyser.fftSize = 126;

    const bufferLength = analyser.frequencyBinCount;

    // NOTE: Maybe I don't need this here?
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Singal chain
    stemAudioSource.connect(analyser);
    analyser.connect(panNode);
    panNode.connect(stemGainNode);
    stemGainNode.connect(masterGainNode);

    stemAudioSource.start(time);

    // Return gain and panning controls so that the UI can manipulate them
    return [panNode, stemGainNode, analyser];
}

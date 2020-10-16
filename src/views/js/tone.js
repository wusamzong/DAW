import * as Tone from "tone";
var tone={
  addTrackHandler(Tracknum){
    var Track=({
      ID: Tracknum,
      isSelect: false,
      isMute: false,
      isSolo: false,
      Data: Array.from({length:7},this.getEmptyArray),
      synthType:"Synth",
      poly: new Tone.PolySynth(8, Tone.Synth,{
        oscillator: {
          type: "triangle"
        },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0.3,
          release: 0.02
        },
        volume: 2
      }).toMaster(),
    })
    return Track;
  },
  getEmptyArray(length=72){
    return Array.from({length},()=>0)
  },
  editTrackHandler(TrackData,key){ //這裡的key代表的是某一個Track的第幾個
    //第幾個
     //第幾行
    console.log(key)
    TrackData[Math.floor(key/72)][key%72]=!TrackData[Math.floor(key/72)][key%72];
  },
  playHandler(isPlaying){
    if (Tone.context.state !== "running") {
      Tone.context.resume().then(() => {
        console.log("PlayBack resumed successfully");
      });
    }
    if (isPlaying) {
      console.log("Stop");
      Tone.Transport.stop();
    } else {
      console.log("Play");
      Tone.Transport.start();
    }
    return !isPlaying;
  },
  setTransport(Track, index) {
    Tone.Transport.bpm.value = 120; //每分鐘120拍
    Tone.Transport.scheduleRepeat(time => {
      
      index = ++index % 16;
      const i = index;
      for (let j = 0; j < Track.length; j++) {
        //Track[selectedTrack].Data
        let lead = Track[j].Data;
        let poly = Track[j].poly;
        if (lead[0][i]) poly.triggerAttackRelease("C4", "16n", time);
        if (lead[1][i]) poly.triggerAttackRelease("D4", "16n", time);
        if (lead[2][i]) poly.triggerAttackRelease("E4", "16n", time);
        if (lead[3][i]) poly.triggerAttackRelease("F4", "16n", time);
        if (lead[4][i]) poly.triggerAttackRelease("G4", "16n", time);
        if (lead[5][i]) poly.triggerAttackRelease("A4", "16n", time);
        if (lead[6][i]) poly.triggerAttackRelease("C5", "16n", time);
      }
    }, "16n");
  },
}
export default tone
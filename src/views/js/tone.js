import * as Tone from "tone";
import {trackModel} from '@/views/js/model/track'
import {playingKeys, clearTemp} from '@/views/js/view/playing'
let audioData = trackModel.audioData
var tone={
  index: 0,
  focusTrack: -1,
  loop:true,
  time:{
    m:0,
    s:0,
    ms:0,
  },
  isPlaying: false,
  endIndex: 72,
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
    audioData.push(Track);
    return;
  },
  muteHandler(Track){
    if(Track.isMute){
      Track.poly.set({volume: 0})
      Track.isMute=false;
    }else{
      Track.poly.set({volume: -50})
      Track.isMute=true;
    }    
  },
  getEmptyArray(length=72){
    return Array.from({length},()=>0)
  },
  editTrackHandler(keys){ //這裡的key代表的是某一個Track的第幾個
    //第幾個
     //第幾行
    
    var TrackData = audioData[keys.index[0]].Data
    var key = keys.index[1]
    TrackData[Math.floor(key/72)][key%72]=!TrackData[Math.floor(key/72)][key%72];
  },
  playHandler(isPlaying){
    if (Tone.context.state !== "running") {
      Tone.context.resume().then(() => {
        console.log("PlayBack resumed successfully");
      });
    }
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
    return !isPlaying;
  },
  setTransport() {
    Tone.Transport.bpm.value = 120; //每分鐘120拍
    
    Tone.Transport.scheduleRepeat(time => {
      playingKeys(this.index);
      const i = ++this.index%72;
      
      for (let j = 0; j < audioData.length; j++) {
        let lead = audioData[j].Data;
        let poly = audioData[j].poly;
        if (lead[0][i]) poly.triggerAttackRelease("C4", "16n", time);
        if (lead[1][i]) poly.triggerAttackRelease("D4", "16n", time);
        if (lead[2][i]) poly.triggerAttackRelease("E4", "16n", time);
        if (lead[3][i]) poly.triggerAttackRelease("F4", "16n", time);
        if (lead[4][i]) poly.triggerAttackRelease("G4", "16n", time);
        if (lead[5][i]) poly.triggerAttackRelease("A4", "16n", time);
        if (lead[6][i]) poly.triggerAttackRelease("C5", "16n", time);
        isLoop();
      }
      getTime();
    }, "16n");    
    Tone.Transport.on('start',()=>{
      this.isPlaying = true;
    })
    Tone.Transport.on('stop',()=>{
      this.isPlaying = false;
    })

  },
  setBPM(value){
    Tone.Transport.bpm.value = value
  }
}
function isLoop(){
  if(!tone.loop && tone.index%72 === tone.endIndex-1){
    Tone.Transport.stop();
    clearTemp();
  }
}
function getTime(){
  let temp = Tone.Transport.getSecondsAtTime()
  tone.time.m = Math.floor(temp/60);
  tone.time.s = Math.floor(temp%60)
  tone.time.ms = Math.floor((temp.toFixed(2)-tone.time.s)*100);
  
  for (let prop in tone.time) {
    if(Math.floor(tone.time[prop]/10)===0)
      tone.time[prop]= '0'+tone.time[prop];
    if(tone.time[prop]===0)
      tone.time[prop]= '00';
  }
}
export default tone
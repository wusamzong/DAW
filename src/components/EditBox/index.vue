<template src='./template.html'></template>

<script>
export default {
  data() {
    return {
      trackData: {
        synthType: "",
        osc: "",        
        vol: 0,
        detune: 0,
        env: {
          attack: 10, //0-2
          decay: 10, //0-2
          sustain: 5, //0-1 ->照比例
          release: 25 //0-5
        }
      },

      isMidi: false
    };
  },
  props: {
    EditWindows: {
      type: Number,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    Track: {
      type: Array,
      required: true
    },
    selectedTrack: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  watch: {
    trackData: {
      handler(v) {
        this.$emit("adjustTrack", v);
        /*
          this.fmSynth.envelope.attack = attack / 10;
          this.fmSynth.envelope.decay = decay / 10;
          this.fmSynth.envelope.sustain = sustain / 10;
          this.fmSynth.envelope.release = release / 10;*/
      },
      deep: true
    }
  },
  methods: {
    setTrackData() {    //將資料傳到可被綁定的容器中
      const trackData = this.Track[this.selectedTrack].poly.get();
      
      this.trackData.osc = trackData.oscillator.type;
      this.trackData.synthType = this.Track[this.selectedTrack].synthType;
      this.trackData.vol = parseInt(trackData.oscillator.volume);
      this.trackData.detune = parseInt(trackData.oscillator.detune);
      
      this.trackData.env.attack = trackData.envelope.attack*10;
      this.trackData.env.decay = trackData.envelope.decay*10;
      this.trackData.env.sustain = trackData.envelope.sustain*10;
      this.trackData.env.release = trackData.envelope.release*10;
    },
    editKey(arr, i) {
      this.$emit("setKey", arr, i);
    }
  },
  mounted() {
    this.setTrackData();
  }
};
</script>
<style scope>
.EditBox {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 350px auto;
  grid-template-rows: 40px 42vh;
  grid-template-areas:
    "frame frame"
    "adjust content";
}
.MidiEditor {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 350px auto;
  grid-template-rows: 40px auto;
  grid-template-areas:
    "frame content"
    "adjust content";
}
.frame {
  grid-area: frame;
  margin: 0px 20px;
  border-bottom: #a8a8a8 0.5px solid;
  display: flex;
  align-items: center;
}
.frame button {
  display: inline-block;
  width: 40px;
  height: 30px;
  background: #606060;
  border: 1px solid #606060;
  color: aliceblue;
  font-size: 24px;
}
.frame p {
  color: white;
  margin: 0 20px;
  font-size: 20px;
}
.content {
  grid-area: content;
  background: #4b4b4b;
  overflow-x: auto;
}
.adjust {
  grid-area: adjust;
  background: #353535;
}
.adjust div {
  margin: 20px;
}
.adjust p {
  color: aliceblue;
  font-size: 14px;
  margin: 0;
}
.adjust select {
  width: 100%;
  height: 30px;
  background: #1f1f1f;
  border: 1px solid #484848;
  border-radius: 2px;
  color: aliceblue;
  font-size: 15px;
}
.adjust .Midi button {
  display: inline-block;
  width: 40px;
  height: 30px;
  margin: 5px;
  background: #606060;
  border: 1px solid #606060;
  color: aliceblue;
  font-size: 24px;
}

.Midi .timeline {
  display: flex;
  flex-direction: row;
  background: #38383a;
  border-radius: 5px;
  height: 10px;
  width: 1080px;
}
.timeline .show{
  content: ' ';
  background: #666;
  width: calc(1080px/16);
  height: 10px;
  border: 1px solid rgb(207, 252, 255);
}
.active{
  background:#e93fff !important;
}
.lead {
  display: grid;
  height: 250px;
  background-color: #797979;
  width: 1080px;
  margin: 0;
}
.lead ul {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  list-style-type: none;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}
.lead li {
  grid-row: span 1;
  margin: 0;
  display: block;
  border: 1px solid black;

  width: 100%;
  height: 100%;
  content: " ";
}
.before {
  background-color: #444444;
}
.lead li:hover {
  background-color: orange;
}
.after {
  background-color: yellow;
}
.Fx {
  padding-left: 10px;
  color: white;
}
.Fx h1 {
  margin: 10px 0;
}
</style>
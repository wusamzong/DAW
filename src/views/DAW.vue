<template>
  <div id="app">
    <div class="layout" :class="[isEdit ? 'editTrack':'justTrack']">
      <div class="head-1">
        <ul>
          <li>Exit</li>
          <li>File</li>
          <li>Edit</li>
          <li>View</li>
          <li>Settings</li>
          <li>Help</li>
        </ul>
        <p>Title</p>
      </div>

      <div class="head-2">
        <Head2
          :BPM="BPM"
          :time="time"
          @BPMplus="BPM+=5"
          @BPMminus="BPM-=5"
          @play="PlayHandler"
          @save="saving"
        />
      </div>

      <div class="track">
        <div class="side-box">
          <button @click="addTrackHandler" class="addButton">+ add track</button>
          <Track
            v-for="num in Track"
            :key="num.ID"
            @click.native="selectTrack(num.ID)"
            :class="[num.isSelect? 'selectTrack': 'notSelect']"
          />
        </div>

        <div class="track-box">
          <div class="timeline">
            <ul>
              <li v-for="i in 16" :key="i">{{i}}</li>
            </ul>
          </div>
          <TrackEdit
            v-for="num in Track"
            :key="num.ID"
            @click.native="selectTrack(num.ID)"
            :class="{selectTrackEdit : num.isSelect}"
          />
        </div>
      </div>

      <div v-if="isEdit">
        <EditBox
          :EditWindows="EditWindows"
          :isEdit="isEdit"
          :Track="Track"
          :selectedTrack="selectedTrack"
          @edithandler="edithandler(EditWindows)"
          @setKey="editKeyHandler"
          @adjustTrack="adjustTrackHandler"
        />
      </div>
    </div>

    <div class="bottom">
      <button @click="edithandler(0)">Instrument</button>
      <button @click="edithandler(1)">Fx</button>
      <button @click="edithandler(2)">MIDI Editor</button>
    </div>
  </div>
</template>

<script rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css'/>

<script>
import Track from "../components/Track/index.vue";
import Head2 from "../components/Head2/index.vue";
import TrackEdit from "../components/TrackEdit/index.vue";
import EditBox from "../components/EditBox/index.vue";
export default {
  name: "App",
  components: {
    Track,
    Head2,
    TrackEdit,
    EditBox
  },
  computed: {
    trackIndex() {
      return this.trackNum;
    }
  },
  data() {
    return {
      Tone,
      hi: "hello",
      BPM: 120,
      time: "00:00.0",
      trackNum: 0,
      Track: [],
      EditWindows: "",
      isEdit: false,
      selectedTrack: -1,
      isPlaying: false,
      lead: [],
      index: -1,
      saved: [],

    };
  },

  methods: {
    setTransport() {
      Tone.Transport.bpm.value = 120;
      Tone.Transport.scheduleRepeat(time => {
        this.index = ++this.index % 16;
        const i = this.index;
        for (let j = 0; j < this.Track.length; j++) {
          //this.Track[this.selectedTrack].Data
          let lead = this.Track[j].Data;
          let poly = this.Track[j].poly;
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
    saving() {
      for (var i = 0; i < this.Track.length; i++) {
        for (var j = 0; j < this.Track[i].Data.length; j++) {
          this.saved.push(this.Track[i].Data[j].toString());
        }
        console.log(this.saved);
      }
    },
    loading() {},

    addTrackHandler() {
      this.Track.push({
        ID: this.trackNum,
        Time: "00:00:00",
        isSelect: false,
        //Data
        Data: Array.from({ length: 7 }, this.getEmptyArray),
        //PolySynth
        synthType: "Synth",
        poly: new Tone.PolySynth(8, Tone.Synth, {
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
        //Filter
        filter: new Tone.Filter(1500, "highpass"), //.toDestination()
      });
      //this.Track[this.selectTrack].poly.
      this.selectTrack(this.trackNum);
      this.sequencer();
      this.setTransport();
      this.trackNum++;
    },
    returnType(synthType){
      switch(synthType){
        case 'Synth':
          return Tone.Synth;
        case 'FMSynth':
          return Tone.FMSynth;
        case 'AMSynth':
          return Tone.AMSynth;
        case 'MetalSynth':
          return Tone.MetalSynth;
        case 'MembraneSynth':
          return Tone.MembraneSynth;
        case 'MonoSynth':
          return Tone.MonoSynth;
        default:
          console.log('wrong synth Type.');
      }
    },
    changeTrack(Track,synthType) {
      console.log(Track.poly.get());
      //Track.synthType = synthType;
      Track.poly = new Tone.PolySynth(8, this.returnType(synthType) , {        
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
      }).toMaster();
      console.log(Track.poly.get());
    },
    getEmptyArray(length = 16) {
      return Array.from({ length }, () => 0);
    },
    PlayHandler() {
      if (Tone.context.state !== "running") {
        Tone.context.resume().then(() => {
          console.log("PlayBack resumed successfully");
        });
      }
      if (this.isPlaying) {
        console.log("Stop");
        this.stop();
      } else {
        console.log("Play");
        this.play();
      }
    },
    play() {
      this.isPlaying = true;
      Tone.Transport.start();
    },
    stop() {
      this.isPlaying = false;
      Tone.Transport.stop();
      this.index = -1;
    },

    selectTrack(num) {
      //判斷現在選擇的音軌是哪一個
      this.Track.forEach(item => {
        item.isSelect = false;
      });
      this.Track[num].isSelect = !this.Track[num].isSelect;
      this.selectedTrack = num;
    },
    sequencer() {
      //把現在選擇的音軌的Lead data儲存起來 以便之後顯示
      this.lead = this.Track[this.selectedTrack].Data;
    },
    edithandler(num) {
      //判斷是否在編輯音樂，如果「是」的話又是在編輯哪一個部分
      if (this.isEdit === true) {
        if (this.EditWindows === num) {
          this.isEdit = false;
          this.EditWindows = "";
        } else {
          this.EditWindows = num;
        }
      } else {
        this.EditWindows = num;
        this.isEdit = true;
      }
    },

    editKeyHandler(arr, i) {
      if (arr[i] === 0) this.$set(arr, i, 1);
      else this.$set(arr, i, 0);
    },

    adjustTrackHandler(v) {
      var TrackPoly = this.Track[this.selectedTrack].poly;
      //console.log(this.Track[this.selectedTrack].synthType);
      //console.log(v)
      if (this.Track[this.selectedTrack].synthType != v.synthType) {
        
        this.changeTrack(this.Track[this.selectedTrack], v.synthType);
      } else {
        TrackPoly.set({         
          envelope: {
            attack: v.env.attack / 10,
            decay: v.env.decay / 10,
            sustain: v.env.sustain / 10,
            release: v.env.release / 10
          },          
          oscillator: {
            detune: parseInt(v.detune),
            type: v.osc,        
          },
          volume: parseInt(v.vol)
        });
        console.log(TrackPoly.get());
      }      
      
    },
    setFilter() {}
  },
  watch: {},
  mounted(){
  }
};
</script>

<style>
body {
  overflow: hidden;
  margin: 0;
  font-family: sans-serif;
}
#app {
  margin: 0 auto;
  padding: 0;
}
.layout {
  height: 95vh;
  width: 100%;
  margin: 0 auto;
}
.justTrack {
  display: grid;
  grid-template-rows: 50px 50px auto;
  grid-template-areas:
    "head1"
    "head2"
    "track";
  background: #666666;
}
.editTrack {
  display: grid;
  grid-template-rows: 50px 50px 300px auto;
  grid-template-areas:
    "head1"
    "head2"
    "track"
    "editBox";
  background: #666666;
}

.head-1 {
  grid-area: head1;
  background: #5f5f63;
}
.head-1 ul {
  display: inline-block;
  margin: 0;
  width: 500px;
}
.head-1 li {
  color: white;
  display: inline-block;
  padding: 10px;
  list-style: none;
}
.head-1 li:hover {
  text-decoration-line: underline;
}
.head-1 p {
  display: inline-block;
  margin: 0 auto;
  font-size: 18px;
  color: white;
  text-align: center;
}
.head-2 {
  grid-area: head2;
}
.leftRadius {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.rightRadius {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.track {
  grid-area: track;
  display: grid;
  grid-template-columns: 350px auto;
  grid-template-areas: "sideBox trackBox";
  overflow-y: auto;
  overflow-x: hidden;
}
.side-box {
  grid-area: sideBox;
  background: #2a2a31;
}
.addButton {
  display: inline-block;
  margin: 5px;
  border-radius: 5px;
  width: 95%;
  height: 30px;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background-color: #858585;
} /* the new scrollbar will have a flat appearance with the set background color */

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.774);
} /* this will style the thumb, ignoring the track */

::-webkit-scrollbar-corner {
  background-color: black;
}
.track-box {
  grid-area: trackBox;
  background: #202020;
  overflow-x: auto;
  overflow-y: hidden;
}
.timeline {
  display: inline-block;
  background: #38383a;
  border-radius: 5px;
  height: 35px;
  width: 2000px;
}
.timeline ul {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
  margin-top: 7px;
  margin-left: 5px;
  padding: 0px;
}
.timeline li {
  width: 20px;
  list-style-type: none;
  color: white;
}
.edit-box {
  grid-area: editBox;
  background: #606060;
}
.bottom {
  height: 5vh;
  width: 100%;
  background: #515159;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}
.bottom button {
  color: aliceblue;
  margin: 5px;
  background: #44444b;
  border: 2px solid #868693;
  border-radius: 5px;
}
</style>

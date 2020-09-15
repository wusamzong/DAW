<template>
  <div id="app">
    <div>
      {{test}}
    </div>
    <div class="create">
       <input type="text"
          placeholder="請輸入數字"
          v-model.trim="data"
          @keyup.enter="submitHandler">
      <button @click="submitHandler">create</button>
    </div>

    <div v-for="track in Tracks" :key="track.id">
      <h3>{{track.index}}</h3>
      <p>{{track}}</p>
 

    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data(){
    return{
      test:'hello',
      data: ''
    }
  },
  computed:{
    ...mapState([
      'Tracks'
    ])
  },
  methods:{
    submitHandler(){
      if(!this.data) return
      this.$store.commit('ADD_TRACKS',{data:parseInt(this.data)})
      this.data=''
    }
  }
  ,  
  mounted(){
    this.$store.dispatch('INIT_TRACKS')
  }
}
</script>
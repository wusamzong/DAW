import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    Tracks: [],
    Bytes:[] , 
    Todos: []
  },
  mutations: {
    SET_TODOS(state, todos){
      state.Todos = todos.data
      console.log(state.Todos)
    },
    ADD_TODOS(state, todos){
      state.Todos.push(todos)
      console.log("ADD_TODOS")
      console.log(todos)
      axios
        .post("http://lara-api.test/api/todos",todos)
        .then((res)=>{
          console.log(res)
        }).catch((err)=>{
          console.log(err)
        })
    },
    UPDATE_TODOS(state,input){   
      axios
        .put("http://lara-api.test/api/todos",input.data)
        .then((res)=>{
          console.log(res)
          state.Todos[input.id].item=input.data.item
          state.Todos[input.id].status=input.data.status          
        }).catch((err)=>{
          console.log(err)
        })
    },
    REMOVE_TODOS(state,ID){
      state.Todos.splice(ID,1)
      axios
        .delete("http://lara-api.test/api/todos/"+state.Todos[ID].id,state.Todos[ID].id)
        .then((res)=>{
          console.log(res)
          
        }).catch((err)=>{
          console.log(err)
        })
    },

    SET_TRACKS(state, tracks){
      state.Tracks=tracks.data.map(track=> track.data.toString(2))      
      console.log(state.Tracks)      
    },
    ADD_TRACKS(state, tracks){
      console.log(tracks)
      state.Tracks.push(tracks.data)
      axios
        .post("http://lara-api.test/api/tracks",tracks)
        .then((res)=>{          
          console.log(res)
        }).catch((err)=>
          console.log(err)
        )
    },/*
    UPDATE_TRACKS(state,{index,track}){
      state.Tracks.ID= track.ID
      state.Tracks[index].Time = track.Time
      state.Tracks.Data = track.Data
    },
    REMOVE_TODOS(state, index){
      state.Tracks.splice(index, 1)
    }*/
  },
  actions: {
    INIT_TRACKS({ commit }){
      axios
        .get("http://lara-api.test/api/tracks")
        .then(r => r.data)
        .then(tracks => {
          commit("SET_TRACKS",tracks)
          console.log(tracks)
        }).catch(err=>{
          console.log(err)
        })
    },
    INIT_TODOS({ commit }){
      axios
        .get("http://lara-api.test/api/todos")
        .then(r => r.data)
        .then(todos => {
          commit("SET_TODOS",todos)  
          console.log(todos)        
        }).catch(err=>{
          console.log(err)
        })
    }
  },

})

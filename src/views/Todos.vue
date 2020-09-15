<template>
  <div id="app">
    <h1>Todo List</h1>

    <div class="input">
      <input
        type="text"
        placeholder="請輸入代辦事項"
        v-model.trim="inputData"
        @keyup.enter="submitHandler"
      />
      <button @click="submitHandler">Create</button>
    </div>
    <div class="todoitem">
      <TodoItem v-for="num in Todos.length" :key="num" :index="num"></TodoItem>
    </div>
    
  </div>
</template>
<script>
import { mapState } from "vuex";
import TodoItem from "../components/TodoItem.vue";
export default {
  components: {
    TodoItem
  },
  data() {
    return {
      inputData: "",
      edit: null
    };
  },
  computed: {
    ...mapState(["Todos"])
  },
  methods: {
    submitHandler() {
      if (!this.inputData) return;
      this.$store.commit("ADD_TODOS", {
        item: this.inputData,
        status: 0
      });
      this.inputData = "";
    }
  },
  mounted() {
    this.$store.dispatch("INIT_TODOS");
  }
};
</script>
<style scoped>
body {
  margin: 0;
}
#app {
  margin: 0 auto;
  padding: 0 20%;
  height: 100vh;
  font-family: sans-serif;
  background: #ffc041;
}
h1 {
  font-size: 50px;
  margin: 10px;
  padding: 20px 0;
  color: #603000;
}
input[type="text"] {
  margin: 0 0 0 10px;
  padding: 5px 15px;
  width: 70%;
  height: 30px;
  border: 2px rgb(132, 70, 0) solid;
  background: #ffde9b;
  cursor: pointer;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
button{
  margin: 0 0 0 10px;
  font-size: 25px;
  padding: 5px 15px;
  width: 20%;
  background: #ff5a39;
  color: antiquewhite;
  height: 43px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.todoitem{
  margin-top: 10px;
  background: #ffedcc;
  border-radius: 5px;
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
}

</style>
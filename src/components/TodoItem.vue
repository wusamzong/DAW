<template>
  <div class="Item">
    <div class="createTask" v-if="edit !==null">
      <input      
      type="text"    
      v-focus  
      v-model.trim="edit"
      @keyup.enter="updateHandler(index-1)"
      @blur="cancelHandler"
      />
    </div>
    

    <div class="data" v-else>
      <!--<label>{{ Todos[index]}}</label>-->
      
      <label class="container">
        <input type="checkbox" v-model="complete" />
        <span class="checkmark" @click="editHandler(index-1)">{{todo.item}}</span>
      </label>
      <div class="deleteButton" @click="destroyHandler(index-1)">X</div>
      
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      edit: null
    };
  },
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(["Todos"]),
    test() {
      return this.index - 1;
    },
    todo() {
      return this.Todos[this.index - 1];
    },
    complete: {
      get() {
        return this.todo.status;
      },
      set(val) {
        this.$store.commit("UPDATE_TODOS", {
          id: this.index - 1,
          data: {
            todo_id: this.todo.id,
            item: this.todo.item,
            status: val
          }
        });
      }
    }
  },
  methods: {
    destroyHandler() {
      if (confirm("是否確認刪除"+this.todo.item +"?"))
        this.$store.commit("REMOVE_TODOS", this.index-1);
    },
    editHandler() {
      this.edit = this.todo.item;
      //this.cache = this.todo.content  //cache只是一個放資料的地方，不需要宣告和資料綁定
    },
    updateHandler() {
      if (!this.edit) return this.destroyHandler();
      this.$store.commit("UPDATE_TODOS", {
        id: this.index - 1,
        data: {
          todo_id: this.Todos[this.index - 1].id,
          item: this.edit,
          status: this.todo.status
        }
      });
      this.cancelHandler();
    },
    cancelHandler() {
      this.edit = null;
    }
  }
};
</script>
<style scoped>
.Item {  
  width: 95%;
  height: 60px;
  margin: 5px;
  margin-left: 2%;
  background: #fffcf9;  
  border-radius: 5px;
}
.data {
  padding: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.container{
  display: flex;
  align-items: center;

}
.data input{
  appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  border-radius: 2px solid #ff9640;
  background-color: #ffc889;
  margin: 0;
}
.data input:checked:after{
  content: ' ';
  font-size: 25px;
  top: 3px;
  left: 3px;
  color: #fff7f1;
  border-radius: 2px solid #fff7f1;
  background-color: #4f3f2c;
}
.data input:checked {
  color: #ffe8ce;
  border-radius: 2px solid #fff7f1;
  background-color: #4f3f2c;
}
.data span{
  font-size: 25px;
  font-weight: bold;
  color: #4f3f2c;
  margin-left: 10px;
}
.deleteButton{
  font-weight: bold;
  color: #6a6259;
  cursor: pointer;
}
.createTask{
  padding: 15px;
  width: 92%;
}
.createTask input{  
  padding-left: 15px;
  
  height: 25px;
  border-radius: 5px;
}


</style>
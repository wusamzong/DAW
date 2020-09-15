<template src='./template.html'>
  
</template>

<script>
export default {
  props:{
    BPM:{
      type: Number,
      required: true
    },
    time:{
      type: Number,
      required: true
    }

  }
}
</script>

<style scope>
  .head2 {
  background: #5f5f63;
  padding: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: stretch;
}
.step {
  background: #5f5f63;
  flex-grow: 1;
  padding: 0 50px;
}
.step button {
  height: 40px;
  width: 50px;
  background: #383838;
  padding: 4px 6px;
  border: 1px solid #5f5f63;
  color: #c0c0c0;
  cursor: pointer;
}
.play {
  background: #5f5f63;
  padding: 0 50px;
  flex-grow: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
}
.play button {
  flex-grow: 1;
  height: 40px;
  width: 50px;
  background: #383838;
  border: 1px solid #5f5f63;
  color: #c0c0c0;
  cursor: pointer;

}
.play p {
  flex-grow: 1;
  margin: 0 auto;
  width: 120px;
  background: #383838;
  border: 1px solid #5f5f63;
  color: #c0c0c0;
  text-align: center;
  font-size: 23px;
  padding: 5px;
}
.BPM {
  background: #5f5f63;
  flex-grow: 1;
  padding: 0 35px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
}
.BPM p {
  flex-grow: 2;
  margin: 0 auto;
  width: 100px;
  background: #383838;
  border: 1px solid #5f5f63;
  color: #c0c0c0;
  text-align: center;
  padding: 5px;
  font-size: 23px;
}
.BPM button {
  flex-grow: 1;
  background: #383838;
  color: #c0c0c0;
  border: 1px solid #5f5f63;
  cursor: pointer;
}

.volume {
  background: #5f5f63;
  flex-grow: 1;
}
.save{
  padding: 0 50px;
}
.save button{
  height: 40px;
  width: 50px;
  border: none;
  border-radius: 5px;
  
  flex-grow: 1;
  background: #71ffa5;
  color: #ffffff;
}
</style>
<template>
  <div className="askName">
    <h1>Enter your name</h1>
    <div className="subcon">
      <input type='text' v-model="playerName" />
      <div className="save-btn" v-on:click="createPlayer">Save</div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            playerName: '',
        }
    },
    methods: {
      async createPlayer() {
        this.$emit('create-player', this.playerName);
      },
    },
};
</script>

<style>
.askName{
    box-sizing: border-box;
    height: 500px;
    width: 500px;
    outline: 4px solid #feeb2c;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Press Start 2P', cursive;
    box-sizing: border-box;
    gap: 40px;
    margin-top: 35px;
}

.askName h1{
    font-size: 30px;
    color: #ff074e;
}

.askName input{
    width: 60%;
    height: 40px;
    border: none;
    background-color: black;
    outline: 2px solid #feeb2c;
    color: #feeb2c;
    font-family: 'Press Start 2P', cursive;
    font-size: 22px;
    padding-left: 10px;
}

.save-btn{
    width: 100px;
    height: 40px;
    background-color: #feeb2c;
    outline: 2px solid #feeb2c;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: url("../assets/hand_cur.png"), auto;
}

.askName .subcon{
    display: flex;
    justify-content: center;
    align-items: center;
}


@media only screen and (max-height: 790px) {
    .askName{
        height: 400px;
        width: 400px;
    }
    .askName h1{
        font-size: 22px;
    }
}

@media only screen and (max-height: 600px){
    .askName{
        height: 350px;
        width: 350px;
    }
}

@media only screen and (max-width: 450px){
    .askName{
        width: 300px;
        height: 300px;
    }
    .askName h1{
        font-size: 18px;
    }
    .askName input{
        width: 60%;
        height: 35px;
        font-size: 18px;
        padding-left: 10px;
    }
    .save-btn{
        width: 30%;
        height: 35px;
    }
}
</style>
<template>
  <div className="gameover">
    <div className="over">
      <h2>Game</h2>
      <h2>Over!</h2>
    </div>
    <button v-on:click="restartGame"><h3>Restart</h3></button>
  </div>
</template>

<script>
export default {
  methods: {
    restartGame() {
      this.$emit("restart-game");
    },
  },
};
</script>

<style>
.gameover {
  box-sizing: border-box;
  height: 500px;
  width: 500px;
  outline: 4px solid #feeb2c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Press Start 2P", cursive;
  box-sizing: border-box;
}

.over {
  height: auto;
  padding-bottom: 40px;
  animation: increase 3s infinite;
}
.gameover h2 {
  font-size: 60px;
  color: #ff074e;
}
.gameover button {
  color: #feeb2c;
  font-family: "Press Start 2P", cursive;
  border: none;
  height: 40px;
  background: none;
  font-size: 22px;
  transition: 0.3s;
  cursor: url("../assets/hand_cur.png"), auto;
}

.gameover button:hover {
  transform: scale(1.2);
}

@keyframes increase {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}

@media only screen and (max-height: 790px) {
  .gameover {
    height: 400px;
    width: 400px;
  }
  .gameover h2 {
    font-size: 42px;
  }
}

@media only screen and (max-height: 600px) {
  .gameover {
    height: 350px;
    width: 350px;
  }
}

@media only screen and (max-width: 450px) {
  .gameover {
    width: 300px;
    height: 300px;
  }
  .gameover h2 {
    font-size: 30px;
  }
}
</style>
<template>
  <div class="App">
    <NavBar />
    <div class="main">
      <Board />
      <ScoreBoard />
    </div>
    <div class="foot">
      <p>Made with</p>
      <img src="./assets/love.png" alt="love" />
      <p>by Anom</p>
    </div>
  </div>
</template>

<script>
import Board from "./components/mainBoard.vue";
import ScoreBoard from "./components/ScoreBoard.vue";
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    Board,
    ScoreBoard,
    NavBar,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap");

* {
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

.App {
  width: 100%;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("./assets/bg1.svg");
  cursor: url("./assets/point_cur.png"), auto;
}

.main {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 10%;
}

.foot {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00e339;
  font-family: "Press Start 2P", cursive;
}

.foot img {
  width: 50px;
}

@media only screen and (max-height: 790px) {
  .help {
    font-size: 12px;
  }
  .foot {
    font-size: 14px;
  }
}

@media only screen and (max-height: 600px) {
  .navbar {
    height: 70px;
  }
  .help {
    font-size: 10px;
  }
  .foot {
    margin-top: -6px;
    font-size: 12px;
  }
  .foot img {
    width: 30px;
  }
}

@media only screen and (max-width: 450px) {
  .foot {
    font-size: 12px;
  }
  .foot img {
    width: 40px;
  }
}
</style>

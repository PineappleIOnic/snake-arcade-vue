<template>
  <div class="board">
    <div
      :class="`sound-icon ${musicPlaying ? 'on' : 'off'} `"
      v-on:click="() => (this.musicPlaying = !this.musicPlaying)"
    ></div>
    <div
      :class="`help-icon ${needhelp ? 'need' : 'not-needed'}`"
      v-on:click="() => (this.needhelp = !this.needhelp)"
    ></div>
    <HelpModel v-if="needhelp" />
    <AskName v-if="!player" v-on:create-player="createPlayer" />
    <div v-else>
      <div class="name-input">
        <p>Player name:</p>
        <p class="dig">{{ player }}</p>
      </div>
      <GameOver v-if="gameOver" v-on:restart-game="gameOver = false" />
      <div class="snake-board" v-else>
        <SnakeRender :snakePos="snakePos" />
        <FoodRender :foodPos="foodPos" />
        <GoldenFood :goldenFoodPos="goldenFoodPos" />
      </div>
    </div>

    <div class="scores">
      <p>
        Your Highscore: <span class="dig">{{ score }}</span>
      </p>
      <p>
        Current Score:
        <span class="dig">{{ (snakePos.length - 1) * 10 + goldenPoints }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import collect_soundfx from "../assets/collect.mp3";
import background_music from "../assets/background-music.mp3";
import gameover_music from "../assets/game_over.mp3";
import gameplay_music from "../assets/gameplay.mp3";
import { api } from "../api";
import { Query } from "appwrite";

import AskName from "./AskName.vue";
import SnakeRender from "./SnakeRender.vue";
import FoodRender from "./FoodRender.vue";
import GoldenFood from "./GoldenFood.vue";
import GameOver from "./GameOver.vue";
import HelpModel from './HelpModel.vue'

export default {
  components: {
    AskName,
    SnakeRender,
    FoodRender,
    GoldenFood,
    GameOver,
    HelpModel
  },
  methods: {
    getRandom() {
      let min = 0;
      let max = 96;
      let x = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
      let y = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
      return [x, y];
    },
    increaseSpeed() {
      let l = this.snakePos.length;
      if (l % 10 === 0) {
        this.speed -= 10;
      }
    },
    move() {
      const interval = setInterval(async () => {
        this.gameplayMusicPlaying = this.musicPlaying;
        const head = [this.snakePos[0][0], this.snakePos[0][1]];
        const newSnakePos = [...this.snakePos];

        if (this.gameOver) {
          return;
        }

        switch (this.dir) {
          case "R":
            head[0] += 4;
            break;
          case "L":
            head[0] -= 4;
            break;
          case "U":
            head[1] -= 4;
            break;
          case "D":
            head[1] += 4;
            break;
          default:
            break;
        }
        newSnakePos.unshift(head);

        if (
          newSnakePos[0][0] === this.goldenFoodPos[0] &&
          newSnakePos[0][1] === this.goldenFoodPos[1]
        ) {
          this.collectAudioPlaying = true;
          this.goldenPoints = this.goldenPoints + 50;

          //remove golden food from board
          this.goldenFoodPos = [];
        }

        if (
          newSnakePos[0][0] === this.foodPos[0] &&
          newSnakePos[0][1] === this.foodPos[1]
        ) {
          this.collectAudioPlaying = true;
          this.foodPos = this.getRandom();
          this.increaseSpeed();
        } else {
          newSnakePos.pop();
        }

        if (this.checkCollision(newSnakePos)) {
          if (
            (this.snakePos.length - 1) * 10 + this.goldenPoints >
            this.score
          ) {
            this.score = this.snakePos.length * 10 + this.goldenPoints;
            localStorage.setItem(
              "highscore",
              this.snakePos.length * 10 + this.goldenPoints
            );
            this.uploadScore(this.snakePos.length * 10 + this.goldenPoints);
          }
          this.speed = 0;
          this.dir = "";
          this.music.currentTime = 0;
          this.gameplayMusic.currentTime = 0;
          // setMusicPlaying(false);
          this.gameplayMusicPlaying = false;
          this.gameOverMusicPlaying = true;
          clearInterval(interval);
          //wait for 2 seconds before game over
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.gameOverMusicPlaying = false;
          // setMusicPlaying(true);
          this.gameOver = true;
          this.goldenPoints = 0;
          this.speed = 120;
          this.snakePos = [[44, 44]];
          this.foodPos = this.getRandom();
        } else {
          this.snakePos = newSnakePos;
        }
      }, this.speed);
    },
    handleKeyPress(e) {
      if (e.key === "ArrowRight" && this.dir !== "L") {
        this.dir = "R";
      } else if (e.key === "ArrowLeft" && this.dir !== "R") {
        this.dir = "L";
      } else if (e.key === "ArrowUp" && this.dir !== "D") {
        this.dir = "U";
      } else if (e.key === "ArrowDown" && this.dir !== "U") {
        this.dir = "D";
      }
    },
    async createPlayer(name) {
      this.score = 0;
      this.gameOver = false;
      localStorage.removeItem("cookieFallback");
      localStorage.removeItem("highscore");
      await api.account.createAnonymousSession();
      await api.account.updateName(name);
      localStorage.setItem("player", name);
      this.player = name;
      console.log("Player successfully created");
      const res = await api.account.getSessions();
      localStorage.setItem("userId", res.sessions[0].userId);
    },

    checkCollision(snakePos) {
      const head = snakePos[0];
      const [x, y] = head;
      if (x < 0 || x > 98 || y < 0 || y > 98) {
        return true;
      }
      for (let i = 1; i < snakePos.length; i++) {
        if (head[0] === snakePos[i][0] && head[1] === snakePos[i][1]) {
          return true;
        }
      }
      return false;
    },

    async uploadScore(num) {
      try {
        let obj = await api.database.listDocuments(process.env.VUE_APP_APPWRITE_COLLECTIONS, [
          Query.equal("userId", localStorage.getItem("userId")),
        ]);
        if (obj.documents.length !== 0) {
          await api.database.updateDocument(
            process.env.VUE_APP_APPWRITE_COLLECTIONS,
            obj.documents[0].$id,
            {
              score: num,
            },
            ["role:all"],
            [`user:${localStorage.getItem("userId")}`]
          );
        } else {
          await api.database.createDocument(
            process.env.VUE_APP_APPWRITE_COLLECTIONS,
            "unique()",
            {
              userId: localStorage.getItem("userId"),
              player: this.player,
              score: num,
            },
            ["role:all"],
            [`user:${localStorage.getItem("userId")}`]
          );
        }
      } catch {
        console.log("Error uploading score");
      }
    },
  },

  data() {
    return {
      needhelp: false,
      snakePos: [[44, 44]],
      foodPos: this.getRandom(),
      goldenFoodPos: this.getRandom(),
      goldenPoints: 0,
      dir: "",
      speed: 120,
      score: localStorage.getItem("highscore") || 0,
      gameOver: false,
      player: localStorage.getItem("player") || "",

      // Audio States
      collectAudioPlaying: false,
      musicPlaying: false,
      gameOverMusicPlaying: false,
      gameplayMusicPlaying: false,

      // Audio
      collectAudio: new Audio(collect_soundfx),
      music: new Audio(background_music),
      gameOverMusic: new Audio(gameover_music),
      gameplayMusic: new Audio(gameplay_music),
    };
  },

  watch: {
    collectAudioPlaying(val) {
      val ? this.collectAudio.play() : this.collectAudio.pause();
    },
    goldenFoodPos() {
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * 100);
        if (random < 10) {
          this.goldenFoodPos = this.getRandom();
          setTimeout(() => {
            this.goldenFoodPos = [];
          }, 4000); //after 4sec it will vanish
        }
      }, 6000);
      return () => clearInterval(interval);
    },
    speed: {
      handler() {
        this.move();
      },
      immediate: true,
    },
  },

  beforeUpdate() {
    this.musicPlaying && !this.dir ? this.music.play() : this.music.pause();
    this.gameplayMusicPlaying && this.dir
      ? this.gameplayMusic.play()
      : this.gameplayMusic.pause();

    this.collectAudio.addEventListener("ended", () => {
      this.collectAudioPlaying = false;
    });
  },

  beforeUnmount() {
    this.music.pause();
    this.gameplayMusic.pause();
    this.gameOverMusic.pause();

    this.collectAudio.removeEventListener("ended", () => {
      this.collectAudioPlaying = false;
    });

    document.removeEventListener("keydown", this.handleKeyPress);
  },

  mounted() {
    this.music.volume = 1;
    this.collectAudio.volume = 0.6;
    this.gameplayMusic.volume = 0.3;

    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  },
};
</script>

<style>
.board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  position: relative;
  font-family: "Press Start 2P", cursive;
}

.sound-icon,
.help-icon {
  width: 40px;
  height: 40px;
  position: absolute;
  right: -65px;
  top: 50px;
  background-size: cover;
  cursor: url("../assets/hand_cur.png"), auto;
}

.help-icon {
  top: 110px;
}

.need {
  background-image: url("../assets/help-filled.png");
}
.not-needed {
  background-image: url("../assets/help.png");
}

.on {
  background-image: url("../assets/music-on.png");
}
.off {
  background-image: url("../assets/music-off.png");
}

.snake-board {
  box-sizing: border-box;
  position: relative;
  width: 500px;
  height: 500px;
  outline: 4px solid #ff074e;
  background-color: #1a1a1a;
}
.snake-board::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    #282c35 0,
    #282c35 4%,
    #16161d 4%,
    #16161d 8%
  );
}

.snake-board::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    #282c35 0,
    #282c35 4%,
    #16161d 4%,
    #16161d 8%
  );
  mix-blend-mode: difference;
}

.name-input {
  background-color: #000000;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  color: #feeb2c;
}

.name-input p {
  font-family: "Press Start 2P", cursive;
  font-size: 20px;
}

/* .name-input input{
    font-family: 'Press Start 2P', cursive;
    font-size: 22px;
    max-width: 200px;
    width: auto;
    height: 30px;
    border: none;
    background-color: #292828;
    padding-left: 10px;
} */

/* .name-input input:focus{
    outline: none;
} */

.scores {
  margin-bottom: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  font-family: "Press Start 2P", cursive;
  gap: 10px;
  background-color: #000000;
}

.scores p {
  color: #feeb2c;
}
.dig {
  color: #0058f8;
}

/*--------------- Trying to make it responsible for smaller screen :) ------------------*/

@media only screen and (max-height: 790px) {
  .snake-board {
    width: 400px;
    height: 400px;
  }
  .name-input p {
    font-size: 18px;
  }
}

@media only screen and (max-height: 600px) {
  .snake-board {
    width: 350px;
    height: 350px;
  }
  .name-input p {
    font-size: 16px;
  }
  .scores p {
    font-size: 14px;
  }
}

@media only screen and (max-width: 450px) {
  .snake-board {
    width: 300px;
    height: 300px;
  }
  .name-input p {
    font-size: 12px;
  }
  .scores p {
    font-size: 12px;
  }
  .name-input input {
    width: 160px;
    font-size: 12px;
  }
}
</style>
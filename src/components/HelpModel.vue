<template>
  <div className="help-con">
    <span>How to play!</span>
    <p>
      Use the arrow keys to move the snake. Avoid hitting the walls or yourself.
    </p>
    <p>Eat the food to increase your score.</p>
    <p>As you eat the food, the snake's movement speed increases.</p>
    <img :src="keyboard_help" alt="Arrow-keys" />
  </div>
</template>

<script>
import keyboard_help from "../assets/keyboard.svg";
export default {
  data() {
    return {
      keyboard_help: keyboard_help,
    };
  },
};
</script>

<style>
.help-con {
  box-sizing: border-box;
  padding: 5%;
  height: 500px;
  background-color: #1a1a1a;
  position: absolute;
  top: 40px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  transition: 2s;
}
.help-con span {
  font-size: 22px;
  color: #fff;
}
.help-con p {
  line-height: 16px;
  font-size: 12px;
  color: #ff074e;
  align-self: flex-start;
}

@media only screen and (max-height: 790px) {
  .help-con {
    height: 400px;
    width: 400px;
  }
  .help-con span {
    font-size: 20px;
  }
  .help-con p {
    font-size: 10px;
  }
  .help-con img {
    width: 70%;
  }
}

@media only screen and (max-height: 600px) {
  .help-con {
    height: 350px;
    width: 350px;
  }
  .help-con p {
    font-size: 9px;
  }
  .help-con img {
    width: 70%;
  }
}

@media only screen and (max-width: 450px) {
  .help-con {
    width: 300px;
    height: 300px;
  }
  .help-con h2 {
    font-size: 30px;
  }
}
</style>
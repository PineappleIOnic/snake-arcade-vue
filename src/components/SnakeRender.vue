<template>
  <div>
      <div v-for="snake in snakePos" v-bind:key="snake" ref="snake" class="head" :style="{left: `${snake[0]}%`, top: `${snake[1]}%`}">
      </div>
  </div>
</template>

<script>
export default {
    props: ['snakePos'],
};
</script>

<style>
.head{
    box-sizing: border-box;
    border-radius: 25%;
    position: absolute;
    width: 4%;
    height: 4%;
    background-color: #15f800;
    border: 1px solid #027002;
    z-index: 2;
    transition: 0.1s;
}
</style>
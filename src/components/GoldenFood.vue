<template>
  <div
    :class="`specialfood ${goldenFoodPos.length === 0 ? 'hide' : ''}`"
    :style="{ left: `${goldenFoodPos[0]}%`, top: `${goldenFoodPos[1]}%` }"
  >
    <img :src="food" alt="food" />
  </div>
</template>

<script>
import food from "../assets/golden-apple.png";
export default {
  props: ["goldenFoodPos"],
  data: function () {
    return {
      food: food,
    };
  },
};
</script>

<style>
.specialfood {
  position: absolute;
  width: 4%;
  height: 4%;
  border-radius: 5px;
  z-index: 1;
  animation: increaseFood 2s infinite;
}

.hide {
  display: none;
}

.specialfood img {
  width: 100%;
  height: 100%;
}

@keyframes increaseFood {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
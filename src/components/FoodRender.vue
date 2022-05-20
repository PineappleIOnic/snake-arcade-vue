<template>
  <div className="food" :style="{left: `${foodPos[0]}%`, top: `${foodPos[1]}%`}">
    <img :src="food" alt="food" />
  </div>
</template>

<script>
import food from '../assets/apple.png';
export default {
    props: ['foodPos'],
    data: function() {
        return {
            food: food,
        }
    }
};
</script>

<style>
.food{
    position: absolute;
    width: 4%;
    height: 4%;
    border-radius: 5px;
    z-index: 1;
    animation: increaseFood 2s infinite;
}

.food img{
    width: 100%;
    height: 100%;
}

@keyframes increaseFood{
    0%{
        transform: scale(1);
    }
    50%{
        transform: scale(1.3);
    }
    100%{
        transform: scale(1);
    }
}

/* @media only screen and (max-width: 450px){
    .food img{
        width: 100%;
        height: 100%;
    }
} */
</style>
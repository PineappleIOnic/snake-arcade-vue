<template>
  <div className="navbar">
    <p>Snake Arcade</p>
    <div className="logo-con">
      <i class="fa-brands fa-dev logo" v-on:click="() => window.open('https://dev.to/anomic30')" />
      <i class="fa-brands fa-github logo" v-on:click="()=>window.open('https://github.com/anomic30')" />
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style>
.navbar {
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00e339;
  font-family: "Bungee Shade", cursive;
}

.navbar p {
  font-size: 60px;
  margin-right: auto;
  margin-left: auto;
  padding-left: 60px;
}

.logo {
  height: 40px;
  width: 40px;
  font-size: 40px;
  color: #00e339;
  background-color: #000000;
  cursor: url("../assets/hand_cur.png"), auto;
}

.logo-con {
  margin-right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/*--------------- Trying to make it responsible for smaller screen :) ------------------*/

@media only screen and (max-height: 790px) {
  .navbar {
    height: 80px;
  }
  .navbar p {
    font-size: 40px;
  }
}

@media only screen and (max-height: 600px) {
  .navbar {
    height: 70px;
  }
}
@media only screen and (max-width: 750px) {
  .navbar p {
    font-size: 35px;
  }
}

@media only screen and (max-width: 450px) {
  .navbar {
    height: 60px;
  }
  .navbar p {
    font-size: 30px;
    padding-left: 0px;
  }
  .logo {
    top: 2%;
    height: 30px;
    width: 30px;
  }
}

@media only screen and (max-width: 365px) {
  .navbar p {
    font-size: 28px;
    padding-left: 0px;
  }
}
</style>
<template>
  <div class="carte" :style="{'--w' : '200px'}">
    <img src="@/assets/imgs/carte/perso/fond_comm.png" alt="carte" />
     <div id="tour_img">
        <p id="nom">Mzhdunosaurus</p>
        <div class="PV">
            <p id="PV">120</p>
            <p id="lblPV"> PV</p>  
        </div>
        <div class="niv">
            <p id="lblNiv">niveau </p>
            <p id="niv">5</p> 
        </div>
    </div>
  </div>
</template>



<style scoped>
@import '../assets/css/carteMembre.css';
</style>
<script setup>
import { ref, defineEmits } from 'vue';
const emit = defineEmits(['validate', 'cancel']);
const selected = ref(null);
const { userData } = defineProps({
    userData: Object,
});


function changementPP() {
    if (selected.value) {
        emit('validate', selected.value);
    }
}

function cancel() {
    emit('cancel');
}

const collection_images = ref([]);
for (let elem of userData.collection) {
    console.log(elem.card.cardId);
    switch (elem.card._class) {
        case 'member':
            collection_images.value.push(
                `/assets/imgs/carte/perso/${elem.card.cardId}.png`,
            );
            break;
        case 'pet':
            collection_images.value.push(
                `/assets/imgs/carte/pet/${elem.card.cardId}.png`,
            );
            break;
        case 'arena':
            collection_images.value.push(
                `/assets/imgs/carte/arena/carre/${elem.card.cardId}.png`,
            );
            break;
        default:
            break;
    }
}
selected.value = userData.profilePicture ? userData.profilePicture : '/assets/imgs/logoTCG.png'
</script>

<template>
    <div class="popup">
        <div class="header">
            <h2>Choisissez une nouvelle image de profil</h2>
            <span @click="cancel" id="closeBtn">&Cross;</span>
        </div>
        <div class="currentPP">
            <h3>Image de profil actuelle</h3>
            <div class="ppvalidator">
                <img :src="selected" alt="Image de profil actuelle" />
                <span class="validate" @click="changementPP">&check;</span>
            </div>
        </div>

        <div class="scroller">
            <h3>Collection de l'utilisateur</h3>
            <div class="collection">
                <div
                    v-for="(image, index) in collection_images"
                    :key="index"
                    class="imageContainer"
                    :class="{ selected: selected == image }"
                    @click="selected = image"
                >
                    <img :src="image" alt="Image manquante"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
    div.popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.342);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        width:90vw;
        height:90vh;
    }
    #closeBtn {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 30px;
        color:red;
        font-weight: bold;
    }
    div.collection {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

    }
    div.imageContainer {
        height: 100px;
        width: 100px;
        border: 2px solid lightgray;
        border-radius: 100px;
    }
    img {
        height: 100px;
        width:100px;
        object-fit: cover;
        object-position: center;
        border-radius:100px;
    }
    span.validate {
        text-align: center;
        font-size: 100px;
        line-height: 100px;
        color:green;
        font-weight: bold;
        cursor: pointer;
        padding:0;
    }
    div.ppvalidator {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    div.imageContainer.selected {
        border:3px solid rgba(255, 166, 0, 0.932);
    }
</style>
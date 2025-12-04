<template>
  <div
    class="relative"
    :style="{
      width: cardDimensions.width + 'vw',
      height: cardDimensions.height + 'vw',
      perspective: '600px',
    }"
  >
    <div
      v-for="(card, index) in cards"
      :key="card.id"
      class="toutes_les_cartes"
      :style="{
        left: '0',
        top: '0',
        transform: getCardTransform(card.id, index),
        transition:
          cardPositions[card.id] && cardPositions[card.id].isExiting
            ? 'transform 0.5s ease-in'
            : 'transform 0.3s ease-out',
        zIndex: isDragging === card.id ? 9999 : cards.length - index,
        pointerEvents:
          cardPositions[card.id] && cardPositions[card.id].isExiting
            ? 'none'
            : 'auto',
      }"
      @mousedown="startDrag($event, card.id)"
      @touchstart="startDrag($event, card.id)"
      @click="throwCard(card.id)"
    >
      <div
        class="rounded-2xl border-4 border-white carte-container"
        :style="{
          width: cardDimensions.width + 'vw',
          height: cardDimensions.height + 'vw',
        }"
      >
        <component
          v-if="card.component"
          :is="card.component"
          v-bind="card.props || {}"
          class="w-full h-full"
        />
        <img
          v-else
          :src="card.img"
          :alt="`card-${card.id}`"
          class="w-full h-full object-cover pointer-events-none select-none"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: '',
  },
  sensitivity: {
    type: Number,
    default: 50,
  },
  cardDimensions: {
    type: Object,
    default: () => ({ width: 20, height: 35 }), // Valeurs en vw
  },
  cardsData: {
    type: Array,
    default: () => [],
  },
  animationConfig: {
    type: Object,
    default: () => ({ stiffness: 260, damping: 20 }),
  },
  sendToBackOnClick: {
    type: Boolean,
    default: false,
  },
});

const cards = ref(props.cardsData.length ? props.cardsData : []);

const cardPositions = ref({});
const isDragging = ref(null);
const dragStart = ref({ x: 0, y: 0 });
const initialRotations = ref({});
const dragMoved = ref(false);
const collectedCards = ref([]);

const emit = defineEmits(['allCardsGone', 'cardCollected']);

watch(
  () => cards.value.length,
  (newLength) => {
    if (newLength === 0) {
      console.log('Toutes les cartes sont parties !');
      emit('allCardsGone', collectedCards.value);
    }
  }
);

onMounted(() => {
  cards.value.forEach((card) => {
    cardPositions.value[card.id] = { x: 0, y: 0, isExiting: false };
    if (props.randomRotation) {
      initialRotations.value[card.id] = Math.random() * 10 - 5;
    } else {
      initialRotations.value[card.id] = 0;
    }
  });
  console.log('Cards mounted:', cards.value);
  console.log('Card positions:', cardPositions.value);
});

function getCardTransform(cardId, index) {
  const pos = cardPositions.value[cardId] || { x: 0, y: 0, isExiting: false };
  const rotation = initialRotations.value[cardId] || 0;
  const scale = isDragging.value === cardId ? 1.05 : 1;

  let rotateX = 0;
  let rotateY = 0;
  let finalRotation = rotation;

  if (isDragging.value === cardId) {
    rotateX = -pos.y / 10;
    rotateY = pos.x / 10;
  }

  if (pos.isExiting) {
    finalRotation += 45;
  }

  const transform = `translate(${pos.x}px, ${pos.y}px) rotateZ(${finalRotation}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  return transform;
}

function startDrag(event, cardId) {
  isDragging.value = cardId;
  dragMoved.value = false;

  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  dragStart.value = {
    x: clientX - (cardPositions.value[cardId]?.x || 0),
    y: clientY - (cardPositions.value[cardId]?.y || 0),
  };

  event.preventDefault();
}

function onDrag(event) {
  if (!isDragging.value) return;

  dragMoved.value = true;

  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  const newX = clientX - dragStart.value.x;
  const newY = clientY - dragStart.value.y;

  cardPositions.value[isDragging.value] = {
    x: newX,
    y: newY,
    isExiting: false,
  };
}

function endDrag() {
  if (!isDragging.value) return;

  if (dragMoved.value) {
    throwCard(isDragging.value);
  }

  isDragging.value = null;
  dragMoved.value = false;
}

function throwCard(cardId) {
  const pos = cardPositions.value[cardId] || { x: 0, y: 0 };

  if (pos.isExiting) {
    return;
  }

  let exitX = pos.x;
  let exitY = pos.y;

  if (Math.abs(pos.x) < 50 && Math.abs(pos.y) < 50) {
    const angle = Math.random() * Math.PI * 2;
    exitX = Math.cos(angle) * 1000;
    exitY = Math.sin(angle) * 1000;
  } else {
    const magnitude = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    exitX = (pos.x / magnitude) * 1500;
    exitY = (pos.y / magnitude) * 1500;
  }

  cardPositions.value[cardId] = {
    x: exitX,
    y: exitY,
    isExiting: true,
  };

  const collectedCard = cards.value.find((card) => card.id === cardId);
  console.log('Carte à collecter:', collectedCard);

  if (collectedCard) {
    collectedCards.value.push(collectedCard);
    console.log(
      "Cartes collectées jusqu'à maintenant:",
      collectedCards.value.length
    );
    emit('cardCollected', collectedCard);
  }

  setTimeout(() => {
    const index = cards.value.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      cards.value.splice(index, 1);
    }
  }, 500);
}

onMounted(() => {
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', endDrag);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
});
</script>

<style scoped>
@import '@/assets/css/stack.css';
</style>

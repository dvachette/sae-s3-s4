<template>
  <div
    class="relative"
    :style="{
      width: cardDimensions.width + 'px',
      height: cardDimensions.height + 'px',
      perspective: '600px',
    }"
  >
    <div
      v-for="(card, index) in cards"
      :key="card.id"
      class="absolute cursor-grab active:cursor-grabbing"
      :style="{
        left: '0px',
        top: '0px',
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
        class="rounded-2xl overflow-hidden border-4 border-white shadow-xl"
        :style="{
          width: cardDimensions.width + 'px',
          height: cardDimensions.height + 'px',
          boxShadow:
            isDragging === card.id
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
  randomRotation: {
    type: Boolean,
    default: false,
  },
  sensitivity: {
    type: Number,
    default: 50,
  },
  cardDimensions: {
    type: Object,
    default: () => ({ width: 208, height: 208 }),
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

const cards = ref(
  props.cardsData.length
    ? props.cardsData
    : [
        {
          id: 1,
          img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
        },
        {
          id: 2,
          img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
        },
        {
          id: 3,
          img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
        },
        {
          id: 4,
          img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
        },
      ]
);

const cardPositions = ref({});
const isDragging = ref(null);
const dragStart = ref({ x: 0, y: 0 });
const initialRotations = ref({});
const dragMoved = ref(false);

// Émettre un événement quand toutes les cartes sont parties
const emit = defineEmits(['allCardsGone']);

// Surveiller le nombre de cartes
watch(
  () => cards.value.length,
  (newLength) => {
    if (newLength === 0) {
      console.log('Toutes les cartes sont parties !');
      emit('allCardsGone');
    }
  }
);

// Initialiser les positions et rotations
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
  const rotation =
    (cards.value.length - index - 1) * 4 +
    (initialRotations.value[cardId] || 0);
  const scale =
    isDragging.value === cardId
      ? 1.05
      : 1 + index * 0.06 - cards.value.length * 0.06;

  // Effet 3D pendant le drag
  let rotateX = 0;
  let rotateY = 0;
  let finalRotation = rotation;

  if (isDragging.value === cardId) {
    rotateX = -pos.y / 10;
    rotateY = pos.x / 10;
  }

  // Si la carte sort de l'écran, ajouter de la rotation
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

  // Si on a bougé la carte, la faire sortir de l'écran
  if (dragMoved.value) {
    throwCard(isDragging.value);
  }

  isDragging.value = null;
  dragMoved.value = false;
}

function throwCard(cardId) {
  const pos = cardPositions.value[cardId] || { x: 0, y: 0 };

  // Déterminer la direction de sortie
  let exitX = pos.x;
  let exitY = pos.y;

  // Si la carte n'a pas été déplacée ou très peu, choisir une direction aléatoire
  if (Math.abs(pos.x) < 50 && Math.abs(pos.y) < 50) {
    const angle = Math.random() * Math.PI * 2;
    exitX = Math.cos(angle) * 1000;
    exitY = Math.sin(angle) * 1000;
  } else {
    // Amplifier le mouvement dans la direction actuelle
    const magnitude = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    exitX = (pos.x / magnitude) * 1500;
    exitY = (pos.y / magnitude) * 1500;
  }

  // Faire sortir la carte de l'écran
  cardPositions.value[cardId] = {
    x: exitX,
    y: exitY,
    isExiting: true,
  };

  // Retirer la carte de la pile après l'animation
  setTimeout(() => {
    const index = cards.value.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      cards.value.splice(index, 1);
    }
  }, 500);
}

// Ajouter les event listeners
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

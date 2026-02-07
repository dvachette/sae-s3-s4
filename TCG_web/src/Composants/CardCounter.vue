<script setup>
    import { ref, defineEmits, watch } from 'vue';
    
    const emit = defineEmits(['update:count']);
    const { value, cardId } = defineProps({
        value: {
            type: Number,
            required: true
        },
        cardId: {
            type: Number,
            required: true
        }
    });

    watch(
        () => value,
        (newVal) => {
            count.value = newVal;
        }
    );

    const count = ref(0);
    count.value = value;
    function updateCount(newCount) {
        if (newCount < 0) newCount = 0; // Empêcher les quantités négatives
        count.value = newCount;
        emit('update:count', newCount, cardId);
    }


</script>

<template>
    <div class="cardCounter">
        <button @click="updateCount(count - 10)">- 10</button>
        <button @click="updateCount(count - 1)">- 1</button>
        <span>{{ count }}</span>
        <button @click="updateCount(count + 1)">+ 1</button>
        <button @click="updateCount(count + 10)">+ 10</button>    
    </div>
</template>

<style scoped>
    .cardCounter {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .cardCounter button {
        padding: 5px 10px;
        font-size: 16px;
    }

    .cardCounter span {
        font-size: 18px;
        font-weight: bold;
    }
</style>
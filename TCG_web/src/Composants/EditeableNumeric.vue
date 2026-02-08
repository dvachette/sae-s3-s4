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
            required: false
        }
    });
    const onEdit = ref(false);

    watch(
        () => value,
        (newVal) => {
            count.value = newVal;
        }
    );

    const count = ref(0);
    count.value = value;
    function updateCount(newCount) {
        onEdit.value = false;
        if (newCount < 0) newCount = 0; // Empêcher les quantités négatives
        count.value = newCount;
        emit('update:count', newCount, cardId);
    }

    
    

</script>

<template>
    <div class="cardCounter">
        <button v-if="!onEdit" @click="updateCount(count - 10)">- 10</button>
        <button v-if="!onEdit" @click="updateCount(count - 1)">- 1</button>
        <span v-if="!onEdit" @click="onEdit = true">{{ count }}</span>
        <input v-else type="number" v-model.number="count" @blur="updateCount(count)" @keyup.enter="updateCount(count)" :size="5" />
        <button v-if="!onEdit" @click="updateCount(count + 1)">+ 1</button>
        <button v-if="!onEdit" @click="updateCount(count + 10)">+ 10</button>    
    </div>
</template>

<style scoped>
    .cardCounter {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .cardCounter button {
        padding: 5px 10px;
        font-size: 16px;
        margin:auto 0
    }


    span {
        display:inline-block;
        cursor: pointer;
        border: 1px solid #6E6E6E;
        border-radius: 5px;
        padding: 0 10px;
        text-align: center;
        height:100%;
        padding-top:5px;
        font-size: 1.3em;
        font-weight: bold;
    }
    input {
        font-size: 1.2em;
        text-align: center;
        border: 1px solid #6E6E6E;
        border-radius: 30px;
        padding: 5px 10px;
    }
</style>
<script setup>
    import { ref, watch } from 'vue';



    const props = defineProps({
        modelValue: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    });

    const emit = defineEmits(['validateEdit', 'startEdit', 'cancelEdit']);

    const onEdit = ref(false);
    const editedValue = ref(props.modelValue);
    /* sync parent -> local */
    watch(
    () => props.modelValue,
    (newVal) => {
        editedValue.value = newVal;
    }
    );
    function validate() {
        onEdit.value = false;
        emit('validateEdit', editedValue.value);
    }

    function startEditing() {
        onEdit.value = true;
        emit('startEdit');
    }

    function cancelEditing() {
        onEdit.value = false;
        editedValue.value = props.modelValue; // Revert to original value
        emit('cancelEdit');
    }


</script>

<template>
    <p class="editeableField">
        <strong>{{ label }}</strong>
        <span v-if="!onEdit" @click="startEditing">{{ editedValue }}</span>
        <input v-else type="text" v-model="editedValue" :size="editedValue.length || 1"/>
        <button v-if="!onEdit" @click="startEditing"><img src="@/assets/imgs/Petit_crayon.png"></button>
        <button v-if="onEdit" @click="validate"><img src="@/assets/imgs/check_dark.png"></button>
        <button v-if="onEdit" @click="cancelEditing"><img src="@/assets/imgs/croix_dark.png"></button>
    </p>
    
    
</template>

<style scoped>
    button > img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: center;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
    }
    button {
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        border-radius: 0;
        border-left: 1px solid black;
        background-color: #e9e9ed;
        margin-bottom: 0;
    }
    button:last-child {
        border-radius: 0 20px 20px 0;
        width:50px
    }
    strong {
        margin-right: 10px;
        height:40px;
        line-height: 40px;
        font-size:1.3em;
        background-color: #e9e9ed;
        margin:0;
        padding:0 1em;
        border-radius: 20px 0 0 20px;
        border-right: 1px solid black;
        flex:1

    }
    span, input[type="text"] {
        cursor: pointer;
        height:40px;
        line-height: 40px;
        font-size:1.3em;
        background-color: #e9e9ed;
        margin:0;
        padding:0 1em;
        font-family:'Courier New', Courier, monospace;
    }
    p.editeableField {
        display: flex;
        align-items: center;
        margin: 0;
        width:100%;
        margin: 1em 0;
    }

    input[type="text"] {
        height: 40px;
        border:none;
        border-radius: 0;
        cursor: text;
    }
</style>
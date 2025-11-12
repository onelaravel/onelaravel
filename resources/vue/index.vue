<template>
    <div id="test">
    {{message}}
    </div>
    <div v-for="item of items">
        <p v-if="item.isActive === true" key={{ item.id }} @click="clickitem">{{ item.name }}</p>
    </div>
</template>
<script setup>
export default {
    data(){
        return {
            id: "1"
        }
    }
}
</script>
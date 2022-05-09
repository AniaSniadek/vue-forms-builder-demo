<script setup>
import { FormBuilder, Validators } from 'vue-forms-builder';

const control = FormBuilder.control(null, Validators.required);
</script>

<template>
  <input type="text" v-model="control.value" />
  {{ control.value }}
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <v-app-bar app :dark="dark" :color="color">
    <slot name="header-content"></slot>
  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  props: ["color", "dark"]
};
</script>

<style></style>

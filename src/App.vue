<template>
  <div v-if="loading"></div>
  <s-note v-else-if="currentNoteType === noteTypes.Shopping"></s-note>
  <m-note v-else></m-note>
</template>

<script>
import { mapGetters } from "vuex";
import { NoteTypes } from "./util/const";
export default {
  data() {
    return {
      loading: true,
      noteTypes: NoteTypes
    };
  },
  created() {
    this.loading = false;
  },
  computed: {
    ...mapGetters(["currentNoteType"])
  }
};
</script>

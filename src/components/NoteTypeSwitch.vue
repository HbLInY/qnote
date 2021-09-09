<template>
  <v-dialog persistent v-model="shown" max-width="300px">
    <template #activator="{ on }">
      <v-btn v-on="on" icon>
        <v-icon>mdi-format-list-bulleted-type</v-icon>
      </v-btn>
    </template>
    <v-card flat>
      <v-toolbar color="deep-purple" dark>
        <v-toolbar-title>
          切换笔记类型
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="shown = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-list>
          <v-subheader>笔记类型</v-subheader>
          <template v-for="(typeName, index) in names">
            <v-list-item :key="index" @click="changeNoteType(index)">
              <v-list-item-title>{{ typeName }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { NoteTypeNames } from "../util/const";
export default {
  data() {
    return {
      shown: false,
      names: NoteTypeNames
    };
  },
  methods: {
    ...mapActions(["setNoteType"]),
    changeNoteType(typeIndex) {
      this.typeIndex = this.setNoteType(typeIndex);
    }
  }
};
</script>

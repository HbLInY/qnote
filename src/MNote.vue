<template>
  <v-app id="app">
    <qnote-header color="deep-purple" dark>
      <template #header-content>
        <v-toolbar-title>
          <template v-if="tab === tabSelections.List">
            笔记一览
          </template>
          <template v-else-if="tab === tabSelections.Edit">
            编辑笔记
          </template>
          <template v-else-if="tab === tabSelections.Process">
            笔记详细
          </template>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <note-type-switch></note-type-switch>
        <template v-if="tab === tabSelections.Edit">
          <v-dialog max-width="300" persistent v-model="configDialogShown">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="openConfigDialog">
                <v-icon>mdi-cog</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar color="deep-purple" dark>
                <v-toolbar-title>
                  设置
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="closeConfigDialog" icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-container fluid v-if="tempMark !== null">
                <v-row>
                  <v-col>
                    <v-text-field label="设置分隔符" v-model="tempMark">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="success" @click="saveConfig">save</v-btn>
                <v-btn text color="secondary" @click="closeConfigDialog">
                  cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </template>
    </qnote-header>
    <qnote-content>
      <template #content>
        <template v-if="tab === tabSelections.List">
          <v-data-table
            v-if="!!memoList"
            :items="memoList.memos"
            :headers="headers"
            hide-default-footer
          >
            <template v-slot:item.action="{ item }">
              <v-btn small color="success" @click="processMemo(item)">
                开始
              </v-btn>
              <v-btn class="ml-2" small color="primary" @click="editMemo(item)">
                编辑
              </v-btn>
              <v-btn
                class="ml-2"
                small
                color="error"
                @click="confirmDeleteMemo(item)"
              >
                删除
              </v-btn>
            </template>
          </v-data-table>
        </template>
        <template v-if="tab === tabSelections.Edit">
          <v-container fluid v-if="!!editingMemo">
            <v-row>
              <v-col>
                <v-textarea v-model="editingMemo.text" auto-grow rows="1">
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-if="tab === tabSelections.Process && processingMemo">
          <v-container fluid class="mt-1">
            <v-row class="py-2 px-1">
              <template v-for="(ct, index) in notSelectedContent">
                <v-chip
                  color="success"
                  large
                  :key="index"
                  @click="selectPart(ct)"
                  class="mr-1 mb-1"
                >
                  {{ ct.text }}
                </v-chip>
              </template>
            </v-row>
          </v-container>
          <template v-if="selectedContent.length > 0">
            <v-divider></v-divider>
            <v-container fluid>
              <v-row class="py-2 px-1">
                <template v-for="(ct, index) in selectedContent">
                  <v-chip
                    color="grey"
                    large
                    :key="index"
                    @click="selectPart(ct)"
                    class="mr-1 mb-1"
                  >
                    {{ ct.text }}
                  </v-chip>
                </template>
              </v-row>
            </v-container>
          </template>
        </template>
      </template>
    </qnote-content>
    <qnote-footer>
      <template #footer-content>
        <template v-if="tab === tabSelections.List">
          <v-spacer></v-spacer>
          <v-btn fab color="success" @click="goToAddMemo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </template>
        <template v-else-if="tab === tabSelections.Edit">
          <v-dialog v-model="backToListConfirmModalShown">
            <template v-slot:activator="{ on }">
              <v-btn fab color="warning" v-on="on">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <v-card max-width="500">
              <v-card-title>是否放弃当前编辑的内容并返回？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="success" @click="backToList">返回</v-btn>
                <v-btn
                  text
                  color="secondary"
                  @click="backToListConfirmModalShown = false"
                >
                  取消
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-dialog v-model="memoSaveModalShown">
            <template v-slot:activator="{ on }">
              <v-btn fab color="success" v-on="on">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <v-card max-width="500">
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="输入名称" v-model="tempName">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!tempName || tempName.length <= 0"
                  text
                  color="success"
                  @click="saveEditing"
                >
                  保存
                </v-btn>
                <v-btn
                  text
                  color="secondary"
                  @click="memoSaveModalShown = false"
                >
                  取消
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-if="tab === tabSelections.Process">
          <v-spacer></v-spacer>
          <v-btn fab color="warning" @click="returnToList">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </template>
      </template>
    </qnote-footer>
    <v-dialog v-model="memoDeleteConfirmModalShown" persistent>
      <v-card max-width="500">
        <v-card-title>是否删除？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="removeMemo">删除</v-btn>
          <v-btn text color="secondary" @click="closeMemoDeleteConfirmModal">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { LocalStorageKeys } from "./util/const";
import LocalStorageManager from "./util/local-storage-manager";
import Memo from "./models/memo";
import MemoList from "./models/memoList";

export default {
  data() {
    const Selections = {
      List: 1,
      Edit: 2,
      Process: 3
    };
    return {
      tab: Selections.List,
      tabSelections: Object.freeze(Selections),
      tempMark: null,
      tempName: "",
      backToListConfirmModalShown: false,
      configDialogShown: false,
      editingMemo: null,
      memoList: null,
      memoSaveModalShown: false,
      headers: [
        { text: "名称", value: "name", sortable: false },
        { text: "操作", value: "action", sortable: false }
      ],
      processingMemo: null,
      memoDeleteConfirmModalShown: false,
      memoToDelete: null
    };
  },
  created() {
    this.memoList = MemoList.restore();
    console.log(this.memoList);
    const currentEditingMemo = LocalStorageManager.getItem(
      LocalStorageKeys.CurrentEditingMemo
    );
    const processingMemoId = LocalStorageManager.getItem(
      LocalStorageKeys.ProcessingMemoId
    );
    if (currentEditingMemo) {
      const memoData = JSON.parse(currentEditingMemo);
      this.editingMemo = Memo.fromData(memoData);
      this.editingMemo.enableAutoSave();
      this.tab = this.tabSelections.Edit;
    } else if (processingMemoId) {
      const processingMemo = this.memoList.findById(processingMemoId);
      if (processingMemo) {
        this.processingMemo = processingMemo;
        this.tab = this.tabSelections.Process;
      }
    }
  },
  computed: {
    notSelectedContent() {
      if (this.processingMemo) {
        return this.processingMemo.content.filter(c => !c.selected);
      }
      return [];
    },
    selectedContent() {
      if (this.processingMemo) {
        return this.processingMemo.content.filter(c => c.selected);
      }
      return [];
    }
  },
  methods: {
    goToAddMemo() {
      this.tab = this.tabSelections.Edit;
      this.editingMemo = new Memo();
      this.tempName = this.editingMemo.name;
      this.tempMark = this.editingMemo.separateMark;
      this.editingMemo.enableAutoSave();
    },
    backToList() {
      this.backToListConfirmModalShown = false;
      this.memoSaveModalShown = false;
      LocalStorageManager.removeItem(LocalStorageKeys.CurrentEditingMemo);
      this.tab = this.tabSelections.List;
    },
    openConfigDialog() {
      this.configDialogShown = true;
      this.tempMark = this.editingMemo.separateMark;
    },
    saveConfig() {
      if (this.tempMark) {
        this.editingMemo.separateMark = this.tempMark;
      }
      this.closeConfigDialog();
    },
    closeConfigDialog() {
      this.configDialogShown = false;
      this.tempMark = null;
    },
    saveEditing() {
      if (this.memoList) {
        this.editingMemo.name = this.tempName;
        this.tempName = "";
        this.editingMemo.disableAutoSave();
        this.memoList.createOrUpdate(this.editingMemo);
      }
      this.backToList();
    },
    processMemo(memo) {
      this.processingMemo = memo;
      LocalStorageManager.setItem(LocalStorageKeys.ProcessingMemoId, memo.id);
      this.tab = this.tabSelections.Process;
    },
    editMemo(memo) {
      this.editingMemo = Memo.fromData(memo.toData());
      this.editingMemo.enableAutoSave();
      this.tempName = this.editingMemo.name;
      this.tempMark = this.editingMemo.separateMark;
      this.tab = this.tabSelections.Edit;
    },
    confirmDeleteMemo(memo) {
      this.memoToDelete = memo;
      this.memoDeleteConfirmModalShown = true;
    },
    closeMemoDeleteConfirmModal() {
      this.memoToDelete = null;
      this.memoDeleteConfirmModalShown = false;
    },
    removeMemo() {
      if (this.memoToDelete) {
        this.memoList.remove(this.memoToDelete);
      }

      this.closeMemoDeleteConfirmModal();
    },
    returnToList() {
      LocalStorageManager.removeItem(LocalStorageKeys.ProcessingMemoId);
      this.processingMemo = null;
      this.tab = this.tabSelections.List;
    },
    selectPart(ct) {
      ct.selected = !ct.selected;

      this.memoList.save();
    }
  }
};
</script>

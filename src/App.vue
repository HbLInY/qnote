<template>
  <v-app id="app">
    <qnote-header color="deep-purple" dark>
      <template #header-content>
        <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          fab
          v-if="tab === tabSelections.First"
          @click="jumpTo(tabSelections.Zero)"
        >
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn
          icon
          fab
          v-else-if="tab === tabSelections.Zero"
          @click="jumpTo(tabSelections.First)"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </template>
    </qnote-header>
    <qnote-content>
      <template #content>
        <v-container fluid class="pa-0">
          <v-card flat>
            <v-tabs-items v-model="tab">
              <v-tab-item :value="tabSelections.Zero">
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="(history, index) in histories"
                    :key="index"
                  >
                    <v-expansion-panel-header @click="selectHistory(history)">
                      {{ history.time }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-card flat>
                        <v-card-actions class="pt-0">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="error"
                            small
                            @click="deleteHistory(index)"
                          >
                            删除
                          </v-btn>
                        </v-card-actions>
                        <v-sheet elevation="10" rounded="xl">
                          <div class="pa-4">
                            <v-chip
                              v-for="item in history.items"
                              :key="item.id"
                              color="primary"
                              class="mr-2 my-2"
                            >
                              {{ item.name }}
                              <v-divider vertical class="mx-2"></v-divider>
                              {{ item.expect }}
                            </v-chip>
                          </div>
                        </v-sheet>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-dialog v-model="historyDeleteConfirm" persistent>
                  <v-card flat>
                    <v-card-title>
                      确认删除？
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="secondary"
                        @click="cancelDeleteHistory"
                      >
                        取消
                      </v-btn>
                      <v-btn text color="error" @click="doDeleteHistory">
                        删除
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-tab-item>
              <v-tab-item :value="tabSelections.First">
                <v-container fluid>
                  <v-row>
                    <template v-for="item in currentTemplate.items">
                      <v-card :key="item.id" class="ml-2 mb-2" min-width="100">
                        <v-card-text @click="selectItem(item)" class="pb-1">
                          {{ item.expect }}: {{ item.name }}
                        </v-card-text>
                        <v-card-actions class="pt-1">
                          <v-btn icon x-small @click.stop="editItem(item)">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-icon
                            color="success"
                            x-small
                            v-if="planItems.some(i => i.id === item.id)"
                          >
                            mdi-check
                          </v-icon>
                          <v-spacer></v-spacer>
                          <v-btn icon x-small @click.stop="deleteItem(item)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-row>
                </v-container>
              </v-tab-item>
              <v-tab-item :value="tabSelections.Second">
                <v-container fluid>
                  <v-row dense>
                    <v-card flat>
                      <v-card-title>
                        未购（{{ notYetItems.length }}）
                      </v-card-title>
                    </v-card>
                  </v-row>
                  <v-row>
                    <template v-for="item in notYetItems">
                      <v-card :key="item.id" min-width="100" class="ml-2 mb-2">
                        <v-card-text class="pb-1">
                          {{ item.expect }}: {{ item.name }}
                        </v-card-text>
                        <v-card-actions class="pt-1">
                          <v-spacer></v-spacer>
                          <v-btn small color="success" @click="purchase(item)">
                            已购
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-row>
                </v-container>
                <hr v-if="alreadyItems.length > 0" />
                <v-container fluid v-if="alreadyItems.length > 0">
                  <v-row dense>
                    <v-card flat>
                      <v-card-title>
                        已购（{{ alreadyItems.length }}）
                      </v-card-title>
                    </v-card>
                  </v-row>
                  <v-row>
                    <template v-for="item in alreadyItems">
                      <v-card min-width="100" :key="item.id" class="ml-2 mb-2">
                        <v-card-text class="pb-1">
                          {{ item.expect }}:{{ item.name }}
                        </v-card-text>
                        <v-card-actions class="pt-1">
                          <v-spacer></v-spacer>
                          <v-btn small color="error" @click="cancel(item)">
                            取消
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-row>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-container>
      </template>
    </qnote-content>
    <qnote-footer>
      <template #footer-content>
        <template v-if="tab === tabSelections.First">
          <v-container fluid class="py-0">
            <v-row dense justify="center">
              <v-col cols="6">
                <v-btn
                  @click="selectAll"
                  small
                  block
                  :color="
                    currentTemplate.items.length === planItems.length
                      ? 'warning'
                      : 'primary'
                  "
                >
                  {{
                    currentTemplate.items.length === planItems.length
                      ? "反选"
                      : "全选"
                  }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="9">
                <v-text-field
                  label="名称"
                  v-model="editedItem.name"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="数量"
                  type="number"
                  v-model.number="editedItem.expect"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-between" dense>
              <v-col cols="3">
                <v-btn
                  color="deep-purple"
                  dark
                  block
                  @click="openTemplateManagementDialog"
                >
                  模板
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-dialog v-model="confirmStartDialog">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="primary"
                      dark
                      block
                      :disabled="planItems.length <= 0"
                      v-on="on"
                    >
                      开始
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>是否开始？</v-card-title>
                    <v-sheet>
                      <div class="pa-4">
                        <v-chip
                          color="primary"
                          v-for="item in planItems"
                          :key="item.id"
                          class="mr-2 my-2"
                        >
                          {{ item.name }}
                          <v-divider vertical class="mx-2"></v-divider>
                          {{ item.expect }}
                        </v-chip>
                      </div>
                    </v-sheet>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="start" color="error">
                        开始
                      </v-btn>
                      <v-btn text @click="confirmStartDialog = false">
                        取消
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col cols="3">
                <v-btn
                  color="success"
                  dark
                  block
                  @click="saveItem"
                  :disabled="
                    editedItem.name.length <= 0 || editedItem.expect <= 0
                  "
                >
                  {{ editedItem.id ? "修改" : "添加" }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-if="tab === tabSelections.Second">
          <v-row justify="space-between">
            <v-col cols="4">
              <v-dialog v-model="confirmBackDialog">
                <template v-slot:activator="{ on }">
                  <v-btn dark block v-on="on" color="deep-purple">
                    返回
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>是否返回？</v-card-title>
                  <v-card-text>当前购入状态将会被重置</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="back" color="error">
                      返回
                    </v-btn>
                    <v-btn text @click="confirmBackDialog = false">取消</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="4">
              <v-dialog v-model="confirmEndDialog">
                <template v-slot:activator="{ on }">
                  <v-btn dark block color="success" v-on="on">
                    结束
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>是否结束？</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="saveHistoryAndReturn" color="error">
                      结束
                    </v-btn>
                    <v-btn text @click="confirmEndDialog = false">取消</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </template>
      </template>
    </qnote-footer>
    <v-dialog v-model="templatesDialog" persistent>
      <v-card flat>
        <v-toolbar color="deep-purple" dark>
          <v-toolbar-title>模板管理</v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
          <v-tabs v-model="templateTab" grow>
            <v-tab :value="templateTabSelections.Add">
              添加为模板
            </v-tab>
            <v-tab :value="templateTabSelections.Select">
              选择现有模板
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="templateTab">
            <v-tab-item :value="templateTabSelections.Add">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="模板名称"
                    :error-messages="duplicatedTemplateName"
                    v-model="currentTemplate.name"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="success"
                  @click="saveTemplate"
                  :disabled="currentTemplate.name <= 0"
                >
                  保存
                </v-btn>
                <v-btn text @click="closeTempplateManagementDialog">
                  关闭
                </v-btn>
              </v-card-actions>
            </v-tab-item>
            <v-tab-item :value="templateTabSelections.Select">
              <v-list>
                <template v-for="(t, index) in templates">
                  <v-list-group
                    :key="index"
                    @click="selectTemplate(t)"
                    :prepend-icon="
                      selectedTemplate && selectedTemplate.name === t.name
                        ? 'mdi-check'
                        : ''
                    "
                  >
                    <template v-slot:activator>
                      <v-list-item-title>
                        {{ t.name }}
                      </v-list-item-title>
                    </template>
                    <template v-for="item in t.items">
                      <v-list-item :key="item.id">
                        <v-list-item-title>
                          {{ item.name }}: {{ item.expect }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-list-group>
                </template>
              </v-list>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="success"
                  :disabled="!selectedTemplate"
                  @click="useTemplate"
                >
                  使用
                </v-btn>
                <v-btn
                  text
                  color="error"
                  :disabled="!selectedTemplate"
                  @click="deleteTemplate"
                >
                  删除
                </v-btn>
                <v-btn text @click="closeTempplateManagementDialog">
                  关闭
                </v-btn>
              </v-card-actions>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Item from "./models/item";
import { ItemStates } from "./util/const";
import History from "./models/history";

export default {
  name: "App",
  data() {
    return {
      tabSelections: {
        Zero: 0,
        First: 1,
        Second: 2
      },
      tab: 1,
      editedItem: new Item("", 1),
      templatesDialog: false,
      templateTabSelections: {
        Add: 0,
        Select: 1
      },
      templateTab: 0,
      selectedTemplate: null,
      planItems: [],

      confirmBackDialog: false,
      confirmEndDialog: false,
      confirmStartDialog: false,
      historyDeleteConfirm: false,

      histories: [],
      selectedHistory: null,
      selectedToDeleteHistoryIndex: null
    };
  },
  created() {
    try {
      const processingData = localStorage.getItem("processing");
      if (processingData) {
        this.planItems = JSON.parse(processingData).map(
          Item.fromProcessingData
        );
        this.tab = this.tabSelections.Second;
      }
      const historiesData = localStorage.getItem("histories");
      this.histories = JSON.parse(historiesData).map(History.fromData);
    } catch (e) {
      console.log("LocalStorage not available.");
    }
  },
  computed: {
    ...mapGetters(["items", "templates", "currentTemplate"]),
    appTitle() {
      switch (this.tab) {
        case this.tabSelections.First:
          return "预购列表";
        case this.tabSelections.Second:
          return "购物中";
        case this.tabSelections.Zero:
          return "购物记录";
        default:
          return null;
      }
    },
    duplicatedTemplateName() {
      if (this.templates.some(t => t.name === this.currentTemplate.name)) {
        return "既存模板，保存将覆盖";
      }
      return null;
    },
    notYetItems() {
      return this.planItems.filter(i => i.state === ItemStates.NotYet);
    },
    alreadyItems() {
      return this.planItems.filter(i => i.state === ItemStates.Already);
    }
  },
  methods: {
    ...mapActions(["loadTemplates", "saveCurrentTemplate", "removeTemplate"]),
    openTemplateManagementDialog() {
      this.templatesDialog = true;
    },
    closeTempplateManagementDialog() {
      this.templatesDialog = false;
    },
    editItem(item) {
      this.editedItem = item.clone();
    },
    saveItem() {
      if (!(this.editedItem.name.length > 0 && this.editedItem.expect > 0)) {
        return;
      }
      if (!this.editedItem.id) {
        this.editedItem.generateId();
        this.currentTemplate.appendItem(this.editedItem);
        this.currentTemplate.saveCurrent();
      } else {
        this.currentTemplate.updateItem(this.editedItem);
        this.currentTemplate.saveCurrent();
      }
      this.editedItem = new Item("", 1);
    },
    deleteItem(item) {
      console.log(item);
      if (item) {
        this.currentTemplate.removeItem(item);
        this.currentTemplate.saveCurrent();
      }
    },
    selectItem(item) {
      if (this.planItems.some(i => i.id === item.id)) {
        this.planItems = this.planItems.filter(i => i.id !== item.id);
      } else {
        this.planItems.push(item.clone());
      }
    },
    selectAll() {
      if (this.planItems.length !== this.currentTemplate.items.length) {
        this.currentTemplate.items.forEach(i => {
          if (!this.planItems.some(pi => pi.id === i.id)) {
            this.planItems.push(i.clone());
          }
        });
      } else {
        this.planItems = [];
      }
    },
    saveTemplate() {
      this.saveCurrentTemplate();
      this.closeTempplateManagementDialog();
    },
    selectTemplate(template) {
      if (
        this.selectedTemplate &&
        this.selectedTemplate.name === template.name
      ) {
        this.selectedTemplate = null;
        return;
      }
      this.selectedTemplate = template;
    },
    useTemplate() {
      if (!this.selectedTemplate) {
        return;
      }
      this.currentTemplate.update(this.selectedTemplate);
      this.currentTemplate.saveCurrent();
      this.closeTempplateManagementDialog();
    },
    deleteTemplate() {
      if (this.selectedTemplate) {
        this.removeTemplate(this.selectedTemplate);
        this.selectedTemplate = null;
      }
    },
    start() {
      this.confirmStartDialog = false;
      this.saveProcessing();
      this.tab = this.tabSelections.Second;
    },
    purchase(item) {
      item.purchase();
      this.saveProcessing();
    },
    cancel(item) {
      item.cancel();
      this.saveProcessing();
    },
    saveProcessing() {
      const processingData = this.planItems.map(i => i.toProcessingData());
      try {
        localStorage.setItem("processing", JSON.stringify(processingData));
      } catch (e) {
        console.log("LocalStorage not available.");
      }
    },
    back() {
      this.confirmBackDialog = false;
      this.resetPlanItems();
      this.jumpTo(this.tabSelections.First);
    },
    jumpTo(target) {
      switch (target) {
        case this.tabSelections.First:
          break;
        case this.tabSelections.Second:
          break;
        default:
      }
      this.tab = target;
    },
    resetPlanItems() {
      this.planItems = [];
      try {
        localStorage.removeItem("processing");
      } catch (e) {
        console.log("LocalStorage not available.");
      }
    },
    saveHistoryAndReturn() {
      const items = this.planItems.map(i => i.clone());
      this.histories.unshift(new History(items));
      this.histories.splice(50);
      try {
        const historiesData = this.histories.map(h => h.toData());
        localStorage.setItem("histories", JSON.stringify(historiesData));
      } catch (e) {
        console.log("LocalStorage not available.");
      }
      this.resetPlanItems();
      this.confirmEndDialog = false;
      this.jumpTo(this.tabSelections.Zero);
    },
    selectHistory(history) {
      console.log(history);
      if (history === this.selectedHistory) {
        this.selectedHistory = null;
        return;
      }
      this.selectedHistory = history;
    },
    deleteHistory(historyIndex) {
      this.selectedToDeleteHistoryIndex = historyIndex;
      this.historyDeleteConfirm = true;
    },
    cancelDeleteHistory() {
      this.selectedToDeleteHistoryIndex = null;
      this.historyDeleteConfirm = false;
    },
    doDeleteHistory() {
      this.histories.splice(this.selectedToDeleteHistoryIndex, 1);
      try {
        const historiesData = this.histories.map(h => h.toData());
        localStorage.setItem("histories", JSON.stringify(historiesData));
      } catch (e) {
        console.log("LocalStorage not available.");
      }
      this.selectedHistory = null;
      this.cancelDeleteHistory();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadTemplates();
    });
  }
};
</script>

<style></style>

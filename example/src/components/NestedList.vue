<template lang="html">
  <dd-draggable class="panel__body--item"
    :draggable="item"
    :index="index"
    :disable-if="disable"
    :selected="selectedEvent"
    :wrapper="list"
    v-bind:class="{'selected': selectedItem === item}">
    <div class="panel padding" v-if="item.type === 'container'">
      <div class="panel__heading">
        <h3>Container {{item.id}}</h3>
      </div>
      <dd-list class="panel__body"
        :list="item.columns"
        :disable-if="disable"
        :external-sources="true">
        <NestedList v-for="(col, number) in item.columns"
          :key="col.id" :item="col"
          :list="item.columns"
          :index="number"
          :selected="selectedEvent"
          :selected-item="selectedItem"
          :disable="disable">
        </NestedList>
      </dd-list>
    </div>
    <p v-else>
      {{item.type}} {{item.id}}
    </p>
  </dd-draggable>
</template>

<script>
import ddList from '../../../src/components/dd-list.vue';
import ddDraggable from '../../../src/components/dd-draggable.vue';

export default {
  name: 'NestedList',
  props: ['item', 'list', 'index', 'selected', 'selectedItem', 'disable'],
  methods: {
    selectedEvent(item){
      if (typeof(this.selected) === 'function') {
        this.selected(item);
      }
    }
  },
  components: {
    ddList,
    ddDraggable,
  }
};
</script>

<style lang="css">
</style>

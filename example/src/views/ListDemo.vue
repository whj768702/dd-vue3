<script lang="ts" setup>
type Container = {
  id: number;
  container: Array<{id:number;list: Array<Item>}>;
}
type Item = {
  id: number;
  label: string;
}

let lists:Array<Container> = [];
let cid = 1, lid = 1, iid = 1;
for(let i = 0; i < 3; i++) {
  lists.push({
    id: cid++,
    container: []
  });
  for(let j = 0; j < 2; j++) {
    lists[i].container.push({
      id: lid++,
      list: []
    });
    for(let k = 0; k < 7; k++) {
      lists[i].container[j].list.push({
        "label": "Item " + iid++,
        "id": iid
      });
    }
  }
}

</script>

<template>
  <div>
    here is hello msg
    <div>
      <ddList tag="div" :list="lists[0].container" :horizontal="true" :allowed-types="['itemType']"
               :external-sources="true">
        <vddl-draggable v-for="(item, number) in lists[0].container.list" :key="item.id" class="panel__body--item horizontal-item"
                        :draggable="item"
                        :type="'itemType'"
                        effect-allowed="copyMove"
                        :index="number"
                        :wrapper="container.list">
          {{item.label}}
        </vddl-draggable >
      </ddList>
    </div>
  </div>
</template>

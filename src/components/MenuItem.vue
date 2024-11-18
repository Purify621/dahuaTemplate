<template>
    <template v-if="hasChildren">
        <el-sub-menu :index="item.id" v-bind="$attrs">
            <template #title>
                <el-icon>
                    <Location />
                </el-icon>
                <span style="padding-right: 10px;">{{ item.name }}</span>
                <span>({{ childrenCount }}/{{ childrenCount }})</span>
            </template>
            <template v-for="child in item.children" :key="child.id">
                <MenuItem :item="child" @item-click="$emit('item-click', $event)" />
            </template>
        </el-sub-menu>
    </template>
    <template v-else>
        <el-menu-item :index="item.id" @click="handleClick(item)">
            <el-icon>
                <VideoCamera />
            </el-icon>
            <span>{{ item.name }}</span>
        </el-menu-item>
    </template>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "MenuItem",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    computed: {
        hasChildren() {
            return Array.isArray(this.item.children) && this.item.children.length > 0;
        },
        childrenCount() {
            // 递归计算当前层级所有子节点的数量
            return this.item.children
                ? this.item.children.reduce(
                    (count, child) => count + 1 + (child.children ? this.countDescendants(child.children) : 0),
                    0
                )
                : 0;
        },
    },
    methods: {
        countDescendants(children) {
            return children.reduce(
                (count, child) => count + 1 + (child.children ? this.countDescendants(child.children) : 0),
                0
            );
        },
        handleClick(item) {
            // 触发 item-click 事件，向上传递当前 item 数据
            console.log(item);
            this.$emit("item-click", this.item);
        },
    },
});
</script>
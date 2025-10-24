# SVG 图标组件

这个文件夹包含了项目中使用的所有 SVG 图标组件。

## 图标列表

### 文件类型图标

- `IconWord.vue` - Word 文档图标（蓝色）

### 操作图标

- `IconTrash.vue` - 删除/垃圾桶图标
- `IconClose.vue` - 关闭/叉号图标
- `IconSend.vue` - 发送/箭头图标

## 使用方法

```vue
<script setup>
import IconWord from '@/components/icons/IconWord.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
</script>

<template>
  <IconWord />
  <IconTrash />
</template>
```

## 样式自定义

大部分图标使用 `currentColor`，可以通过父元素的 `color` 属性来改变颜色：

```vue
<div style="color: #ff0000">
  <IconTrash /> <!-- 将显示为红色 -->
</div>
```

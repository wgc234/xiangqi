<template>
  <div id="app-container">
    <XiangqiGame />
  </div>
</template>

<script setup>
// 1. 确保你从正确的位置导入了你的象棋游戏组件
import XiangqiGame from './components/XiangqiGame.vue'; 
// 注意：请根据你的文件实际存放位置修改路径。
// 如果 XiangqiGame.vue 就放在 src/components/ 目录下，这个路径就是对的。
</script>

<style>
/* 你可以保留或清空这里的全局样式 */
#app-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 改为 flex-start 以便从顶部开始 */
  min-height: 100vh;
  padding-top: 20px; /* 增加一些顶部间距 */
  background-color: #f0f0f0;
}
body {
  /* 
    使用 /img/image.png 路径。
    在 Vite 中，public 目录或 src/assets 目录下的资源会被特殊处理。
    如果你的 img 文件夹在项目根目录（与 src 同级），
    Vite 会自动把它当作静态资源处理，路径通常是相对于根目录。
    我们假设 img 文件夹在 public 目录下，或者 Vite 能直接访问到它。
  */
  background-image: url('/img/image.png');
  
  /* 让背景图覆盖整个页面 */
  background-size: cover;
  
  /* 背景图不重复 */
  background-repeat: no-repeat;
  
  /* 背景图固定，滚动页面时不移动 */
  background-attachment: fixed;
  
  /* 背景图居中显示 */
  background-position: center center;

  /* 你可以保留或修改你之前的 body 样式 */
  margin: 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  font-family: sans-serif; /* 添加一个通用字体 */
}
</style>
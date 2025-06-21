# 中国象棋游戏 - Vue 3版本

这是一个使用Vue 3 (Composition API) 和 Vite 构建的中国象棋游戏。

## 项目结构

```
xiangqi-game/
├── src/
│   ├── components/
│   │   └── XiangqiGame.vue    # 象棋游戏主组件
│   ├── App.vue                # 根组件
│   ├── main.js                # 应用入口
│   └── style.css              # 全局样式
├── index.html                 # HTML入口文件
├── package.json               # 项目配置
├── vite.config.js             # Vite配置
└── README.md                  # 项目说明
```

## 功能特性

- 🎮 完整的中国象棋棋盘布局
- 🎨 精美的视觉设计，包含楚河汉界和九宫格斜线
- ♟️ 32个棋子的精确定位
- 🎯 响应式数据管理
- 🖱️ 棋子悬停效果

## 技术栈

- **Vue 3** - 使用Composition API
- **Vite** - 快速构建工具
- **CSS3** - 现代样式和动画

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 预览生产版本：
```bash
npm run preview
```

## 开发说明

### 组件结构

- `XiangqiGame.vue` - 主要的象棋游戏组件
  - 使用响应式数据管理棋子位置
  - 动态计算棋子样式确保精确定位
  - 包含完整的棋盘视觉效果

### 数据模型

棋子数据结构：
```javascript
{
  char: '車',      // 棋子字符
  color: 'black',  // 棋子颜色 (red/black)
  x: 0,           // X坐标 (0-8)
  y: 0            // Y坐标 (0-9)
}
```

### 样式系统

- 使用CSS Grid和绝对定位实现棋盘布局
- 响应式设计适配不同屏幕尺寸
- 精美的视觉效果和交互动画

## 后续开发计划

- [ ] 棋子移动功能
- [ ] 游戏规则验证
- [ ] 悔棋功能
- [ ] 游戏历史记录
- [ ] 音效和动画
- [ ] 多人对战模式
 
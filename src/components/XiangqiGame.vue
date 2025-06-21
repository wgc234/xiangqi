<template>
  <div id="game-container">
    <h1>中国象棋</h1>
    <div class="game-info">
      <div v-if="gameStatus === 'playing'">
        当前回合: 
        <span :class="['player-turn', currentPlayer]">{{ currentPlayer === 'red' ? '红方' : '黑方' }}</span>
      </div>
      <div v-if="gameStatus.includes('wins')" class="game-over">
        {{ gameStatus === 'red_wins' ? '红方胜利！' : '黑方胜利！' }}
      </div>
    </div>
    <div id="board-wrapper">
      <div id="board">
        <div class="river">楚 河   漢 界</div>
        <div class="palace" style="left: 180px; top: 0px;"></div>
        <div class="palace" style="left: 180px; top: 420px;"></div>
        <div
          v-for="move in validMoves"
          :key="`move-${move.x}-${move.y}`"
          class="valid-move"
          :class="{ capture: move.isCapture }"
          :style="getMoveStyle(move)"
          @click="executeMove(move)"
        ></div>
        <div
          v-for="(piece, index) in pieces"
          :key="piece.id"
          class="piece"
          :class="[piece.color, { selected: index === selectedPieceIndex }]"
          :style="getPieceStyle(piece)"
          @click="handlePieceClick(index)"
        >
          {{ piece.char }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';


const bgm = new Audio('/mp3/M500000S6mXr3UR0Dl.mp3'); // 替换成你完整的音频文件名！
bgm.loop = true; // 设置为循环播放
bgm.volume = 0.3; // 设置一个合适的初始音量（0.0 到 1.0）

// 使用 onMounted 生命周期钩子，在组件挂载到页面后执行
onMounted(() => {
  console.log("组件已挂载，尝试播放背景音乐...");
  // 现代浏览器通常需要用户与页面进行一次交互后才能自动播放音频。
  // 我们尝试播放，如果失败，则引导用户点击来播放。
  const playPromise = bgm.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      // 自动播放失败，这是预料之中的
      console.warn("背景音乐自动播放失败:", error);
      // 创建一个播放按钮，或者监听一次点击事件来启动音乐
      const playBgmOnClick = () => {
        bgm.play();
        // 成功播放后，移除这个一次性的点击监听器
        window.removeEventListener('click', playBgmOnClick);
        console.log("用户交互后，背景音乐已开始播放。");
      };
      window.addEventListener('click', playBgmOnClick, { once: true });
      console.log("已设置监听器，请点击页面任意位置以播放背景音乐。");
    });
  }
});

// 使用 onUnmounted 生命周期钩子，在组件销毁时停止音乐，防止内存泄漏
onUnmounted(() => {
  console.log("组件已卸载，停止背景音乐。");
  bgm.pause();
  bgm.src = ''; // 释放音频资源
});

// ===================================================================
// 诊断日志：确认组件脚本已执行
// ===================================================================
console.log('%c[DIAG] XiangqiGame.vue SCRIPT SETUP EXECUTED', 'color: white; background-color: blue; font-weight: bold; padding: 4px;');

// --- 游戏核心状态 ---
const currentPlayer = ref('red');
const gameStatus = ref('playing');
const selectedPieceIndex = ref(null);
const validMoves = ref([]);

// --- 数据常量 ---
const SQUARE_SIZE = 60;
const PIECE_SIZE = 52;
const initialPieces = [
  { id: 0, char: '車', color: 'black', x: 0, y: 0 }, { id: 1, char: '馬', color: 'black', x: 1, y: 0 }, { id: 2, char: '象', color: 'black', x: 2, y: 0 }, { id: 3, char: '士', color: 'black', x: 3, y: 0 }, { id: 4, char: '將', color: 'black', x: 4, y: 0 }, { id: 5, char: '士', color: 'black', x: 5, y: 0 }, { id: 6, char: '象', color: 'black', x: 6, y: 0 }, { id: 7, char: '馬', color: 'black', x: 7, y: 0 }, { id: 8, char: '車', color: 'black', x: 8, y: 0 },
  { id: 9, char: '砲', color: 'black', x: 1, y: 2 }, { id: 10, char: '砲', color: 'black', x: 7, y: 2 },
  { id: 11, char: '卒', color: 'black', x: 0, y: 3 }, { id: 12, char: '卒', color: 'black', x: 2, y: 3 }, { id: 13, char: '卒', color: 'black', x: 4, y: 3 }, { id: 14, char: '卒', color: 'black', x: 6, y: 3 }, { id: 15, char: '卒', color: 'black', x: 8, y: 3 },
  { id: 16, char: '兵', color: 'red', x: 0, y: 6 }, { id: 17, char: '兵', color: 'red', x: 2, y: 6 }, { id: 18, char: '兵', color: 'red', x: 4, y: 6 }, { id: 19, char: '兵', color: 'red', x: 6, y: 6 }, { id: 20, char: '兵', color: 'red', x: 8, y: 6 },
  { id: 21, char: '炮', color: 'red', x: 1, y: 7 }, { id: 22, char: '炮', color: 'red', x: 7, y: 7 },
  { id: 23, char: '俥', color: 'red', x: 0, y: 9 }, { id: 24, char: '傌', color: 'red', x: 1, y: 9 }, { id: 25, char: '相', color: 'red', x: 2, y: 9 }, { id: 26, char: '仕', color: 'red', x: 3, y: 9 }, { id: 27, char: '帥', color: 'red', x: 4, y: 9 }, { id: 28, char: '仕', color: 'red', x: 5, y: 9 }, { id: 29, char: '相', color: 'red', x: 6, y: 9 }, { id: 30, char: '傌', color: 'red', x: 7, y: 9 }, { id: 31, char: '俥', color: 'red', x: 8, y: 9 },
];

const pieces = ref(JSON.parse(JSON.stringify(initialPieces)));

// --- 计算属性：棋盘映射 ---
const boardMap = computed(() => {
  console.log('%c[DIAG] Recalculating boardMap...', 'color: orange;');
  const map = new Map();
  for (const piece of pieces.value) {
    map.set(`${piece.x},${piece.y}`, piece);
  }
  return map;
});

// --- 核心交互逻辑 ---
const handlePieceClick = (index) => {
  console.log(`%c[DIAG] handlePieceClick triggered for index: ${index}`, 'color: green;');
  const piece = pieces.value[index];
  
  if (gameStatus.value !== 'playing') {
    console.warn('[DIAG] Click ignored: Game is over.');
    return;
  }
  if (piece.color !== currentPlayer.value) {
    console.warn(`[DIAG] Click ignored: Not ${piece.color}'s turn (it's ${currentPlayer.value}'s turn).`);
    return;
  }
  
  if (selectedPieceIndex.value === index) {
    console.log('[DIAG] Deselecting piece.');
    selectedPieceIndex.value = null;
  } else {
    console.log(`[DIAG] Selecting piece: ${piece.char} (id: ${piece.id})`);
    selectedPieceIndex.value = index;
  }
};

const executeMove = (targetPosition) => {
  console.log('%c[DIAG] executeMove triggered!', 'color: green; font-weight: bold;');
  console.log('[DIAG] Received targetPosition:', JSON.parse(JSON.stringify(targetPosition)));
  
  if (selectedPieceIndex.value === null) {
    console.error('[DIAG] FATAL in executeMove: selectedPieceIndex is null. Aborting.');
    return;
  }

  const pieceToMove = pieces.value[selectedPieceIndex.value];
  const targetPiece = getPieceAt(targetPosition.x, targetPosition.y);
  
  if (targetPosition.isCapture) {
    console.log('[DIAG] This is a CAPTURE move.');
    if (targetPiece) {
      console.log(`[DIAG] ✅ Target piece found: ${targetPiece.char}`);
    } else {
      console.error('[DIAG] ❌ MISMATCH! Move was marked as capture, but no piece found at target.');
    }
  }

  const newPieces = [];
  for (const p of pieces.value) {
    if (targetPiece && p.id === targetPiece.id) {
      console.log(`[DIAG] Removing captured piece: ${p.char}`);
      continue;
    }
    if (p.id === pieceToMove.id) {
      console.log(`[DIAG] Moving piece ${p.char} to (${targetPosition.x}, ${targetPosition.y})`);
      newPieces.push({ ...p, x: targetPosition.x, y: targetPosition.y });
    } else {
      newPieces.push(p);
    }
  }

  console.log('[DIAG] Updating pieces array...');
  pieces.value = newPieces;
  
  checkGameState();

  if (gameStatus.value === 'playing') {
    console.log(`[DIAG] Switching turn from ${currentPlayer.value} to ${currentPlayer.value === 'red' ? 'black' : 'red'}`);
    currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red';
  }

  selectedPieceIndex.value = null;
  console.log('%c[DIAG] executeMove finished.', 'color: green; font-weight: bold;');
};

// --- 游戏规则与计算 ---
watch(selectedPieceIndex, (newIndex, oldIndex) => {
  console.log(`%c[DIAG] WATCHER: selectedPieceIndex changed from ${oldIndex} to ${newIndex}`, 'color: purple;');
  if (newIndex !== null) {
    const piece = pieces.value[newIndex];
    console.log(`[DIAG] WATCHER: Calculating moves for ${piece.char}...`);
    validMoves.value = calculateValidMoves(piece);
    console.log('[DIAG] WATCHER: Calculated validMoves:', JSON.parse(JSON.stringify(validMoves.value)));
  } else {
    console.log('[DIAG] WATCHER: Clearing validMoves.');
    validMoves.value = [];
  }
});

// 用这个简化的函数替换你原来的 calculateValidMoves
/**
 * 计算所有合法移动位置的主函数（规则分发器）。
 * 这是最终的、功能完整的版本。
 */
const calculateValidMoves = (piece) => {
  if (!piece) return [];
  
  // 根据棋子类型，调用对应的走法规则函数
  switch (piece.char) {
    case '車': case '俥': 
      return calculateRookMoves(piece);
    case '馬': case '傌': 
      return calculateKnightMoves(piece);
    case '象': case '相': 
      return calculateElephantMoves(piece);
    case '士': case '仕': 
      return calculateAdvisorMoves(piece);
    case '將': case '帥': 
      return calculateKingMoves(piece);
    case '砲': case '炮': 
      return calculateCannonMoves(piece);
    case '卒': case '兵': 
      return calculatePawnMoves(piece);
    default: 
      return [];
  }
};

const calculateRookMoves = (piece) => {
  const moves = [];
  const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
  for (const dir of directions) {
    for (let i = 1; i < 10; i++) {
      const newX = piece.x + dir.x * i, newY = piece.y + dir.y * i;
      if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break;
      const blockingPiece = getPieceAt(newX, newY);
      if (blockingPiece) {
        if (blockingPiece.color !== piece.color) moves.push({ x: newX, y: newY, isCapture: true });
        break;
      } else {
        moves.push({ x: newX, y: newY, isCapture: false });
      }
    }
  }
  return moves;
};

const calculateKnightMoves = (piece) => {
  const moves = [];
  const { x, y, color } = piece;
  const potentialMoves = [
    { move: { x: x + 1, y: y - 2 }, leg: { x: x, y: y - 1 } }, { move: { x: x + 2, y: y - 1 }, leg: { x: x + 1, y: y } },
    { move: { x: x + 2, y: y + 1 }, leg: { x: x + 1, y: y } }, { move: { x: x + 1, y: y + 2 }, leg: { x: x, y: y + 1 } },
    { move: { x: x - 1, y: y + 2 }, leg: { x: x, y: y + 1 } }, { move: { x: x - 2, y: y + 1 }, leg: { x: x - 1, y: y } },
    { move: { x: x - 2, y: y - 1 }, leg: { x: x - 1, y: y } }, { move: { x: x - 1, y: y - 2 }, leg: { x: x, y: y - 1 } },
  ];
  for (const item of potentialMoves) {
    const { move, leg } = item;
    if (move.x >= 0 && move.x <= 8 && move.y >= 0 && move.y <= 9 && !getPieceAt(leg.x, leg.y)) {
      const targetPiece = getPieceAt(move.x, move.y);
      if (!targetPiece || targetPiece.color !== color) moves.push({ ...move, isCapture: !!targetPiece });
    }
  }
  return moves;
};

const calculateElephantMoves = (piece) => {
  const moves = [];
  const { x, y, color } = piece;
  const potentialMoves = [
    { move: { x: x + 2, y: y + 2 }, eye: { x: x + 1, y: y + 1 } }, { move: { x: x + 2, y: y - 2 }, eye: { x: x + 1, y: y - 1 } },
    { move: { x: x - 2, y: y + 2 }, eye: { x: x - 1, y: y + 1 } }, { move: { x: x - 2, y: y - 2 }, eye: { x: x - 1, y: y - 1 } },
  ];
  for (const item of potentialMoves) {
    const { move, eye } = item;
    const isRiverCrossed = (color === 'red' && move.y < 5) || (color === 'black' && move.y > 4);
    if (move.x >= 0 && move.x <= 8 && move.y >= 0 && move.y <= 9 && !isRiverCrossed && !getPieceAt(eye.x, eye.y)) {
      const targetPiece = getPieceAt(move.x, move.y);
      if (!targetPiece || targetPiece.color !== color) moves.push({ ...move, isCapture: !!targetPiece });
    }
  }
  return moves;
};

const calculateAdvisorMoves = (piece) => {
  const moves = [];
  const { x, y, color } = piece;
  const potentialMoves = [{ x: x + 1, y: y + 1 }, { x: x + 1, y: y - 1 }, { x: x - 1, y: y + 1 }, { x: x - 1, y: y - 1 }];
  for (const move of potentialMoves) {
    const isOutOfPalace = (move.x < 3 || move.x > 5 || (color === 'red' && (move.y < 7 || move.y > 9)) || (color === 'black' && (move.y < 0 || move.y > 2)));
    if (!isOutOfPalace) {
      const targetPiece = getPieceAt(move.x, move.y);
      if (!targetPiece || targetPiece.color !== color) moves.push({ ...move, isCapture: !!targetPiece });
    }
  }
  return moves;
};

const calculateKingMoves = (piece) => {
  const moves = [];
  const { x, y, color } = piece;
  const potentialMoves = [{ x: x + 1, y: y }, { x: x - 1, y: y }, { x: x, y: y + 1 }, { x: x, y: y - 1 }];
  for (const move of potentialMoves) {
    const isOutOfPalace = (move.x < 3 || move.x > 5 || (color === 'red' && (move.y < 7 || move.y > 9)) || (color === 'black' && (move.y < 0 || move.y > 2)));
    if (!isOutOfPalace) {
      const targetPiece = getPieceAt(move.x, move.y);
      if (!targetPiece || targetPiece.color !== color) moves.push({ ...move, isCapture: !!targetPiece });
    }
  }
  const opponentKing = pieces.value.find(p => (p.char === '將' || p.char === '帥') && p.color !== color);
  if (opponentKing && opponentKing.x === x) {
    const startY = Math.min(y, opponentKing.y) + 1, endY = Math.max(y, opponentKing.y);
    let hasObstacle = false;
    for (let i = startY; i < endY; i++) {
      if (getPieceAt(x, i)) {
        hasObstacle = true;
        break;
      }
    }
    if (!hasObstacle) moves.push({ x: opponentKing.x, y: opponentKing.y, isCapture: true });
  }
  return moves;
};

const calculateCannonMoves = (piece) => {
  const moves = [];
  const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
  for (const dir of directions) {
    let screenFound = false;
    for (let i = 1; i < 10; i++) {
      const newX = piece.x + dir.x * i, newY = piece.y + dir.y * i;
      if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break;
      const targetPiece = getPieceAt(newX, newY);
      if (!screenFound) {
        if (targetPiece) screenFound = true;
        else moves.push({ x: newX, y: newY, isCapture: false });
      } else {
        if (targetPiece) {
          if (targetPiece.color !== piece.color) moves.push({ x: newX, y: newY, isCapture: true });
          break;
        }
      }
    }
  }
  return moves;
};

const calculatePawnMoves = (piece) => {
  const moves = [];
  const { x, y, color } = piece;
  const forwardDir = color === 'red' ? -1 : 1;
  const crossedRiver = (color === 'red' && y < 5) || (color === 'black' && y > 4);
  let newY = y + forwardDir;
  if (newY >= 0 && newY <= 9) {
    const targetPiece = getPieceAt(x, newY);
    if (!targetPiece || targetPiece.color !== color) moves.push({ x: x, y: newY, isCapture: !!targetPiece });
  }
  if (crossedRiver) {
    if (x - 1 >= 0) {
      const targetPiece = getPieceAt(x - 1, y);
      if (!targetPiece || targetPiece.color !== color) moves.push({ x: x - 1, y: y, isCapture: !!targetPiece });
    }
    if (x + 1 <= 8) {
      const targetPiece = getPieceAt(x + 1, y);
      if (!targetPiece || targetPiece.color !== color) moves.push({ x: x + 1, y: y, isCapture: !!targetPiece });
    }
  }
  return moves;
};

// --- 辅助函数 ---
const getPieceAt = (x, y) => boardMap.value.get(`${x},${y}`);

const checkGameState = () => {
  const hasRedKing = pieces.value.some(p => p.char === '帥');
  const hasBlackKing = pieces.value.some(p => p.char === '將');
  if (!hasBlackKing) {
    gameStatus.value = 'red_wins';
    setTimeout(() => alert('红方胜利！'), 100);
  } else if (!hasRedKing) {
    gameStatus.value = 'black_wins';
    setTimeout(() => alert('黑方胜利！'), 100);
  }
};

const getPieceStyle = (piece) => {
  const pieceRadius = PIECE_SIZE / 2;
  return {
    left: `${piece.x * SQUARE_SIZE - pieceRadius}px`,
    top: `${piece.y * SQUARE_SIZE - pieceRadius}px`
  };
};

const getMoveStyle = (move) => {
  const markerRadius = 10;
  return {
    left: `${move.x * SQUARE_SIZE - markerRadius}px`,
    top: `${move.y * SQUARE_SIZE - markerRadius}px`
  };
};

// ===================================================================
// 诊断日志：确认组件已挂载到 DOM
// ===================================================================
onMounted(() => {
  console.log('%c[DIAG] XiangqiGame.vue COMPONENT MOUNTED', 'color: white; background-color: green; font-weight: bold; padding: 4px;');
});
</script>

<style scoped>
/* ... (所有样式保持不变) ... */
#game-container { text-align: center; color: #333; }
.game-info { margin-bottom: 15px; font-size: 1.2em; font-weight: bold; height: 30px; }
.player-turn.red { color: #e83a3a; }
.player-turn.black { color: #333; }
.game-over { color: #d4af37; font-size: 1.5em; animation: gameOverPulse 1s ease-in-out infinite alternate; }
@keyframes gameOverPulse { from { transform: scale(1); } to { transform: scale(1.05); } }
#board-wrapper { padding: 20px; background-color: #c1a485; border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.15), inset 0 0 5px rgba(0,0,0,0.1); display: inline-block; }
#board {
  position: relative;
  width: 480px;
  height: 540px;
  background-color: #e6c8a4;
  border: 1px solid #5a3a1a;
  background-image:
    repeating-linear-gradient(to right, #5a3a1a 0, #5a3a1a 1px, transparent 1px, transparent 60px),
    repeating-linear-gradient(to bottom, #5a3a1a 0, #5a3a1a 1px, transparent 1px, transparent 60px);
  background-size: 60px 60px;
  background-position: -0.5px -0.5px;
}
.river { position: absolute; width: 100%; height: 60px; top: 240px; left: 0; display: flex; justify-content: center; align-items: center; font-size: 28px; letter-spacing: 1.5em; color: #8c6f50; pointer-events: none; background: #e6c8a4; }
.palace { position: absolute; width: 120px; height: 120px; pointer-events: none; }
.palace::before, .palace::after { content: ''; position: absolute; width: 168px; height: 1px; background-color: #8c6f50; top: 60px; left: -24px; }
.palace::before { transform: rotate(45deg); }
.palace::after { transform: rotate(-45deg); }
.valid-move {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(30, 180, 30, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.7);
  
  /* --- 把 z-index 改得比棋子高！ --- */
  z-index: 30; /* 原来是 10，棋子是 20，现在改为 30 */

  animation: movePulse 1.2s ease-in-out infinite alternate;
  cursor: pointer;
}
.valid-move.capture { background-color: rgba(255, 60, 60, 0.7); animation-name: capturePulse; }
@keyframes movePulse { from { transform: scale(1); opacity: 0.7; } to { transform: scale(1.2); opacity: 1; } }
@keyframes capturePulse { from { transform: scale(1.1); opacity: 0.7; } to { transform: scale(1.3); opacity: 1; } }
.piece {
  position: absolute;
  width: 52px; height: 52px;
  border-radius: 50%;
  background-color: #f5e4c3;
  box-shadow: 0 3px 6px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5);
  border-width: 2px; border-style: solid;
  display: flex; justify-content: center; align-items: center;
  font-size: 30px; font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  z-index: 20;
}
.piece:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.5); }
.piece.red { color: #e83a3a; border-color: #e83a3a; }
.piece.black { color: #333; border-color: #333; }
.piece.selected {
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.8), 0 3px 6px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5);
  transform: translateY(-2px); border-width: 3px;
  animation: selectedPulse 1.5s ease-in-out infinite alternate;
}
.piece.selected:hover { transform: translateY(-5px); box-shadow: 0 0 0 6px rgba(255, 215, 0, 0.9), 0 6px 12px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.5); }
@keyframes selectedPulse { from { box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.8), 0 3px 6px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5); } to { box-shadow: 0 0 0 6px rgba(255, 215, 0, 0.4), 0 3px 6px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5); } }
</style>
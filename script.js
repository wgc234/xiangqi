document.addEventListener('DOMContentLoaded', () => {

    // --- 配置常量 ---
    const SQUARE_SIZE = 60; // 格子尺寸 (px)
    const PIECE_SIZE = 52;  // 棋子尺寸 (px)
    const boardElement = document.getElementById('board');

    // --- 初始棋子布局数据 ---
    // (数据保持不变)
    const initialPieces = [
        // 黑方 (Black)
        { char: '車', color: 'black', x: 0, y: 0 },
        { char: '馬', color: 'black', x: 1, y: 0 },
        { char: '象', color: 'black', x: 2, y: 0 },
        { char: '士', color: 'black', x: 3, y: 0 },
        { char: '將', color: 'black', x: 4, y: 0 },
        { char: '士', color: 'black', x: 5, y: 0 },
        { char: '象', color: 'black', x: 6, y: 0 },
        { char: '馬', color: 'black', x: 7, y: 0 },
        { char: '車', color: 'black', x: 8, y: 0 },
        { char: '砲', color: 'black', x: 1, y: 2 },
        { char: '砲', color: 'black', x: 7, y: 2 },
        { char: '卒', color: 'black', x: 0, y: 3 },
        { char: '卒', color: 'black', x: 2, y: 3 },
        { char: '卒', color: 'black', x: 4, y: 3 },
        { char: '卒', color: 'black', x: 6, y: 3 },
        { char: '卒', color: 'black', x: 8, y: 3 },

        // 红方 (Red)
        { char: '兵', color: 'red', x: 0, y: 6 },
        { char: '兵', color: 'red', x: 2, y: 6 },
        { char: '兵', color: 'red', x: 4, y: 6 },
        { char: '兵', color: 'red', x: 6, y: 6 },
        { char: '兵', color: 'red', x: 8, y: 6 },
        { char: '炮', color: 'red', x: 1, y: 7 },
        { char: '炮', color: 'red', x: 7, y: 7 },
        { char: '俥', color: 'red', x: 0, y: 9 },
        { char: '傌', color: 'red', x: 1, y: 9 },
        { char: '相', color: 'red', x: 2, y: 9 },
        { char: '仕', color: 'red', x: 3, y: 9 },
        { char: '帥', color: 'red', x: 4, y: 9 },
        { char: '仕', color: 'red', x: 5, y: 9 },
        { char: '相', color: 'red', x: 6, y: 9 },
        { char: '傌', color: 'red', x: 7, y: 9 },
        { char: '俥', color: 'red', x: 8, y: 9 },
    ];

    /**
     * 绘制棋盘上的特殊区域：楚河汉界和九宫格
     */
    function drawSpecialFeatures() {
        // ... (这部分函数没有变化) ...
        const river = document.createElement('div');
        river.className = 'river';
        river.textContent = '楚 河   漢 界';
        boardElement.appendChild(river);

        const palaceBlack = document.createElement('div');
        palaceBlack.className = 'palace';
        palaceBlack.style.left = `${3 * SQUARE_SIZE}px`;
        palaceBlack.style.top = `${0 * SQUARE_SIZE}px`;
        boardElement.appendChild(palaceBlack);

        const palaceRed = document.createElement('div');
        palaceRed.className = 'palace';
        palaceRed.style.left = `${3 * SQUARE_SIZE}px`;
        palaceRed.style.top = `${7 * SQUARE_SIZE}px`;
        boardElement.appendChild(palaceRed);
    }

    /**
     * 根据数据绘制所有棋子
     */
    function drawPieces() {
        initialPieces.forEach(pieceData => {
            const pieceElement = document.createElement('div');
            
            pieceElement.className = `piece ${pieceData.color}`;
            pieceElement.textContent = pieceData.char;

            // --- 核心改动在这里 ---
            // 目标：将棋子中心点对准交叉线点。
            // 交叉点坐标 = (格子坐标 * 格子大小)
            // 棋子元素左上角坐标 = 交叉点坐标 - 棋子半径
            
            const pieceRadius = PIECE_SIZE / 2;
            const targetX = pieceData.x * SQUARE_SIZE;
            const targetY = pieceData.y * SQUARE_SIZE;
            
            pieceElement.style.left = `${targetX - pieceRadius}px`;
            pieceElement.style.top = `${targetY - pieceRadius}px`;

            boardElement.appendChild(pieceElement);
        });
    }

    // --- 初始化棋盘 ---
    function initBoard() {
        boardElement.innerHTML = ''; 
        drawSpecialFeatures();
        drawPieces();
    }

    initBoard();
});
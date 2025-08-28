document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status-display');
    const restartButton = document.getElementById('restart-button');

    let board = [];
    let hasMoved = {}; // To track king and rook movements for castling

    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    const pieceUnicode = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
    };

    function createBoard() {
        board = JSON.parse(JSON.stringify(initialBoard)); // Deep copy
        hasMoved = {
            wK: false, wR1: false, wR2: false, // White King, Queen-side Rook, King-side Rook
            bK: false, bR1: false, bR2: false  // Black King, Queen-side Rook, King-side Rook
        };
        turn = 'w';
        statusElement.textContent = "White's turn";
        renderBoard();
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((i + j) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = i;
                square.dataset.col = j;

                const pieceChar = board[i][j];
                if (pieceChar !== ' ') {
                    const piece = document.createElement('span');
                    piece.classList.add('piece');
                    piece.textContent = pieceUnicode[pieceChar];
                    square.appendChild(piece);
                }

                boardElement.appendChild(square);
            }
        }
    }

    let turn = 'w'; // 'w' for white, 'b' for black
    let selectedSquare = null;
    let validMoves = [];

    const boardClickHandler = (e) => {
        const square = e.target.closest('.square');
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (selectedSquare) {
            const isAValidMove = validMoves.some(move => move.row === row && move.col === col);
            if (isAValidMove) {
                movePiece(selectedSquare, { row, col });
                resetSelection();
            } else {
                resetSelection();
                const piece = board[row][col];
                if (piece !== ' ') {
                    const isWhitePiece = piece === piece.toUpperCase();
                    if ((turn === 'w' && isWhitePiece) || (turn === 'b' && !isWhitePiece)) {
                        selectPiece(square, row, col);
                    }
                }
            }
        } else {
            const piece = board[row][col];
            if (piece !== ' ') {
                const isWhitePiece = piece === piece.toUpperCase();
                if ((turn === 'w' && isWhitePiece) || (turn === 'b' && !isWhitePiece)) {
                    selectPiece(square, row, col);
                }
            }
        }
    };
    boardElement.addEventListener('click', boardClickHandler);

    function selectPiece(square, row, col) {
        resetSelection();
        selectedSquare = { row, col, piece: board[row][col] };
        square.classList.add('selected');
        validMoves = getValidMoves(row, col, selectedSquare.piece);
        highlightValidMoves();
    }

    function resetSelection() {
        if (selectedSquare) {
            const prevSquareEl = document.querySelector(`[data-row='${selectedSquare.row}'][data-col='${selectedSquare.col}']`);
            if (prevSquareEl) prevSquareEl.classList.remove('selected');
        }
        document.querySelectorAll('.valid-move').forEach(s => s.classList.remove('valid-move'));
        selectedSquare = null;
        validMoves = [];
    }

    function movePiece(from, to) {
        const piece = board[from.row][from.col];
        const move = validMoves.find(m => m.row === to.row && m.col === to.col);

        if (move && move.castle) {
            if (move.castle === 'kingside') {
                const rook = board[from.row][7];
                board[from.row][5] = rook;
                board[from.row][7] = ' ';
            } else {
                const rook = board[from.row][0];
                board[from.row][3] = rook;
                board[from.row][0] = ' ';
            }
        }

        board[to.row][to.col] = piece;
        board[from.row][from.col] = ' ';

        if (piece === 'K') hasMoved.wK = true;
        if (piece === 'k') hasMoved.bK = true;
        if (piece === 'R' && from.row === 7 && from.col === 0) hasMoved.wR1 = true;
        if (piece === 'R' && from.row === 7 && from.col === 7) hasMoved.wR2 = true;
        if (piece === 'r' && from.row === 0 && from.col === 0) hasMoved.bR1 = true;
        if (piece === 'r' && from.row === 0 && from.col === 7) hasMoved.bR2 = true;

        if (piece.toLowerCase() === 'p') {
            const isWhite = piece === 'P';
            const lastRow = isWhite ? 0 : 7;
            if (to.row === lastRow) {
                board[to.row][to.col] = isWhite ? 'Q' : 'q';
            }
        }

        turn = turn === 'w' ? 'b' : 'w';

        renderBoard();
        checkGameState();
    }

    function checkGameState() {
        const opponentMoves = getAllValidMovesForPlayer(turn, board);

        if (opponentMoves.length === 0) {
            if (isKingInCheck(turn, board)) {
                statusElement.textContent = `Checkmate! ${turn === 'b' ? 'White' : 'Black'} wins!`;
            } else {
                statusElement.textContent = `Stalemate! It's a draw!`;
            }
            boardElement.removeEventListener('click', boardClickHandler);
        } else if (isKingInCheck(turn, board)) {
            statusElement.textContent = `${turn === 'w' ? 'White' : 'Black'}'s turn (Check)`;
        } else {
            statusElement.textContent = `${turn === 'w' ? 'White' : 'Black'}'s turn`;
        }
    }

    function getAllValidMovesForPlayer(playerColor, boardState) {
        const allMoves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = boardState[r][c];
                if (piece === ' ') continue;

                const isWhitePiece = piece === piece.toUpperCase();
                if ((playerColor === 'w' && isWhitePiece) || (playerColor === 'b' && !isWhitePiece)) {
                    const moves = getValidMoves(r, c, piece);
                    if (moves.length > 0) {
                        allMoves.push(...moves);
                    }
                }
            }
        }
        return allMoves;
    }

    function highlightValidMoves() {
        validMoves.forEach(move => {
            const squareEl = document.querySelector(`[data-row='${move.row}'][data-col='${move.col}']`);
            if (squareEl) {
                squareEl.classList.add('valid-move');
            }
        });
    }

    function getValidMoves(row, col, piece) {
        const rawMoves = getRawMovesForPiece(row, col, piece, board);
        const kingColor = (piece === piece.toUpperCase()) ? 'w' : 'b';

        return rawMoves.filter(move => {
            const tempBoard = JSON.parse(JSON.stringify(board));
            const pieceToMove = tempBoard[row][col];
            tempBoard[move.row][move.col] = pieceToMove;
            tempBoard[row][col] = ' ';
            // Special handling for castling to check squares king passes through
            if (move.castle) {
                // Simplified check: just ensure the end position is not in check
                // A full implementation would check the in-between squares too
                return !isKingInCheck(kingColor, tempBoard);
            }
            return !isKingInCheck(kingColor, tempBoard);
        });
    }

    function isKingInCheck(kingColor, boardState) {
        const kingPiece = kingColor === 'w' ? 'K' : 'k';
        let kingPos = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (boardState[r][c] === kingPiece) {
                    kingPos = { row: r, col: c };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        const opponentColor = kingColor === 'w' ? 'b' : 'w';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = boardState[r][c];
                if (piece === ' ') continue;

                const isOpponent = (opponentColor === 'w' && piece === piece.toUpperCase()) || (opponentColor === 'b' && piece === piece.toLowerCase());
                if (isOpponent) {
                    const moves = getRawMovesForPiece(r, c, piece, boardState);
                    if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // This function gets all possible moves for a piece, without considering checks.
    function getRawMovesForPiece(row, col, piece, boardState) {
        const pieceType = piece.toLowerCase();

        if (pieceType === 'p') return getPawnMoves(row, col, piece, boardState);
        if (pieceType === 'r') return getRookMoves(row, col, piece, boardState);
        if (pieceType === 'n') return getKnightMoves(row, col, piece, boardState);
        if (pieceType === 'b') return getBishopMoves(row, col, piece, boardState);
        if (pieceType === 'q') return getQueenMoves(row, col, piece, boardState);
        if (pieceType === 'k') return getKingMoves(row, col, piece, boardState);
        return [];
    }

    function getQueenMoves(row, col, piece, boardState) {
        const rookMoves = getRookMoves(row, col, piece, boardState);
        const bishopMoves = getBishopMoves(row, col, piece, boardState);
        return [...rookMoves, ...bishopMoves];
    }

    function getKingMoves(row, col, piece, boardState) {
        const moves = [];
        const isWhite = piece === piece.toUpperCase();
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ];

        for (const [dr, dc] of kingMoves) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = boardState[newRow][newCol];
                if (targetPiece === ' ') {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    const isTargetWhite = targetPiece === targetPiece.toUpperCase();
                    if (isWhite !== isTargetWhite) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }

        // Castling logic
        if (isWhite && !hasMoved.wK) {
            if (!hasMoved.wR2 && boardState[7][5] === ' ' && boardState[7][6] === ' ') {
                moves.push({ row: 7, col: 6, castle: 'kingside' });
            }
            if (!hasMoved.wR1 && boardState[7][1] === ' ' && boardState[7][2] === ' ' && boardState[7][3] === ' ') {
                moves.push({ row: 7, col: 2, castle: 'queenside' });
            }
        } else if (!isWhite && !hasMoved.bK) {
            if (!hasMoved.bR2 && boardState[0][5] === ' ' && boardState[0][6] === ' ') {
                moves.push({ row: 0, col: 6, castle: 'kingside' });
            }
            if (!hasMoved.bR1 && boardState[0][1] === ' ' && boardState[0][2] === ' ' && boardState[0][3] === ' ') {
                moves.push({ row: 0, col: 2, castle: 'queenside' });
            }
        }
        return moves;
    }

    function getRookMoves(row, col, piece, boardState) {
        const moves = [];
        const isWhite = piece === piece.toUpperCase();
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dr;
                const newCol = col + i * dc;
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
                const targetPiece = boardState[newRow][newCol];
                if (targetPiece === ' ') {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    const isTargetWhite = targetPiece === targetPiece.toUpperCase();
                    if (isWhite !== isTargetWhite) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
        return moves;
    }

    function getKnightMoves(row, col, piece, boardState) {
        const moves = [];
        const isWhite = piece === piece.toUpperCase();
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [dr, dc] of knightMoves) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = boardState[newRow][newCol];
                if (targetPiece === ' ') {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    const isTargetWhite = targetPiece === targetPiece.toUpperCase();
                    if (isWhite !== isTargetWhite) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }
        return moves;
    }

    function getBishopMoves(row, col, piece, boardState) {
        const moves = [];
        const isWhite = piece === piece.toUpperCase();
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dr;
                const newCol = col + i * dc;
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
                const targetPiece = boardState[newRow][newCol];
                if (targetPiece === ' ') {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    const isTargetWhite = targetPiece === targetPiece.toUpperCase();
                    if (isWhite !== isTargetWhite) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
        return moves;
    }

    function getPawnMoves(row, col, piece, boardState) {
        const moves = [];
        const isWhite = piece === 'P';
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;

        if (row + direction < 0 || row + direction > 7) return moves;

        if (boardState[row + direction][col] === ' ') {
            moves.push({ row: row + direction, col: col });
        }

        if (row === startRow && boardState[row + direction][col] === ' ' && boardState[row + 2 * direction][col] === ' ') {
            moves.push({ row: row + 2 * direction, col: col });
        }

        const captureCols = [col - 1, col + 1];
        for (const c of captureCols) {
            if (c >= 0 && c < 8) {
                if (boardState[row + direction][c] !== ' ') {
                    const targetPiece = boardState[row + direction][c];
                    const isTargetWhite = targetPiece === targetPiece.toUpperCase();
                    if (isWhite !== isTargetWhite) {
                        moves.push({ row: row + direction, col: c });
                    }
                }
            }
        }
        return moves;
    }

    restartButton.addEventListener('click', createBoard);

    // Initial game setup
    createBoard();
});

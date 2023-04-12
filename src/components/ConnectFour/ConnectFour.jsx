import React, { useReducer } from "react";
import './ConnectFour.css';

const NUM_COLS = 7;
const NUM_ROWS = 6;
const NUM_IN_A_ROW_TO_WIN = 4;

export default function ConnectFour() {
    const [{ board, winner, isGameOver}, dispactBoard] = useReducer(reducer, genEmptyState());

    return (
        <>
            <h1>Connect Four</h1>
            {winner != null && <h2 id={winner === 1 ? "red" : "blue"}>Player {winner} Wins!</h2>}
            <div className="board">
                {board.map((slots, slotIdx) => {
                    const onColClick = () => {
                        dispactBoard({ type: "move", slotIdx})
                    }
                    return <Column
                            key={slotIdx}
                            slots={slots}
                            onClick={onColClick}
                            />
                })}
            </div>
            {(winner != null || isGameOver) && <button id={winner === 1 ? "red-button" : "blue-button"}onClick={() => dispactBoard({type: "restart"})} >Restart</button>}
        </>
    )
}

function Column({ slots, onClick }) {
    return <div className="column" onClick={onClick}>
        {slots.map((slot, i) => {
            return <div key={i} className="tile">
                <div className={`player ${slot != null ?  `player-${slot}` : ''}`}/>
            </div>
        })}
    </div>
}
function reducer(state, action){
    switch(action.type){
        case "restart":
            return genEmptyState();
        case "move":
            const curCol = state.board[action.slotIdx];
            const isColFull = curCol[0] != null;

            if(state.isGameOver || isColFull) return state;
            
            const { board, currentPlayer } = state;
            const rowIndex = curCol.lastIndexOf(null);
            const boardClone = [...board]
            const colClone = [...curCol]
            colClone[rowIndex] = currentPlayer;
            boardClone[action.slotIdx] = colClone;

            const winVertically = didWin(rowIndex, action.slotIdx, 1, 0, boardClone, currentPlayer);
            const winHorizontally = didWin(rowIndex, action.slotIdx, 0, 1, boardClone, currentPlayer);
            const winDiagonally = 
                didWin(rowIndex, action.slotIdx, 1, 1, boardClone, currentPlayer) ||
                didWin(rowIndex, action.slotIdx, -1, 1, boardClone, currentPlayer)
            const winner = winVertically || winHorizontally || winDiagonally ? currentPlayer : null;
            const isBoardFull = boardClone.every(col => col.every(slot => slot != null));

            return {
                board: boardClone,
                currentPlayer: currentPlayer === 1 ? 2 : 1,
                winner,
                isGameOver: winner != null || isBoardFull
            }

            
        default:
            throw new Error("Unexpected action type!");
    }
}

function didWin(rowIndex, colIndex, rowIncrement, colIncrement, board, currentPlayer){
    let curRow = rowIndex;
    let curCol = colIndex;
    let numInARow = 0;

    while(curRow < NUM_ROWS && curCol < NUM_COLS && board[curCol][curRow] === currentPlayer){
        numInARow++;
        curCol += colIncrement;
        curRow += rowIncrement;
    }

    curRow = rowIndex - rowIncrement;
    curCol = colIndex - colIncrement;

    while(curRow >= 0 && curCol >= 0 && board[curCol][curRow] === currentPlayer){
        numInARow++;
        curCol -= colIncrement;
        curRow -= rowIncrement;
    }

    return numInARow >= NUM_IN_A_ROW_TO_WIN;
}

function genEmptyState() {
    return {
        board: new Array(NUM_COLS).fill(null).map(_ => new Array(NUM_ROWS).fill(null)),
        currentPlayer: 1,
        winner: null,
        isGameOver: false
    }
}
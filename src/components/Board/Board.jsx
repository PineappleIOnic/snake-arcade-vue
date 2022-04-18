import React, { useEffect, useState } from 'react'
import './Board.css'
import Snake from '../Snake/Snake'
import Food from '../Food/Food'
import getRandom from '../../functions/getRandom'
import GameOver from '../GameOver/GameOver'
import AskName from '../AskName/AskName'
import { api } from '../../functions/api'
import collect_soundfx from '../../assets/collect.mp3'

const Board = () => {
    const [snakePos, setSnakePos] = useState([[44, 44]]);
    const [foodPos, setFoodPos] = useState(getRandom());
    const [dir, setDir] = useState('');
    const [speed, setSpeed] = useState(120); //Initial speed
    const [score, setScore] = useState(localStorage.getItem('highscore') || 0);
    const [gameOver, setGameOver] = useState(false);
    const [player, setPlayer] = useState(localStorage.getItem('player') || '');

    const [audio] = useState(new Audio(collect_soundfx));
    const [audioPlaying, setAudioPlaying] = useState(false);

    useEffect(() => {
        audioPlaying? audio.play() : audio.pause();
    }, [audio, audioPlaying]);
    
    useEffect(() => {
        audio.addEventListener('ended', () => setAudioPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setAudioPlaying(false));
        }
    })

    useEffect(() => {
        const interval = setInterval(() => {
            const head = [snakePos[0][0], snakePos[0][1]];
            const newSnakePos = [...snakePos];
            switch (dir) {
                case 'R':
                    head[0] += 4;
                    break;
                case 'L':
                    head[0] -= 4;
                    break;
                case 'U':
                    head[1] -= 4;
                    break;
                case 'D':
                    head[1] += 4;
                    break;
                default:
                    break;
            }
            newSnakePos.unshift(head);
            if (newSnakePos[0][0] === foodPos[0] && newSnakePos[0][1] === foodPos[1]) {
                setAudioPlaying(!audioPlaying);
                setFoodPos(getRandom());
                increaseSpeed();
            } else {
                newSnakePos.pop();
            }
            setSnakePos(newSnakePos);
            if (checkCollision(newSnakePos)) {
                if ((snakePos.length - 1) * 10 > score) {
                    setScore((snakePos.length) * 10);
                    localStorage.setItem("highscore", (snakePos.length) * 10);
                    uploadScore((snakePos.length) * 10);
                }
                setGameOver(true);
                setSpeed(120);
                setDir('');
                setSnakePos([[44, 44]]);
                setFoodPos(getRandom());
                clearInterval(interval);
            };
        }, speed);
        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dir, foodPos, snakePos, speed]);

    //Function to increase the speed of the snake
    const increaseSpeed = () => {
        let l = snakePos.length;
        if (l % 10 === 0) {
            setSpeed(speed - 10);
        }
    }

    //Function to check if the snake has hit the wall or itself
    const checkCollision = (snakePos) => {
        const head = snakePos[0];
        const [x, y] = head;
        if (x < 0 || x > 98 || y < 0 || y > 98) {
            return true;
        }
        for (let i = 1; i < snakePos.length; i++) {
            if (head[0] === snakePos[i][0] && head[1] === snakePos[i][1]) {
                return true;
            }
        }
        return false;
    }

    //Function to detect keboard press and set the snake direction
    useEffect(() => {
        console.log("Key detected")
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowRight' && dir !== 'L') {
                setDir('R');
            } else if (e.key === 'ArrowLeft' && dir !== 'R') {
                setDir('L');
            } else if (e.key === 'ArrowUp' && dir !== 'D') {
                setDir('U');
            } else if (e.key === 'ArrowDown' && dir !== 'U') {
                setDir('D');
            }
        }
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }
    }, [dir]);
    
    //Function to upload the score in database
    async function uploadScore(num) {
        await api.database.createDocument('snake-highscores', 'unique()', {
            player: player,
            score: num,
        })
    }
        
    return (
        <div className='board'>
           {!localStorage.getItem('player') ? <>
                <AskName setPlayer={setPlayer} setScore={setScore} setGameOver={setGameOver}/>
            </> : <>
                <div className="name-input">
                    <p>Player name:</p>
                    <input type="text" onChange={(e) => { setPlayer(e.target.value); localStorage.setItem('player', e.target.value) }} value={player !== '' ? player : ""} />
                </div>
                {gameOver ? <GameOver setGameOver={setGameOver} /> :
                    <div className="snake-board">
                        <Snake snakePos={snakePos} />
                        <Food foodPos={foodPos} />
                    </div>
                }
            </>}

            <div className="scores">
                <p>Your Highscore: <span className="dig">{score}</span></p>
                <p>Current Score: <span className="dig">{(snakePos.length - 1) * 10}</span></p>
            </div>
        </div>
    )
}

export default Board
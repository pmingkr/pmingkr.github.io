const $input = document.querySelector('#input');
const $button = document.querySelector('#check-button');
const $logs = document.querySelector('#logs');

let answer;
let tries = 0;
const MAX_TRIES = 10;

function generateAnswer() {
    const numbers = [];
    while (numbers.length < 3) {
        const digit = Math.floor(Math.random() * 10);
        if (!numbers.includes(digit)) {
            numbers.push(digit);
        }
    }
    answer = numbers;
    console.log('Answer (for debugging):', answer.join(''));
}

function checkInput(value) {
    if (value.length !== 3) {
        alert('3자리 숫자를 입력해주세요.');
        return false;
    }
    if (new Set(value).size !== 3) {
        alert('서로 다른 숫자를 입력해주세요.');
        return false;
    }
    if (!/^\d{3}$/.test(value)) {
        alert('숫자만 입력해주세요.');
        return false;
    }
    return true;
}

function renderLog(value, result) {
    const logItem = document.createElement('div');
    logItem.className = 'log-item';

    const guessSpan = document.createElement('span');
    guessSpan.className = 'guess';
    guessSpan.textContent = value;

    const resultSpan = document.createElement('span');
    resultSpan.className = 'result';
    resultSpan.textContent = result;

    logItem.appendChild(guessSpan);
    logItem.appendChild(resultSpan);

    $logs.prepend(logItem);
}

function endGame(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'correct'; // Use the 'correct' class for end-game messages
    messageDiv.textContent = message;
    $logs.prepend(messageDiv);

    $input.disabled = true;
    $button.disabled = true;

    const restartButton = document.createElement('button');
    restartButton.textContent = '다시 시작';
    restartButton.style.marginTop = '10px';
    restartButton.onclick = () => window.location.reload();
    $logs.append(restartButton);
}


function handleGuess() {
    const value = $input.value;
    if (!checkInput(value)) {
        $input.value = '';
        $input.focus();
        return;
    }

    tries++;
    const guessArray = value.split('').map(Number);
    let strikes = 0;
    let balls = 0;

    for (let i = 0; i < 3; i++) {
        if (guessArray[i] === answer[i]) {
            strikes++;
        } else if (answer.includes(guessArray[i])) {
            balls++;
        }
    }

    if (strikes === 3) {
        renderLog(value, '🎉 정답! 🎉');
        endGame(`축하합니다! ${tries}번 만에 맞추셨습니다!`);
    } else if (tries >= MAX_TRIES) {
        renderLog(value, `${strikes}S ${balls}B`);
        endGame(`실패! 정답은 ${answer.join('')}였습니다.`);
    } else {
        renderLog(value, `${strikes}S ${balls}B`);
    }

    $input.value = '';
    $input.focus();
}

// Event Listeners
$button.addEventListener('click', handleGuess);
$input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // prevent any default form submission behavior
        handleGuess();
    }
});

// Initialize game
generateAnswer();
$input.focus();

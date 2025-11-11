let [computer_score,user_score]=[0,0];
let result_ref = document.getElementById("result");
const container = document.querySelector('.container');
const winPopup = document.getElementById('winPopup');
let popupTimer = null;
let choices_object = {
    'rock' : {
        'rock' : 'draw',
        'scissor' : 'win',
        'paper' : 'lose'
    },
    'scissor' : {
        'rock' : 'lose',
        'scissor' : 'draw',
        'paper' : 'win'
    },
    'paper' : {
        'rock' : 'win',
        'scissor' : 'lose',
        'paper' : 'draw'
    }

}

function checker(input){
    var choices = ["rock", "paper", "scissor"];
    var num = Math.floor(Math.random()*3);

    document.getElementById("comp_choice").innerHTML =
    ` Computer choose <span> ${choices[num].toUpperCase()} </span>`;

    document.getElementById("user_choice").innerHTML =
    ` You choose <span> ${input.toUpperCase()} </span>`;

    let computer_choice = choices[num];

    switch(choices_object[input][computer_choice]){
        case 'win':
            result_ref.style.cssText = "background-color: #cefdce; color: #689f38";
            result_ref.innerHTML = "YOU WIN";
            user_score++;
            // add win animation
            container.classList.remove('lose-anim');
            void container.offsetWidth; // force reflow to restart animation if needed
            container.classList.add('win-anim');
            result_ref.classList.remove('pop-lose');
            result_ref.classList.add('pop-win');
            // show win popup
            if (winPopup) {
                // clear existing timer
                if (popupTimer) clearTimeout(popupTimer);
                winPopup.setAttribute('aria-hidden','false');
                winPopup.classList.add('show');
                // auto-hide after 1.6s
                popupTimer = setTimeout(() => {
                    winPopup.classList.remove('show');
                    winPopup.setAttribute('aria-hidden','true');
                    popupTimer = null;
                }, 1600);
            }
            break;
        case 'lose':
            result_ref.style.cssText = "background-color: #ffdde0; color: #d32f2f";
            result_ref.innerHTML = "YOU LOSE";
            computer_score++;
            // add lose animation
            container.classList.remove('win-anim');
            void container.offsetWidth;
            container.classList.add('lose-anim');
            result_ref.classList.remove('pop-win');
            result_ref.classList.add('pop-lose');
            break;
        default:
            result_ref.style.cssText = "background-color: #e5e5e5; color: #808080";
            result_ref.innerHTML = "DRAW";
            // clear any result animation classes for draw
            result_ref.classList.remove('pop-win','pop-lose');
            break;
    }

    document.getElementById("computer_score").innerHTML = computer_score;
    document.getElementById("user_score").innerHTML = user_score;
}

// Attach click handlers to weapon buttons (buttons have data-choice attributes)
const weaponButtons = document.querySelectorAll('.weapons button');
weaponButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice; // 'rock', 'paper' or 'scissor'
        if (choice) checker(choice);
    });
});

// Remove animation classes after the animations finish so they can be retriggered
if (container) {
    container.addEventListener('animationend', (e) => {
        if (e.animationName === 'winPulse' || e.animationName === 'loseShake') {
            container.classList.remove('win-anim','lose-anim');
        }
    });
}

if (result_ref) {
    result_ref.addEventListener('animationend', (e) => {
        if (e.animationName === 'resultPopWin' || e.animationName === 'resultPopLose') {
            result_ref.classList.remove('pop-win','pop-lose');
        }
    });
}

// Popup close button and click-to-close
if (winPopup) {
    const closeBtn = winPopup.querySelector('.close-popup');
    if (closeBtn) closeBtn.addEventListener('click', () => {
        winPopup.classList.remove('show');
        winPopup.setAttribute('aria-hidden','true');
        if (popupTimer) { clearTimeout(popupTimer); popupTimer = null; }
    });
    // also close if clicking outside the card
    winPopup.addEventListener('click', (e) => {
        if (e.target === winPopup) {
            winPopup.classList.remove('show');
            winPopup.setAttribute('aria-hidden','true');
            if (popupTimer) { clearTimeout(popupTimer); popupTimer = null; }
        }
    });
}
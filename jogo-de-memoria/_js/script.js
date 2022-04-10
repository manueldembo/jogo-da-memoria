const FRONT = "card_front";
const BACK = "card_back";
const CARD = 'card';
const ICON = "icon";

startGame();

function startGame () {
    game.readKeyMove();
    initializeCards(game.createCardsFromEmojis());
    showCards();
}

function initializeCards (cards) {
    let gameBoard =  document.getElementById("gameBoard");
    gameBoard.innerHTML = '';
    
    game.cards.forEach(card => {
        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.dataset.icon = card.icon;

        createCardContent(card, cardElement);
        
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    })
}

function createCardContent (card, cardElement) {
    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);
}

function createCardFace (face, card, element) {
    let cardElementFace = document.createElement('div');
    cardElementFace.classList.add(face);

    if (face === FRONT) {
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        iconElement.src = "_images/" + card.icon + ".png";
        cardElementFace.appendChild(iconElement);
    } else {
        cardElementFace.innerHTML = '&lt/&gt';
    }

    element.appendChild(cardElementFace);
}

function flipCard () {
    game.move++;

    if (game.setCard(this.id)) {
        this.classList.add('flip');

        if(game.secondCard){
            if (game.checkMatch()) {
                game.clearCards();
                
                if (game.checkGameOver()) {
                    let gameOverLayer = document.getElementById('gameOver');
                    gameOverLayer.style.display = 'flex';
                }
            } else {
                setTimeout(() => {
                    let firstCardView = document.getElementById(game.firstCard.id);
                    let secondCardView = document.getElementById(game.secondCard.id);

                    firstCardView.classList.remove('flip');
                    secondCardView.classList.remove('flip');
                    game.unflipCards();
                }, 1000);   
            }
        }
    }
}  

function restart () {
    game.clearCards();
    game.saveScore();
    startGame();
    let gameOverLayer = document.getElementById('gameOver');
    gameOverLayer.style.display = 'none';
}

function showCards () {
    game.cards.forEach(card => {
        let cardView = document.getElementById(card.id);
        cardView.classList.add('flip');
    })
    
    setTimeout(() => {
        game.cards.forEach(card => {
            let cardView = document.getElementById(card.id);
            cardView.classList.remove('flip');
        })
    }, 500); 
}


function showScore() {
    $('#scoreScreen').slideDown();   
    createScoreScreen();
}
function createScoreScreen () {
    let scoreScreen = document.getElementById('scoreScreen');
    scoreScreen.innerHTML = '';

    let closeElement = document.createElement('div');
    closeElement.addEventListener('click', closeScoreScreen);
    closeElement.id = "closeScoreScre";
    closeElement.innerText = 'X';

    let resetElement = document.createElement('button');
    resetElement.addEventListener('click', resetScore);
    resetElement.id = 'reset';
    resetElement.innerText = 'reset'

    let srceenElement = document.createElement('div');
    srceenElement.id = 'srceen';
    srceenElement.innerHTML = '<p>Pontuações:<p>'

    let scores = game.orderScores();
    let count = 1;

    scores.forEach(move => {
        let newP = document.createElement('p');
        newP.innerHTML = `${count++}º${move} movimentos.`;
        srceenElement.appendChild(newP);
    });
    
    scoreScreen.appendChild(resetElement);
    scoreScreen.appendChild(closeElement);
    scoreScreen.appendChild(srceenElement);
}


function closeScoreScreen() {
    $('#scoreScreen').slideUp();
}

function resetScore () {
    if (confirm('Deseja mesmo apagar suas pontuações?')) {
        localStorage.clear();
        showScore();
        setTimeout(alert('Pontuações apgadas com sucesso.'), 500);
    }
}
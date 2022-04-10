let game = {
    lockMode: false,
    firstCard: null,
    secondCard: null,
    emojis: [
        'emo-01',
        'emo-02',
        'emo-03',
        'emo-04',
        'emo-05',
        'emo-06',
        'emo-07',
        'emo-08',
        'emo-09',
        'emo-10'
    ],
    move: 0,
    keyMove: 0,
    cards: null,
    
    orderScores() {
        let scores = [];
        let quantScore = localStorage.getItem('key');
        parseInt(quantScore);
    
        for(let i = 1; i <= quantScore; i++){
            scores.push(localStorage.getItem(i));
        }
        
        return scores.sort();
    },    
    saveScore () {
        localStorage.setItem(this.keyMove, this.move);
        localStorage.setItem('key', this.keyMove);
        this.move = 0;
        this.keyMove++;
    },
    readKeyMove (){
        try{
            this.keyMove = localStorage.getItem('key');
            parseInt(this.keyMove);
            this.keyMove++;
        } catch { 
            localStorage.setItem('key', this.keyMove);
        }
    },
    setCard: function (id) {
        let card = this.cards.filter(card => card.id === id)[0];

        if(card.flipped || this.lockMode){
            return false;
        }
        
        if(!this.firstCard){
            this.firstCard = card;
            this.firstCard.flipped = true;
            return true;
        } else {
            this.secondCard = card;
            this.secondCard.flipped = true;
            this.lockMode = true;
            return true;
        }

    },

    checkMatch: function () {
        if(!this.firstCard || !this.secondCard) return;

        return this.firstCard.icon === this.secondCard.icon;
    },

    clearCards: function () {
        this.firstCard = null;
        this.secondCard = null;
        this.lockMode = false;
    },

    unflipCards: function() {
        this.firstCard.flipped = false;
        this.secondCard.flipped = false;
        this.clearCards();
    },

    checkGameOver() {
        return this.cards.filter(card => !card.flipped).length === 0;
    },

    createCardsFromEmojis: function () {
        this.cards = [];
    
        this.emojis.forEach(emoji => {
            this.cards.push(this.createPairFromEmoji(emoji));
        })
        this.cards = this.cards.flatMap(pair => pair);
        this.shuffleCards();
        return this.cards;
    },
    
    createPairFromEmoji: function (emoji){
        return [{
            id: this.createIdWithEmoji(emoji),
            icon: emoji,
            flipped: false
        }, {
            id: this.createIdWithEmoji(emoji),
            icon: emoji,
            flipped: false
        }]
    },
    
    createIdWithEmoji: function (emoji) {
        return emoji + parseInt(Math.random() * 1000);
    },

    shuffleCards: function () {
        let currentIndex = this.cards.length;
        let randomIndex = 0;
    
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.cards[currentIndex], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[currentIndex]];
        }
    }
}

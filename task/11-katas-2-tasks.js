'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    const figures = {
        ' _ | ||_|' : 0,
        '     |  |' : 1,
        ' _  _||_ ' : 2,
        ' _  _| _|' : 3,
        '   |_|  |' : 4,
        ' _ |_  _|' : 5,
        ' _ |_ |_|' : 6,
        ' _   |  |' : 7,
        ' _ |_||_|' : 8,
        ' _ |_| _|' : 9
    }
    
    const arr = bankAccount.split('\n').slice(0, 3).map(x => x.match(/.{3}/g))
      
    return parseInt(arr[0].map((_, index) => figures[arr.map(row => row[index]).join('')]).join(''))
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    while(text.length){
        let value = columns;
        
        if(text.length > value){
            while(text[value] !== ' '){
                value -= 1;
            }
        }
          
        yield text.slice(0, value);
        value += 1;
        text = text.slice(value);        
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const cards = {
        'A': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'J': 11,
        'Q': 12,
        'K': 13
    }

    const suits = hand.map(function (card) {
        return card[card.length - 1];
    });

    const ranks = hand.map(function (card) {
        let str = card.substring(0, card.length - 1);
        return cards[str];
    });

    const ofKind = nOfKind();

    if(isFlush() && isStraight())return PokerRank.StraightFlush;
    if(isFlush()) return PokerRank.Flush;
    if(isStraight()) return PokerRank.Straight;
    if(ofKind.includes(4)) return PokerRank.FourOfKind;
    if(ofKind.includes(3) && ofKind.includes(2)) return PokerRank.FullHouse;
    if(ofKind.includes(3)) return PokerRank.ThreeOfKind;
    if(ofKind.indexOf(2) !== ofKind.lastIndexOf(2)) return PokerRank.TwoPairs;
    if(ofKind.includes(2)) return PokerRank.OnePair;

    return PokerRank.HighCard;   

    function isFlush() {
        let suit = suits[0];

        return suits.every(function (item) {
            return (item === suit);
        });
    }

    function isStraight() {
        ranks.sort((a, b) => a - b);

        if(ranks[0] === 1 && ranks[4] === 13) {
            ranks.shift();
            ranks.push(14);
        }

        for (let i = 1; i < ranks.length; i++) {
            if (ranks[i] != ranks[i - 1] + 1) {
                return false;
            }
        }

        return true;
    }

    function nOfKind() {
        const ofKind = [];
        const checkedItems = [];

        for(let i = 0; i < ranks.length; i++) {
            let c = ranks.reduce(function(count, item) {
                if(checkedItems.includes(ranks[i])) return count;

                if(ranks[i] == item) return ++count;
                else return count;
            }, 0);

            ofKind.push(c);
            checkedItems.push(ranks[i]);
        }

        return ofKind;
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    const Arrtmp = figure.split('\n');
    const pluses = [];
    const horizontalLines = [];
    const rectangles = [];

    for (let i = 0; i < Arrtmp.length; i++) {
        for (let j = 0; j < Arrtmp[0].length; j++) {
            if (Arrtmp[i][j] === '+') {
                pluses.push({x: j, y: i});
            }
        }
    }

    for (let i = 0; i < pluses.length; i++) {
        for (let j = i + 1; j < pluses.length; j++) {
            if (pluses[i].y === pluses[j].y) {
                if (checkHorizontalLine(Arrtmp, pluses[i], pluses[j]))
                    horizontalLines.push([pluses[i], pluses[j]]);
            }
        }
    }

    for (let i = 0; i < horizontalLines.length; i++) {
        for (let j = i + 1; j < horizontalLines.length; j++) {
            if (checkRectangle(Arrtmp, horizontalLines[i], horizontalLines[j])) {
                rectangles.push([horizontalLines[i], horizontalLines[j]]);
            }
        }
    }

    for (let i = 0; i < rectangles.length; i++) {
        let rectangle = drawRectangle(rectangles[i]);

        yield rectangle;
    }
}

function checkHorizontalLine(Arrtmp, s, f) {
    for (let i = s.x; i <= f.y; i++) {
        if (Arrtmp[s.y][i] !== '-' && Arrtmp[s.y][i] !== '+') return false;
    }
    return true;
}

function checkRectangle(Arrtmp, top, bottom) {
    if (top[0].x !== bottom[0].x) return false;

    if (top[1].x !== bottom[1].x) return false;

    const leftX = top[0].x;
    const rightX = top[1].x;
    const topY = top[0].y;
    const bottomY = bottom[0].y;

    for (let j = leftX + 1; j < rightX; j++)
        if (Arrtmp[topY][j] === '+' && Arrtmp[bottomY][j] === '+') {
            let hasWhiteSpace = false;

            for (let i = topY + 1; i < bottomY; i++)
                if (Arrtmp[i][j] === ' ') hasWhiteSpace = true;


            if (!hasWhiteSpace) return false;
        }

    for (let i = topY + 1; i < bottomY; i++) {
        if (Arrtmp[i][leftX] !== '|' && Arrtmp[i][leftX] !== '+') return false;

        if (Arrtmp[i][rightX] !== '|' && Arrtmp[i][rightX] !== '+') return false;

        for (let j = leftX + 1; j < rightX; j++) {
            if (Arrtmp[i][j] !== ' ') return false;
        }
    }

    return true;
}

function drawRectangle(item) {
    let width = item[0][1].x - item[0][0].x + 1;
    let height = item[1][0].y - item[0][0].y + 1;
    let result = '';
    let topLine = '+' + ('-').repeat(width - 2) + '+' + '\n';

    result += topLine;
    result += ( '|' + (' ').repeat(width - 2) + '|' + '\n' ).repeat(height - 2);
    result += topLine;

    return result;
}

module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
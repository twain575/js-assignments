'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    const sides = [ 'N', 'NbE', 'NNE', 'NEbN', 'NE', 'NEbE', 'ENE', 
                    'EbN', 'E', 'EbS', 'ESE', 'SEbE', 'SE', 'SEbS', 
                    'SSE', 'SbE', 'S', 'SbW', 'SSW', 'SWbS', 'SW', 
                    'SWbW', 'WSW', 'WbS', 'W', 'WbN', 'WNW', 'NWbW', 
                    'NW', 'NWbN', 'NNW', 'NbW' ];
    const res = [];
    let deg = 0.00;

    for(let i = 0; i < sides.length; i++) {
        res.push({
            abbreviation: sides[i],
            azimuth: deg
        });

        deg += 11.25;
    }

    return res;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function expandBraces(str) {
    const output = []; 
    const input = [ str ];
  
    while(input.length > 0){
        const e = input.shift().split('');
        const st = e.indexOf('{');

        if(st > -1){
            let count = 0; 

            for(let i = st; i < e.length; i++){
                if(e[i] === '{') count++;

                if(e[i] === '}') count--;

                if(count > 1 && e[i] === ',') e[i] = '\t';

                if(count === 0){
                    const tmp = e.slice(st + 1, i).join('').split(',');

                    for(var it of tmp){
                        if(!it.includes('{') && !it.includes('}')) {
                            input.push(e.join('').replace(e.slice(st, i + 1).join(''), it));
                        } else {
                            input.push(e.join('').replace(e.slice(st, i + 1).join(''), it.replace(/\t/g, ',')));
                        }
                    }
                    
                    break;
                }
            }
        }
        else{
            output.push(e.join(''));
        }
    }

    return output;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    const arr = Array.from({ length: n });

    for (let i = 0; i < n; i++) {
        arr[i] = Array.from({ length: n });
    }

    let i = 1;
    let j = 1;

    for (let e = 0; e < n * n; e++) {
        arr[i - 1][j - 1] = e;
        if ((i + j) % 2 == 0) {
            if (j < n) j++;
            else i += 2;
            if (i > 1) i--;
        } else {
            if (i < n) i++;
            else j += 2;
            if (j > 1) j--;
        }
    }
    return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    const stack = [];
    stack.push(dominoes.pop());

    let checkForLooping;

    while (dominoes.length) {
        dominoes.forEach((domino, index) => {
            if (stack[0][0] === domino[0]) {
                stack.unshift(domino.reverse());
                dominoes.splice(index, 1);
            } else if (stack[0][0] === domino[1]) {
                stack.unshift(domino);
                dominoes.splice(index, 1);
            } else if (stack[stack.length - 1][1] === domino[0]) {
                stack.push(domino);
                dominoes.splice(index, 1);
            } else if (stack[stack.length - 1][1] === domino[1]) {
                stack.push(domino.reverse());
                dominoes.splice(index, 1);
            }
        });

        if (checkForLooping === dominoes.length) break;

        checkForLooping = dominoes.length;
    }
    return !!(!dominoes.length);
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    const arr = [];
    for (let i = 0; i < nums.length; i++) {
        const num1 = nums[i];
        let num2 = num1;

        while (i < nums.length && nums[i + 1] === num2 + 1) {
            i++;
            num2++;
        }

        if (num1 === num2) arr.push(num1);
        else if (num1 + 1 === num2) arr.push(num1, num2);
        else arr.push(num1+"-"+num2);
    }
    
    return arr.join(",");
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};

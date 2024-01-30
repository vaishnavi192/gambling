const prompt = require("prompt-sync")();
const ROWS = 3;
const COLS = 3; //when defining global variables we have to write in all caps

const SYMBOLS_COUNT = {
    A:2,
    B:4,
    C:6,
    D:8,
};
const SYMBOL_VALUE = {
    A:5,
    B:4,
    C:3,
    D:2,
};
//deposit money
const deposit = () => {
    while (true) {
        const depositAmount = prompt("enter amount to deposit: ");
        const numberDepositAmount = parseFloat(depositAmount); //to convert string to integer

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("enter a valid number");
        } else {
            return numberDepositAmount;
        }
    }
}; 
//determine no. of lines to bet on 
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines= parseFloat (lines);
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};
//collect bet amount 
const getBet = (balance,lines) => {
    while (true) {
    const bet = prompt("Enter the total bet: ");
    const numberBet= parseFloat (bet);
    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) { //max bet amount that you can bet will be the bet amount 
    //divided by no. of lines and not like this numberBet > balance
    console.log("Invalid bet, try again.");
    } else {
    return numberBet;
        }
    }
};
//generate the reels for spin
// const spinWheel = () => {
//     const wheel = [];
//     for (let i = 0; i < COLS; i++) {
//         const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
//         wheel.push(SYMBOLS[randomIndex]);
//     }
//     return wheel;
// };  given by copilot using 1 for loop 
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i =0 ; i < count; i++){
            symbols.push(symbol);  //array mein add kardiya symbols with count ko i.e. A,A,B,B,B,B,C,C,C,C,C,C,D,D,D,D,D,D,D,D
        }
    }
//const reels = [[], [], []]; instead of doing this we will use push function to push array inside array jisse ki
// 3 se zyaada na ho
    const reels =[];
    for (let i=0; i<COLS; i++){
        reels.push([]); //i =0 means first reel or array, i = 1 means second array or reel and so on
//for every single reel we have limited no. of symbols isliye har ek reel mein copy karenge ...symbola suse karke 
//aur use hone ke baad symbols hata te jaenge to globally delte nhi honge locally single reel ke liye delete hote jaenge
//isliye columns ke andar define karenge 
    const reelSymbols = [...symbols];
    for (let j=0; j<ROWS; j++){
//now we will randomly select symbol from this array using indexing, math.random generates a random number between
// 0 and less than 1 reelSymbol.length tell max no. of index that can be generated, maths.floor rounds down 
//the number so 1.9 = 1 and not 2
    const randomIndex = Math.floor(Math.random() * reelSymbols.length);
    reels[i].push(reelSymbols[randomIndex]); 
    //another way to write
    // const randomIndex = Math.floor(Math.random() * reelSymbols.length);
    // const selectedSymbol = reelSymbols[randomIndex];
    // reels[i].push(selectedSymbol); ofc easy
    reelSymbols.splice(randomIndex, 1); //remove symbols that we can't select again, 1 means remove 1 element

    }
}
return reels;
};

const transpose = (reels) =>{
    const rows = [];
    for (let i = 0; i<ROWS; i++) { //transpose lene ke liye ham element uthaenge reels mein se aur ek naye array ROWS 
        //me push krte jaenge
        rows.push([]) 
        for(let j = 0; j<COLS; j++){
            rows[i].push(reels[j][i]); //[j][i] tells address li reels ke iss address se symbol lena hai aur row ke i 
            //mein daal den ahai
        }
    }
    return rows;

};
//now we want to make it look like slot machine A | B | C aise 
// += meaning adding strings for eg A + A = AA 
const printRows = (rows) => { 
    for (const row of rows) {
        let rowString = " ";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol //symbol add krte rahega ek hee row mein, i.e. row ke array mei
            if (i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
} 
//check if the user won
const getWinnings = (rows, bet, lines) => {
    let winnings =0;
    for (let row = 0; row < lines; row++ ){
        const symbols = rows[row]; //yahan index mtlb row hai to rows ke index mein symbols store karliye
        //to check if symbols are same 
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]){ //0 index se compare karenge ki sab same hai ya nhi  
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings += bet * SYMBOL_VALUE[symbols[0]]; //symbols[0] means first symbol of the row coz sabhi same 
            //hee to rahenge to 0 index wala hee leliya
    }
}
return winnings;
};
const game = () => {
    let balance = deposit();
while(true){
    console.log("you have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet (balance, numberOfLines);
    balance -= bet * numberOfLines; 
    const reels = spin();
    const rows= transpose(reels);
    printRows(rows);
    const winnings = getWinnings (rows, bet, numberOfLines);
    balance += winnings; //jitna jeeta utna add krdiya balance mein
    console.log("You won, $" + winnings.toString());
    //ask for play again 
    if (balance <= 0) {
        console.log("no money left");
        break;
    }
    const playAgain = prompt("do you want to play again? (y/n) ");
    if (playAgain != "y") break;
    }
};

game();

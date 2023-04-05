const fs = require("fs")
const readLine = require("readline")

const wordSearches = () =>{

    //create a hiddenWords array, read from the 'words.dic' file and store its contents in the hiddenWords array
    let hiddenWords = readFile('./words.dic')
    
    // create a rows grid, read from the 'grid' file and store its contents in the grid array, line by line
    const grid = readFile('./grid')
    
    // setting a Timeout to 50 ms, just to allow the operations performed on the 2 files (reading from file and wrinting to our hiddenWords and grid arrays) to complete
    setTimeout(() =>{
        checkGrid(grid, hiddenWords)
    } , 50)
}

// first function called by wordSearches()
function checkGrid(rowsGrid, hiddenWordsArr){

    // using the original grid, create a second grid that transforms the argument's columns into rows, so that we can easily traverse the columns
    const columnsGrid = turnColumnsToRows(rowsGrid)

    // traversing the rowsGrid line by line and searching for the hidden words inside each line, left-to-right and right-to-left
    // if any words are found, remove them from the hiddenWords
    for(const line of rowsGrid){
        checkLine(line, hiddenWordsArr)
    }

    // same thing for the columnsGrid
    for(const line of columnsGrid){
        checkLine(line, hiddenWordsArr)
    }

    // print the hiddenWordsArr with the unfound words
    console.log(hiddenWordsArr)
}

// function to transform a grid by replacing its rows with its columns
function turnColumnsToRows(initialGrid){
    const columnsGrid = []
    for(let i = 0; i < initialGrid[0].length; i++){
        columnsGrid[i] = [] 
        for(let j = 0; j < initialGrid.length; j++){
            columnsGrid[i].push(initialGrid[j][i])
        }
         columnsGrid[i] = columnsGrid[i].join("")   
    }

    return columnsGrid
}

// function to check each line, and corresponding reversed line, for words that are inside the array passed as a param. 
// Removes any words that are found inside the line from the array and returns the updated array
function checkLine(line, hiddenWordsArr) {
    const reverseLine = line.split("").reverse().join("")
    for (let i = 0; i < hiddenWordsArr.length; i++) {
        if (line.includes(hiddenWordsArr[i]) || reverseLine.includes(hiddenWordsArr[i])) {
            hiddenWordsArr.splice(i, 1)
        }
    }
    return hiddenWordsArr
}

// function that reads the file passed as the second param, writes its contents into the array passed as the first param and returns the array
function readFile(file) {
    const arrWords = [] 
    const lineReader = readLine.createInterface({
        input:  fs.createReadStream(file)
    })

    lineReader.on('line', function (text) {
        arrWords.push(text)
    })
    return arrWords
}

wordSearches()

module.exports = wordSearches
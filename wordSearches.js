const fs = require("fs");
const readLine = require("readline");

const wordSearches = () => {
  //create a hiddenWords array, read from the 'words.dic' file and store its contents in the hiddenWords array
  let hiddenWords = readFile("./words.dic");

  // create a rows grid, read from the 'grid' file and store its contents in the grid array, line by line
  const grid = readFile("./grid");

  // setting a Timeout to 50 ms, just to allow the operations performed on the 2 files (reading from file and wrinting to our hiddenWords and grid arrays) to complete
  setTimeout(() => {
    checkGrid(grid, hiddenWords);
  }, 50);
};

// first function called by wordSearches()
function checkGrid(rowsGrid, hiddenWordsArr) {
  // console.log(rowsGrid)

  // using the original grid, create a second grid that transforms the columns into rows, so that we can easily traverse them
  let columnsGrid = turnColumnsToRows(rowsGrid);

  // change the names from hiddenWords found in the grid to uppercase
  // first: the names found inside columns
  turnWordsToUpperCase(columnsGrid, hiddenWordsArr);
  // console.log(columnsGrid)

  // then rotate the upper-converted columns back into rows
  rowsGrid = turnColumnsToRows(columnsGrid);
  // console.log(rowsGrid)

  // then convert the names inside the rows to uppercase => now we have all names from the hiddenNamesArr that are found in columns or rows converted to uppercase
  turnWordsToUpperCase(rowsGrid, hiddenWordsArr);
  // console.log(rowsGrid)

  // *INTERMEDIATE* extract all the diagonals, so we can check them against the list of words
  const diagonals = extractDiagonals(rowsGrid);
  // console.log(diagonals)

  // convert the hidden names found inside diagonals to upprCase => now we have ALL hidden names to uppercase inside the diagonals array
  // now we only need to insert the array of diagonals back into the original grid
  turnWordsToUpperCase(diagonals, hiddenWordsArr);
  // console.log(diagonals)

  // (at this point we should have ALL the hidden words in uppercase inside the diagonals grid - including those found inside rows and columns)
  // >> So far, I've only managed to include half the diagonals  - The ones parallel to HOOH, but not those parallel to ABSOL <<
  // insert the uperCase-updated diagonals grid intro the original grid, so that we can display it
  const finalGrid = insertDiagonalsBackIntoGrid(diagonals, rowsGrid);

  // traversing the rowsGrid line by line and searching for the hidden words inside each line, left-to-right and right-to-left
  // if any words are found, remove them from the hiddenWords
  for (const line of rowsGrid) {
    checkLine(line, hiddenWordsArr);
  }
  // same thing for the columnsGrid
  for (const line of columnsGrid) {
    checkLine(line, hiddenWordsArr);
  }
  // same thing for all the diagonals
  for (const diag of diagonals) {
    checkLine(diag, hiddenWordsArr);
  }
  // print the hiddenWordsArr with the unfound words
  console.log(finalGrid, hiddenWordsArr);
}

// =====>>>> !!!! THIS FUNCTION IS A WORK IN PROGRESS !!!! <<<<=======   ======>>>>> !!!!  CHANTIER  !!!! <<<<======
// function to turn diagonals grid back into original grid (and transform the hidden words to upperCase)
function insertDiagonalsBackIntoGrid(diags, grid) {
  let finalGrid = [];
  // find the biggest diagonal inside diags, so we can set the row length of our finalGrid to its length
  let biggestDiag = diags[0];
  for (let i = 0; i < diags.length / 2; i++) {
    if (diags[i].length > biggestDiag.length) {
      biggestDiag = diags[i];
    }
  }
  // console.log(diags)

  // traverse the diagonals grid and recreate the original Grid from it, with the hidden words in UPPER CASE
  for (let i = 0; i < diags.length / 2; i++) {
    let row = "";
    let tempI = i;
    let tempJ = 0;
    while (
      tempI + tempJ <= (biggestDiag.length - 1) * 2 &&
      tempI >= 0 &&
      tempJ >= 0 &&
      finalGrid.length < grid.length
    ) {
      if (tempI >= biggestDiag.length) {
        row += diags[tempI][tempJ];
        if (row.length === biggestDiag.length) {
          break;
        }
        tempI++;
      } else {
        row += diags[tempI][tempJ];
        tempI++;
        tempJ++;
        if (tempJ === biggestDiag.length || tempI === biggestDiag.length) {
          tempJ--;
        }
      }
    }
    finalGrid.push(row);
  }

  return finalGrid;

  //.filter(elem => elem.length >= 1)
}
// =====>>>> !!!! THIS FUNCTION IS A WORK IN PROGRESS !!!! <<<<=======   ======>>>>> !!!!  CHANTIER  !!!! <<<<======

// function to turn words present both in the grid and in the words array to upperCase (only affects rows and columns, not diagonals)
function turnWordsToUpperCase(grid, wordsArr) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < wordsArr.length; j++) {
      let reversed = grid[i].split("").reverse().join("");

      if (grid[i].includes(wordsArr[j])) {
        grid[i] = grid[i].replace(wordsArr[j], wordsArr[j].toUpperCase());
      }
      if (reversed.includes(wordsArr[j])) {
        grid[i] = grid[i].replace(
          wordsArr[j].split("").reverse().join(""),
          wordsArr[j].split("").reverse().join("").toUpperCase()
        );
      }
    }
  }
}

// function to extract all diagonals from grid
function extractDiagonals(grid) {
  const diags = [];

  // etract upper left-side diagonals
  for (let i = 0; i < grid.length; i++) {
    let tempI = i;
    let tempJ = 0;
    let diag = "";
    while (tempI >= 0 && tempJ < grid[i].length) {
      diag += grid[tempI][tempJ];
      tempI--;
      tempJ++;
    }
    diags.push(diag);
  }

  // console.log(diags)

  // extract lower right-side diagonals
  for (let i = 1; i < grid.length; i++) {
    let tempI = grid.length - 1;
    let tempJ = i;
    let diag = "";
    while (tempI >= 0 && tempJ < grid[i].length) {
      diag += grid[tempI][tempJ];
      tempI--;
      tempJ++;
    }
    diags.push(diag);
  }
  // console.log(diags)

  // extract upper right-side diagonals
  for (let i = 0; i < grid.length; i++) {
    let tempI = 0;
    let tempJ = grid.length - 1 - i;
    let diag = "";
    while (tempJ < grid.length) {
      diag += grid[tempI][tempJ];
      tempI++;
      tempJ++;
    }
    diags.push(diag);
  }

  // console.log(diags)

  // extract lower left-side diagonals
  for (let i = 1; i < grid.length; i++) {
    let tempI = i;
    let tempJ = 0;
    let diag = "";
    while (tempI < grid.length) {
      diag += grid[tempI][tempJ];
      tempI++;
      tempJ++;
    }
    diags.push(diag);
  }

  // console.log(diags)
  // diags = diags.filter(elem => elem.length >= 4)
  return diags;
}

// function to transform a grid by replacing its rows with its columns
function turnColumnsToRows(initialGrid) {
  const columnsGrid = [];
  for (let i = 0; i < initialGrid[0].length; i++) {
    columnsGrid[i] = [];
    for (let j = 0; j < initialGrid.length; j++) {
      columnsGrid[i].push(initialGrid[j][i]);
    }
    columnsGrid[i] = columnsGrid[i].join("");
  }

  return columnsGrid;
}

// function to check each line, and corresponding reverse line, for words that are inside the array
// Removes any words that are found inside the line from the array and returns the updated array
function checkLine(line, hiddenWordsArr) {
  let reverseLine = line.split("").reverse().join("");
  for (let i = 0; i < hiddenWordsArr.length; i++) {
    if (
      line.toLowerCase().includes(hiddenWordsArr[i]) ||
      reverseLine.toLowerCase().includes(hiddenWordsArr[i])
    ) {
      hiddenWordsArr.splice(i, 1);
    }
  }
}

// function that reads a file, writes its contents into the array and returns the array
function readFile(file) {
  const arrWords = [];
  const lineReader = readLine.createInterface({
    input: fs.createReadStream(file),
  });

  lineReader.on("line", function (text) {
    arrWords.push(text);
  });

  return arrWords;
}

wordSearches();

module.exports = wordSearches;

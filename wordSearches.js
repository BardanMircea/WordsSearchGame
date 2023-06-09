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
  // *BEGINNER*
  // using the original grid, create a second grid that transforms the columns into rows, so that we can easily traverse them
  const columnsGrid = turnColumnsToRows(rowsGrid);

  // change the names from hiddenWords found in the grid to UPPERCASE
  // first: the names found inside columns
  turnWordsToUpperCase(columnsGrid, hiddenWordsArr);
  // console.log(columnsGrid)

  // then rotate the UPPERCASE-converted columns back into rows
  rowsGrid = turnColumnsToRows(columnsGrid);
  // console.log(rowsGrid)

  // then convert the names inside the rows to uppercase => now we have all names from the hiddenNamesArr that are found in columns or rows converted to uppercase
  turnWordsToUpperCase(rowsGrid, hiddenWordsArr);
  // console.log(rowsGrid)

  // *INTERMEDIATE* extract all the diagonals, so we can check them against the list of words
  const diagonals = extractDiagonals(rowsGrid);
  // console.log(diagonals)

  // convert the hidden names found inside diagonals to upperCase => we now have ALL the hidden names in uppercase inside the diagonals array
  turnWordsToUpperCase(diagonals, hiddenWordsArr);
  // console.log(diagonals)

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

  // *ADVANCED* merge the uperCase-updated diagonals grid intro the original grid, so that we can display it
  // (Reminder: at this point we should have ALL the hidden words in uppercase inside the diagonals grid - including those found inside rows and columns)
  const finalGrid = mergeDiagonalsGridIntoOriginalGrid(diagonals);

  // print the grid with the hidden words to UpperCase
  for (elem of finalGrid) {
    console.log(elem);
  }
  // and the hiddenWordsArr with the remaining words (that weren't found inside the grid)
  console.log(hiddenWordsArr);
}

// function to merge diagonals grid into the original grid (and restore the updated elements to their original position)
function mergeDiagonalsGridIntoOriginalGrid(diags) {
  let firstPart = mergeUpperRighToLowerLeftDiags();
  // console.log(firstPart)

  let secondPart = mergeUpperLeftToLowerRightDiags();
  // console.log(secondPart)

  const finalGrid = mergeTheTwoPartsTogether();

  return finalGrid;

  // function to merge the 2 updated diagonalGrids into one final and complete grid
  function mergeTheTwoPartsTogether() {
    const finalGrid = [];
    for (let i = 0; i < firstPart.length; i++) {
      finalGrid[i] = [];
      for (let j = 0; j < firstPart[i].length; j++) {
        if (firstPart[i][j] != secondPart[i][j]) {
          finalGrid[i][j] = firstPart[i][j].toUpperCase();
        } else {
          finalGrid[i][j] = firstPart[i][j];
        }
      }
      finalGrid[i] = finalGrid[i].join("");
    }
    return finalGrid;
  }

  // function to merge the updated left-side diagonals grid into the final grid
  function mergeUpperLeftToLowerRightDiags() {
    let grid = [];
    // find the biggest diagonal inside diags, so we can set the row, column and grid length of our grid to its length (since we know we are dealing with a perfect square)
    const gridLength = findGridLength();

    // traverse the second part of the diagonals grid and change the positions to those in the original Grid, with the hidden words in UPPER CASE
    for (let i = 0; i < gridLength; i++) {
      let row = "";
      let tempI = gridLength - 1 + i;
      let tempJ = 0;
      while (tempI < diags.length / 2) {
        if (tempI < tempJ) {
          break;
        }
        if (tempI <= gridLength - 1) {
          row += diags[tempI + diags.length / 2][tempJ]; // adding diags.length/2 to the value of tempI because we are traversing the second half of the diags grid, which starts at index 27
          tempI--;
        } else {
          row += diags[tempI + diags.length / 2][tempJ];
          tempI--;
          tempJ++;
        }
      }
      grid.push(row);
    }
    return grid;
  }

  // function to merge the updated right-side diagonals grid into the final grid
  function mergeUpperRighToLowerLeftDiags() {
    let grid = [];
    // find the biggest diagonal inside diags, so we can set the row, column and grid length of our grid to its length (since we know we are dealing with a perfect square)
    const gridLength = findGridLength();
    // console.log(gridLength)

    // traverse the first part of the diagonals grid and change the positions to those in the original Grid, with the hidden words in UPPER CASE
    for (let i = 0; i < gridLength; i++) {
      let row = "";
      let tempI = i;
      let tempJ = 0;
      while (
        tempI + tempJ <= (gridLength - 1) * 2 &&
        tempJ >= 0 &&
        grid.length < gridLength
      ) {
        if (tempI >= gridLength) {
          row += diags[tempI][tempJ];
          if (row.length === gridLength) {
            break;
          }
          tempI++;
        } else {
          row += diags[tempI][tempJ];
          tempI++;
          tempJ++;
          if (tempJ === gridLength || tempI === gridLength) {
            tempJ--;
          }
        }
      }
      grid.push(row);
    }
    return grid;
  }

  // function to find the row, column and grid length of our grid, by finding the longest line in our diags grid
  function findGridLength() {
    let biggestDiag = diags[0];
    for (let i = 0; i < diags.length / 2; i++) {
      if (diags[i].length > biggestDiag.length) {
        biggestDiag = diags[i];
      }
    }
    return biggestDiag.length;
  }
}

// function to turn the words present both inside the grid and inside the words array, to upperCase
function turnWordsToUpperCase(grid, wordsArr) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < wordsArr.length; j++) {
      let reversed = grid[i].split("").reverse().join("");

      if (grid[i].includes(wordsArr[j])) {
        grid[i] = grid[i].replace(wordsArr[j], wordsArr[j].toUpperCase());
      } else if (reversed.includes(wordsArr[j])) {
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

// function to check each line, and corresponding reverse line, for the hidden words that are inside the hiddenWordsArray
// Removes any words that are found inside the line from the array
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

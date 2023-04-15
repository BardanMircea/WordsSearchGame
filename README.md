# WordsSearchGame

Context:
A word search is small game where you are given a grid of letters, in a seemingly chaotic order, and your goal is to find specific words that are hidden in the grid.

For this first short project, I will code a program that solves word searches!

It comes with two files:

A file named words.dic, that will contain a list of words that may be present in the grid,
A file grid, that contains the grid of letters. All lines in the grid have the same length.

The program will look for the given words in the grid, and will print the words (there can be 1 or many) that have not been found in the grid. \
Those words will be printed in the order they are encountered in the words.dic list.

Step 1 
For the first step of the project, I will look for the hidden words on the vertical and horizontal axi only, but in both directions. To be perfectly clear, this means that the hidden words can be found from left-to-right, from right-to-left, from top-to-bottom and finally from bottom-to-top.


Step 2 - Intermediate
Let's spice things up by adding diagonals!

To validate this step, the program must be able to detect words that are present at the diagonals level (in ALL diagonals, the 2 main ones, as well as all the secondary ones) from top-to-bottom as well as bottom-to-top.

Step 3 - Advanced
For this final step, the program will print back the grid after having replaced all the hidden words by their uppercase version. Only letters that are not part of any words should remain in lowercase.

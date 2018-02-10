const inquirer = require('inquirer')

// This holds the data for seating
let seatingChart

// Initial questions posed to user go here
const questions = [
  {
    type: 'input',
    name: 'rows',
    message: 'How many rows of seats to you have?'
  },
  {
    type: 'input',
    name: 'seatsPerRow',
    message: 'How many seats in each row?'
  }
]

inquirer.prompt(questions).then(answers => {
  // Reply to user with total number of rows, seats per row, and seats.
  const outputStr = `You have ${answers.rows} rows and ${
    answers.seatsPerRow
  } seats per row for a total of ${answers.rows * answers.seatsPerRow} seats.`

  // Pass values to makeSeatingChart function
  seatingChart = makeSeatingChart(answers.rows, answers.seatsPerRow)

  console.log(seatingChart)
  console.log(outputStr)
})

const makeSeatingChart = (rows, seatsPerRow) => {
  // Create two dimensional array to represent seating
  let seatingChart = new Array(rows)
  for (let i = 0; i < rows; i++) {
    seatingChart[i] = new Array(seatsPerRow)
    for (let j = 0; j < seatsPerRow; j++) {
      seatingChart[i][j] = 0
    }
  }

  return seatingChart
}

const reserveSeat = (arr, row, column) => {
  // Check to see if seat exists. Is seat open? Return true. Else, return false
  return arr.length < row && arr[row].column < column && arr[row][column] === 0
}

const findSeats = (arr, numOfSeats) => {
  // Find optimum seat (middle of row 1)
  const optimumSeat = Math.round(arr[1].length / 2)
  // Find contiguous seats closes to optimum seat
  // return range of seats or not available
  // If seats open, reserve seats
  for (let i = 0; i < columnNumbers; i++) {
    reserveSeat(arr, row, column)
  }
}

const seatsRemaining = arr => {
  // Return number of open seats
}

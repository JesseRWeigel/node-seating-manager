const inquirer = require('inquirer')
const distance = require('manhattan')

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

const questionsTwo = [
  {
    type: 'input',
    name: 'row',
    message: 'What row is the seat in that you would like to reserve?'
  },
  {
    type: 'input',
    name: 'seat',
    message: 'What seat would you like to reserve in this row?'
  }
]

const questionsThree = [
  {
    type: 'input',
    name: 'seats',
    message: 'How many seats would you like? (Max of 10)'
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

  inquirer.prompt(questionsTwo).then(answersTwo => {
    seatingChart = reserveSeat(seatingChart, answersTwo.row, answersTwo.seat)
    console.log(seatingChart)
  })
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
  if (arr.length > row && arr[row].length > column && arr[row][column] === 0) {
    const newArr = arr
    newArr[row][column] = 1
    seatsRemaining(newArr)
    return newArr
  }
  console.log('So sorry. That seat is not available.')
  seatsRemaining(arr)
  return arr
}

const findSeats = (arr, numOfSeats) => {
  let seatNumbers = []
  // Reject requests for more than 10 seats
  if (numOfSeats > 10) {
    console.log('Sorry, no more than 10 seats can be reserved at one time.')
    return false
  }
  // Find optimum seat (middle of row 1)
  const optimumSeat = [0, Math.round(arr[1].length / 2)]
  // Find contiguous seats closest to optimum seat
  // Reject requests for more seats than one row can hold
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length < numOfSeats) {
      console.log(
        'Sorry, the rows are not long enough to accomidate that request.'
      )
      return false
    }

    // Skip to next row if there are not enough available seats
    if (arr[i].filter(item => item === 0).length < numOfSeats) {
      console.log('Not enough open seats in row ' + (i + 1))
      return false
    }
    // Reject requests if there are not that many contiguous seats available
    // loop over each row
    // make an array of all the contiguous seats that are open, if there are none return false
    // find manhattan distance of each of those seats
    // return the group of seats with that distance
    let count = 0
    let potentialSeatCombinations = []
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 0) {
        count = count + 1
      }
      // Save this seat to the seatNumbers array
      seatNumbers = [...seatNumbers, { row: i, column: j }]

      if (count == numOfSeats) {
        potentialSeatCombinations = [...potentialSeatCombinations, seatNumbers]
      }
      if (j + 1 !== arr[i].length && arr[i][j + 1] === 1) {
        console.log('delete count')
        count = 0
        return null
      }
      console.log(potentialSeatCombinations)
    }

    if (potentialSeatCombinations.length === 0) {
      console.log(potentialSeatCombinations)
      console.log('Sorry, we cannot fulfill that request.')
      seatsRemaining(arr)
    } else if (potentialSeatCombinations.length === 1) {
      potentialSeatCombinations[0].map(item =>
        reserveSeat(arr, item.row, item.column)
      )
    } else {
      let manhattanTotalsArr = []
      potentialSeatCombinations.map(item => {
        let manhattanTotal = 0
        item.map(
          seat =>
            manhattanTotal + distance(optimumSeat, [seat.row, seat.column])
        )
        manhattanTotalsArr = [...manhattanTotalsArr, manhattanTotal]
      })
      potentialSeatCombinations[
        potentialSeatCombinations.indexOf(Math.min(...manhattanTotalsArr))
      ].map(item => reserveSeat(arr, item.row, item.column))
    }
  }
}
// return range of seats or not available
// If seats open, reserve seats
const seatsRemaining = arr => {
  // Return number of open seats
  let openSeats = 0
  arr.map(
    row => (openSeats = openSeats + row.filter(item => item === 0).length)
  )
  console.log('Open Seats: ' + openSeats)
  inquirer.prompt(questionsThree).then(answersThree => {
    findSeats(arr, answersThree.seats)
  })
}

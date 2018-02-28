/*
  ShowClix Interview Puzzle created in node
  https://www.showclix.com/static/puzzle.html
  TODO: Work on validation of inputs
*/

// Load inquirer module for command prompts
const inquirer = require('inquirer')

// Initialize seating chart
const seatingChart = []

// Get basic layout of seats
const initialSetup = [{
  type: 'input',
  name: 'rows',
  message: 'How many rows do you have?'
},
{
  type: 'input',
  name: 'chairsPerRow',
  message: 'How many chairs in each row?'
}
]

/*
  Get string for initial reservations (format: R1C4 R1C6 R2C3 R2C7 R3C9 R3C10)
  This maybe blank
  *TODO: Handle blank input
*/
const reservations = [{
  type: 'input',
  name: 'seats',
  message: 'Initial reservations?'
}]

const requestedSeats = [{
  type: 'input',
  name: 'number',
  message: 'Number of seats?'
}]

/*
  Create prompt from users
  TODO: Handle input validation
*/
inquirer.prompt(initialSetup).then(answers => {
  // Reply to user with total number of rows, seats per row, and seats.
  createSeatingChart(answers.rows, answers.chairsPerRow)

  inquirer.prompt(reservations).then(reserved => {
    reservedSeats(reserved.seats)

    inquirer.prompt(requestedSeats).then(request => {
      findSeats(request.number)
    })
  })
})

/* FUNCTIONS */
// Create seating chart from 1st two prompts
// For each chair initialize its value as  Manhattan Score
const createSeatingChart = (rows, chairs) => {
  const centerChair = Math.floor(chairs / 2)
  for (let r = 0; r < rows; r++) {
    const rowArray = []
    for (let c = 0; c < chairs; c++) {
      const manhattanDistance = Math.abs(c - centerChair) + r
      rowArray.push(manhattanDistance)
    }
    seatingChart.push(rowArray)
  }
  remainingSeats(seatingChart)
}

// Counts seats that have a number value(have not been taken)
const remainingSeats = (seatingArray) => {
  let openSeat = 0
  seatingArray.forEach(function (row) {
    row.forEach(function (chair) {
      openSeat += Number(chair >= 0)
    })
  })
  console.log(seatingChart)
  console.log(`${openSeat} seat(s) are available.`)
}

/*
  Takess the reservation string and splits it to be parsed
  Ex: R1C1 R1C4 R2C5
*/
const reservedSeats = (result) => {
  const reservedSeats = result.split(' ')
  // Splits the string by SPACE into an array of seats
  // EX: ['R1C1', 'R1C4', 'R1C5']
  for (const seat of reservedSeats) {
    // Split each seat into its row and chair element
    // EX: 1 1, 1 4, 1 5
    const chair = seat.split('C')[1] - 1
    const row = seat.split('C')[0].substr(1, 2) - 1
    // Then update seating chart with an 'x' to show it's been reserved
    updateSeatingChart(row, chair, 'r')
  }
  // Count remaining seats
  remainingSeats(seatingChart)
}
/*
  I'm not happy with the way I did this but it works.
  Solution to find available blocks of seats
*/
const findSeats = (seats) => {
  // Initalize an array of groups of seats with a default score of 999
  // The score is the sum of the Manhattan scores for each chair
  let possibleGroups = [[], 999]
  // Number of requested seast from prompt
  const wantedSeats = Number(seats)
  // Cycle through each row of the seating chart
  for (let r = 0; r < seatingChart.length; r++) {
    // Starting with the first chair, create an array of chairs (group)
    // that is the length of wantedSeats
    for (let c = 0; c < (seatingChart[r].length - wantedSeats); c++) {
      const group = seatingChart[r].slice(c, (c + wantedSeats))
      // For each group, if any chais are taken, throw the group out
      if (group.indexOf('r') === -1 && group.indexOf('o') === -1) {
        // Sum the manhattan score for each chair in the group
        const score = group.reduce(add, 0)
        if (score < possibleGroups[1]) {
          // If the Manhattan score of the group is lower than the
          // current best, replace it with the row, starting chair,
          // and score ([[0, 6], 6]])
          possibleGroups = [[r, c], score]
        }
      }
    }
  }
  // If the requested group of seats is not available
  // log `Not Available`, then remaining seats then quit
  if (possibleGroups[1] === 999) {
    console.log(`Not Available`)
    remainingSeats(seatingChart)
    return
  }

  // Takes the returned group ([[0, 6], 6]) and
  // finds the row & starting chair
  const row = possibleGroups[0][0]
  const start = possibleGroups[0][1]
  // For each chair in the group, update the value with a 'o'
  for (let seat = start; seat < start + wantedSeats; seat++) {
    updateSeatingChart(row, seat, 'o')
  }
  // Log out the group in the format of R1C7 - R1C9
  // TODO: Fix if only one seat is requested
  console.log(`R${row + 1}C${start + 1} - R${row + 1}C${start + wantedSeats}`)
  remainingSeats(seatingChart)

  // Loop to ask for next group requested
  inquirer.prompt(requestedSeats).then(request => {
    findSeats(request.number)
  })

  // .reduce function for summing Manhattan scores
  function add (a, b) { return a + b }
}

// Update each chair when reserved or requested
const updateSeatingChart = (row, chair, flag) => {
  seatingChart[row][chair] = flag
  return seatingChart
}

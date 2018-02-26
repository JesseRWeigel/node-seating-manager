const inquirer = require('inquirer')

const seatingChart = []

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
const createSeatingChart = (rows, chairs) => {
  const centerChair = Math.floor(chairs / 2)
  for (let r = 0; r < rows; r++) {
    const rowArray = []
    for (let c = 0; c < chairs; c++) {
      const manhattanDistance = Math.abs(c - centerChair) + r
      rowArray.push(manhattanDistance)
    }
    seatingChart.push(rowArray)
    console.log(rowArray)
  }
  remainingSeats(seatingChart)
  return seatingChart
}

const remainingSeats = (seatingArray) => {
  let openSeat = 0
  seatingArray.forEach(function (row) {
    row.forEach(function (chair) {
      openSeat += Number(chair >= 0)
    })
  })
  console.log(`${openSeat} seat(s) are available.`)
}

const reservedSeats = (result) => {
  const reservedSeats = result.split(' ')
  for (const seat of reservedSeats) {
    const chair = seat.split('C')[1] - 1
    const row = seat.split('C')[0].substr(1, 2) - 1
    updateSeatingChart(row, chair, 'x')
  }
  remainingSeats(seatingChart)
}
// R1C4 R1C6 R2C3 R2C7 R3C9 R3C10
const findSeats = (seats) => {
  let possibleGroups = [[], 999]
  const wantedSeats = Number(seats)
  function add (a, b) { return a + b }
  for (let r = 0; r < seatingChart.length; r++) {
    for (let c = 0; c < (seatingChart[r].length - wantedSeats); c++) {
      const group = seatingChart[r].slice(c, (c + wantedSeats))
      if (group.indexOf('x') === -1 && group.indexOf('o') === -1) {
        const score = group.reduce(add, 0)
        if (score < possibleGroups[1]) {
          possibleGroups = [[r, c], score]
        }
      }
    }
  }
  if (possibleGroups[1] === 999) {
    console.log(`Not Available`)
    return
  }

  const row = possibleGroups[0][0] + 1
  const start = possibleGroups[1] + 1
  for (let seat = start; seat < start + wantedSeats; seat++) {
    updateSeatingChart(row - 1, seat - 1, 'o')
  }
  console.log(`R${row}C${start} - R${row}C${start + wantedSeats - 1}`)
  console.log(seatingChart)
  remainingSeats(seatingChart)
}

const updateSeatingChart = (row, chair, flag) => {
  seatingChart[row][chair] = flag
  // remainingSeats(seatingChart) // Removed return
}

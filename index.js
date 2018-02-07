const inquirer = require('inquirer')

// This holds the data for seating
const seatingChart = []

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
  const outputStr = `You have ${answers.rows} rows and ${answers.seatsPerRow} seats per row for a total of ${answers.rows * answers.seatsPerRow} seats.`

  console.log(outputStr)
})

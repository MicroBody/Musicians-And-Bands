const readline = require('readline');
const fs = require('fs');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input and return a promise
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Band class
class Band {
  constructor(name) {
    this.name = name;
    this.members = [];
  }

  addMember(musician) {
    if (!this.members.includes(musician)) {
      this.members.push(musician);
      musician.addBand(this);
    }
  }

  removeMember(musician) {
    const index = this.members.indexOf(musician);
    if (index !== -1) {
      this.members.splice(index, 1);
      musician.removeBand(this);
    }
  }
}

// Musician class
class Musician {
  constructor(name, birthYear) {
    this.name = name;
    this.birthYear = birthYear;
    this.bands = [];
  }

  addBand(band) {
    if (!this.bands.includes(band)) {
      this.bands.push(band);
      band.addMember(this);
    }
  }

  removeBand(band) {
    const index = this.bands.indexOf(band);
    if (index !== -1) {
      this.bands.splice(index, 1);
      band.removeMember(this);
    }
  }

  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  }
}


// Function to save data to JSON file
function saveData(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filename}`);
}

// Function to load data from JSON file
function loadData(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error loading data from ${filename}: ${err.message}`);
    return [];
  }
}

// Example usage
const bands = loadData('bands.json');
const musicians = loadData('musicians.json');

// Prompt and handle user input to perform desired operations on bands and musicians

// ...

// After performing operations, load the updated data
loadData('bands.json', bands);
loadData('musicians.json', musicians);

// Example usage
async function runProgram() {
  const bands = loadData('bands.json');
  const musicians = loadData('musicians.json');

  let exit = false;
  while (!exit) {
    console.log('1. Create new band');
    console.log('2. Remove band');
    console.log('3. Create new musician');
    console.log('4. Remove musician');
    console.log('5. Add musician to band');
    console.log('6. Remove musician from band');
    console.log('7. Show musician information');
    console.log('0. Exit');

    const choice = await prompt('Enter your choice: ');

    switch (choice) {
      case '1':
        // Create new band
        const bandName = await prompt('Enter band name: ');
        const band = new Band(bandName);
        bands.push(band);
        break;

      case '2':
        // Remove band
        const bandToRemove = await prompt('Enter band name to remove: ');
        const bandIndex = bands.findIndex(band => band.name === bandToRemove);
        if (bandIndex !== -1) {
          bands.splice(bandIndex, 1);
        } else {
          console.log('Band not found');
        }
        break;

      // Rest of the cases...

      case '0':
        exit = true;
        break;

      default:
        console.log('Invalid choice');
        break;
    }
  }

  // Save the updated data
  saveData('bands.json', bands);
  saveData('musicians.json', musicians);

  rl.close();
}

runProgram().catch(console.error);
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
  constructor(name, info, yearEstablished, yearDisbanded = null) {
    this.name = name;
    this.info = info;
    this.yearEstablished = yearEstablished;
    this.yearDisbanded = yearDisbanded;
    this.members = [];
    this.priorMembers = [];
  }

  addMember(musician, joinYear, instrument) {
    if (!this.members.some(member => member.musician === musician)) {
      this.members.push({ musician, joinYear, instrument });
      musician.addBand(this, joinYear);
    }
  }

  removeMember(musician, leaveYear) {
    const index = this.members.findIndex(member => member.musician === musician);
    if (index !== -1) {
      const [member] = this.members.splice(index, 1);
      member.leaveYear = leaveYear;
      this.priorMembers.push(member);
      musician.removeBand(this, leaveYear);
    }
  }

  getMemberInfo() {
    return this.members.map(member => {
      const musician = member.musician;
      return `Name: ${musician.name}, Joined: ${member.joinYear}, Instrument: ${member.instrument}`;
    }).join('\n');
  }

  getPriorMemberInfo() {
    return this.priorMembers.map(member => {
      const musician = member.musician;
      return `Name: ${musician.name}, Left: ${member.leaveYear}`;
    }).join('\n');
  }
}

// Musician class
class Musician {
  constructor(name, information, birthYear, bands = [], previousBands = [], instrument) {
    this.name = name;
    this.information = information;
    this.birthYear = birthYear;
    this.bands = [];
    this.previousBands = [];
    this.instruments = instrument;
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

  addPreviousBand(band) {
    if (!this.previousBands.includes(band)) {
      this.previousBands.push(band);
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

// ...

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
        const bandInfo = await prompt('Enter band info: ');
        const yearEstablished = parseInt(await prompt('Enter year established: '));
        const yearDisbanded = parseInt(await prompt('Enter year disbanded (optional, leave blank if active): ')) || null;
        const band = new Band(bandName, bandInfo, yearEstablished, yearDisbanded);
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

      case '3':
        // Create new musician
        const musicianName = await prompt('Enter musician name: ');
        const musicianInfo = await prompt('Enter musician information: ');
        const birthYear = parseInt(await prompt('Enter birth year: '));
        const instrument = await prompt('Enter musician instrument: ');
        const musician = new Musician(musicianName, musicianInfo, birthYear, [], [], instrument);
        musicians.push(musician);
        break;

      case '4':
        // Remove musician
        const musicianToRemove = await prompt('Enter musician name to remove: ');
        const musicianIndex = musicians.findIndex(musician => musician.name === musicianToRemove);
        if (musicianIndex !== -1) {
          musicians.splice(musicianIndex, 1);
        } else {
          console.log('Musician not found');
        }
        break;

      case '5':
        // Add musician to band
        const musicianToAdd = await prompt('Enter musician name to add: ');
        const bandToAddTo = await prompt('Enter band name to add musician to: ');
        const musicianIndexToAdd = musicians.findIndex(musician => musician.name === musicianToAdd);
        const bandIndexToAddTo = bands.findIndex(band => band.name === bandToAddTo);
        if (musicianIndexToAdd !== -1 && bandIndexToAddTo !== -1) {
          const musician = musicians[musicianIndexToAdd];
          const band = bands[bandIndexToAddTo];
          band.addMember(musician);
          console.log(`${musician.name} added to ${band.name}`);
        } else {
          console.log('Musician or band not found');
        }
        break;

      case '6':
        // Remove musician from band
        const musicianToRemoveFrom = await prompt('Enter musician name to remove from band: ');
        const bandToRemoveFrom = await prompt('Enter band name to remove musician from: ');
        const musicianIndexToRemoveFrom = musicians.findIndex(musician => musician.name === musicianToRemoveFrom);
        const bandIndexToRemoveFrom = bands.findIndex(band => band.name === bandToRemoveFrom);
        if (musicianIndexToRemoveFrom !== -1 && bandIndexToRemoveFrom !== -1) {
          const musician = musicians[musicianIndexToRemoveFrom];
          const band = bands[bandIndexToRemoveFrom];
          band.removeMember(musician);
          console.log(`${musician.name} removed from ${band.name}`);
        } else {
          console.log('Musician or band not found');
        }
        break;

      case '7':
        // Show musician information
        const musicianToShow = await prompt('Enter musician name to show information: ');
        const musicianIndexToShow = musicians.findIndex(musician => musician.name === musicianToShow);
        if (musicianIndexToShow !== -1) {
          const musician = musicians[musicianIndexToShow];
          console.log(`Name: ${musician.name}`);
          console.log(`Information: ${musician.information}`);
          console.log(`Birth Year: ${musician.birthYear}`);
          console.log(`Bands: ${musician.bands.map(band => band.name).join(', ')}`);
          console.log(`Previous Bands: ${musician.previousBands.map(band => band.name).join(', ')}`);
          console.log(`Instruments: ${musician.instruments});
        } else {
          console.log('Musician not found');
        }
        break;

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
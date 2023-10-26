const fs = require('fs');
const readline = require('readline');

// Band class
class Band {
  constructor(name) {
    this.name = name;
    this.members = [];
  }

  addMember(musician) {
    this.members.push(musician);
    musician.addBand(this);
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
    this.bands.push(band);
  }

  removeBand(band) {
    const index = this.bands.indexOf(band);
    if (index !== -1) {
      this.bands.splice(index, 1);
    }
  }

  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  }
}

// Program class
class Program {
  constructor() {
    this.bands = [];
    this.musicians = [];
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  start() {
    console.log('Welcome to the Band Management Program!');
    this.rl.question('What would you like to do? (1. Create Band, 2. Remove Band, 3. Create Musician, 4. Remove Musician, 5. Add Musician to Band, 6. Remove Musician from Band, 7. Exit): ', (answer) => {
      this.handleUserInput(answer);
    });
  }

  handleUserInput(answer) {
    switch (answer) {
      case '1':
        this.rl.question('Enter the name of the band: ', (name) => {
          this.createBand(name);
        });
        break;
      case '2':
        this.rl.question('Enter the name of the band to remove: ', (name) => {
          const band = this.findBandByName(name);
          if (band) {
            this.removeBand(band);
          } else {
            console.log('Band not found!');
          }
        });
        break;
      case '3':
        this.rl.question('Enter the name of the musician: ', (name) => {
          this.rl.question('Enter the birth year of the musician: ', (birthYear) => {
            this.createMusician(name, parseInt(birthYear));
          });
        });
        break;
      case '4':
        this.rl.question('Enter the name of the musician to remove: ', (name) => {
          const musician = this.findMusicianByName(name);
          if (musician) {
            this.removeMusician(musician);
          } else {
            console.log('Musician not found!');
          }
        });
        break;
      case '5':
        this.rl.question('Enter the name of the musician: ', (musicianName) => {
          const musician = this.findMusicianByName(musicianName);
          if (musician) {
            this.rl.question('Enter the name of the band: ', (bandName) => {
              const band = this.findBandByName(bandName);
              if (band) {
                this.addMusicianToBand(musician, band);
              } else {
                console.log('Band not found!');
              }
            });
          } else {
            console.log('Musician not found!');
          }
        });
        break;
      case '6':
        this.rl.question('Enter the name of the musician: ', (musicianName) => {
          const musician = this.findMusicianByName(musicianName);
          if (musician) {
            this.rl.question('Enter the name of the band: ', (bandName) => {
              const band = this.findBandByName(bandName);
              if (band) {
                this.removeMusicianFromBand(musician, band);
              } else {
                console.log('Band not found!');
              }
            });
          } else {
            console.log('Musician not found!');
          }
        });
        break;
      case '7':
        this.rl.close(); // Close the readline interface
        console.log('Exiting the program...');
        process.exit(); // Terminate the program
        break;
      default:
        console.log('Invalid input!');
        break;
    }
  }

  createBand(name) {
    const band = new Band(name);
    this.bands.push(band);
    this.saveBandsToFile();
    console.log(`Band "${name}" created successfully!`);
    this.start();
  }

  removeBand(band) {
    const index = this.bands.indexOf(band);
    if (index !== -1) {
      this.bands.splice(index, 1);
      this.saveBandsToFile();
      console.log(`Band "${band.name}" removed successfully!`);
    }
    this.start();
  }

  createMusician(name, birthYear) {
    const musician = new Musician(name, birthYear);
    this.musicians.push(musician);
    this.saveMusiciansToFile();
    console.log(`Musician "${name}" created successfully!`);
    this.start();
  }

  removeMusician(musician) {
    const index = this.musicians.indexOf(musician);
    if (index !== -1) {
      this.musicians.splice(index, 1);
      this.saveMusiciansToFile();
      console.log(`Musician "${musician.name}" removed successfully!`);
    }
    this.start();
  }

  addMusicianToBand(musician, band) {
    band.addMember(musician);
    this.saveBandsToFile();
    console.log(`Musician "${musician.name}" added to band "${band.name}" successfully!`);
    this.start();
  }

  removeMusicianFromBand(musician, band) {
    band.removeMember(musician);
    this.saveBandsToFile();
    console.log(`Musician "${musician.name}" removed from band "${band.name}" successfully!`);
    this.start();
  }

  findBandByName(name) {
    return this.bands.find((band) => band.name === name);
  }

  findMusicianByName(name) {
    return this.musicians.find((musician) => musician.name === name);
  }

  saveBandsToFile() {
    const bandsData = JSON.stringify(this.bands, null, 2);
    fs.writeFileSync('bands.json', bandsData);
  }

  saveMusiciansToFile() {
    const musiciansData = JSON.stringify(this.musicians, null, 2);
    fs.writeFileSync('musicians.json', musiciansData);
  }
}

// Usage example
const program = new Program();

// Load data from JSON files if they exist
if (fs.existsSync('bands.json')) {
  const bandsData = fs.readFileSync('bands.json');
  program.bands = JSON.parse(bandsData);
}

if (fs.existsSync('musicians.json')) {
  const musiciansData = fs.readFileSync('musicians.json');
  program.musicians = JSON.parse(musiciansData);
}

program.start();
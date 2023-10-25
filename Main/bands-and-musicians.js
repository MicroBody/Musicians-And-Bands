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

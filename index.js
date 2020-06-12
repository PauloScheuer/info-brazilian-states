import express from 'express';
import fs, { promises } from "fs";

const app = express();

app.use(express.json());

function getNumCities(state) {
  const path = `./files/${state}.json`;
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  return json.length;
}

function linkStatesWithNumCities() {
  const initialJson = fs.readFileSync('./Estados.json', 'utf8');

  const allInitials = JSON.parse(initialJson).map(state => {
    return state.Sigla;
  });
  const eachNum = allInitials.map(state => {
    return {
      state,
      numCities: getNumCities(state)
    }
  });
  return eachNum;
}

function getStatesWithMoreCities() {
  const eachNum = linkStatesWithNumCities();
  eachNum.sort((a, b) => {
    return b.numCities - a.numCities
  });
  const statesWithMoreCities = [
    eachNum[0],
    eachNum[1],
    eachNum[2],
    eachNum[3],
    eachNum[4]
  ]
  console.log(statesWithMoreCities);
}

function getStatesWithLessCities() {
  const eachNum = linkStatesWithNumCities();
  eachNum.sort((a, b) => {
    return a.numCities - b.numCities
  });
  const statesWithLessCities = [
    eachNum[4],
    eachNum[3],
    eachNum[2],
    eachNum[1],
    eachNum[0]
  ]
  console.log(statesWithLessCities);
}

function showStatesWithBigNameCities() {
  const initialJson = fs.readFileSync('./Estados.json', 'utf8');
  const allInitials = JSON.parse(initialJson).map(state => {
    return state.Sigla;
  });

  const statesWithCitiesOrderedBySize = allInitials.map(state => {
    const path = `./files/${state}.json`;
    const json = JSON.parse(fs.readFileSync(path, 'utf8'));
    const sortedJson = json.sort((a, b) => {
      return b.Nome.length - a.Nome.length
    });
    JSON.stringify(sortedJson);
    return {
      state: state,
      city: sortedJson[0].Nome,
    }

  });
  console.log(statesWithCitiesOrderedBySize);
}
function showStatesWithSmallNameCities() {
  const initialJson = fs.readFileSync('./Estados.json', 'utf8');
  const allInitials = JSON.parse(initialJson).map(state => {
    return state.Sigla;
  });

  const statesWithCitiesOrderedBySize = allInitials.map(state => {
    const path = `./files/${state}.json`;
    const json = JSON.parse(fs.readFileSync(path, 'utf8'));
    const sortedJson = json.sort((a, b) => {
      return a.Nome.length - b.Nome.length
    });
    JSON.stringify(sortedJson);
    return {
      state: state,
      city: sortedJson[0].Nome,
    }

  });
  console.log(statesWithCitiesOrderedBySize);
}

function biggestNameAll() {
  const initialJson = fs.readFileSync('./Estados.json', 'utf8');
  const allInitials = JSON.parse(initialJson).map(state => {
    return state.Sigla;
  });

  const statesWithCitiesOrderedBySize = allInitials.map(state => {
    const path = `./files/${state}.json`;
    const json = JSON.parse(fs.readFileSync(path, 'utf8'));
    const sortedJson = json.sort((a, b) => {
      return b.Nome.length - a.Nome.length
    });
    JSON.stringify(sortedJson);
    return {
      state: state,
      city: sortedJson[0].Nome,
    }
  });
  const biggestName = statesWithCitiesOrderedBySize.sort((a, b) => {
    return b.city.length - a.city.length;
  })
  console.log(biggestName[0]);
}
function smallestNameAll() {
  const initialJson = fs.readFileSync('./Estados.json', 'utf8');
  const allInitials = JSON.parse(initialJson).map(state => {
    return state.Sigla;
  });

  const statesWithCitiesOrderedBySize = allInitials.map(state => {
    const path = `./files/${state}.json`;
    const json = JSON.parse(fs.readFileSync(path, 'utf8'));
    const sortedJson = json.sort((a, b) => {
      return a.Nome.length - b.Nome.length
    });
    JSON.stringify(sortedJson);
    return {
      state: state,
      city: sortedJson[0].Nome,
    }
  });
  const smallestName = statesWithCitiesOrderedBySize.sort((a, b) => {
    return a.city.length - b.city.length;
  });
  const smallname = smallestName[0].city.length;
  const smallestNameAlpha = smallestName.filter(obj => {
    return obj.city.length === smallname;
  });
  smallestNameAlpha.sort((a, b) => {
    return (a.city > b.city) ? 1 : ((b.city > a.city) ? -1 : 0);
  })
  console.log(smallestNameAlpha[0]);
}

app.listen(3333, async () => {
  try {
    fs.readFileSync('./files/TO.json', 'utf8');
    getStatesWithMoreCities();
    getStatesWithLessCities();
    showStatesWithBigNameCities();
    showStatesWithSmallNameCities();
    biggestNameAll();
    smallestNameAll();
    console.log("Rodando...");
  } catch (err) {
    fs.readFile('./Estados.json', 'utf8', (err, data) => {
      JSON.parse(data).map(state => {
        const id = state.ID;
        const initials = state.Sigla;
        fs.readFile('./Cidades.json', 'utf8', (err, dataC) => {
          const thisCities = JSON.parse(dataC).filter(city => {
            return city.Estado === id;
          });
          const thisCitiesFixed = thisCities.map(city => {
            const { ID, Nome } = city;
            return {
              ID,
              Nome
            }
          });
          fs.writeFileSync(`./files/${initials}.json`, JSON.stringify(thisCitiesFixed), 'utf8');
        });
      });
    });

    console.log("Reiniciando...");
  }
});

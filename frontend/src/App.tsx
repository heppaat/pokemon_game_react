import { useState, useEffect } from "react";
import { EnemyPokemon, Location, SingleLocation } from "./modell";
import { getLocations, getSingleLocation } from "./api";
import Encounter from "./components/Encounter";

const App = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location | null>(null);
  const [singleLocation, setSingleLocation] = useState<SingleLocation | null>(
    null
  );
  const [randomPokemon, setRandomPokemon] = useState<EnemyPokemon | null>(null);

  const handleGetLocations = async () => {
    const response = await getLocations();
    if (!response.success) return;
    const Locations = response.data;
    setLocations(Locations);
    setStartGame(true);
  };

  const handleBackToMainPage = () => {
    setStartGame(false);
    setLocations(null);
  };

  const handleGetSingleLocation = async (url: string) => {
    const response = await getSingleLocation(url);
    if (!response.success) return;
    const singleLocationResult = response.data;
    setSingleLocation(singleLocationResult);
    console.log(singleLocationResult.pokemon_encounters);
  };

  const handleRandomEnemyPokemon = async () => {
    const length = singleLocation?.pokemon_encounters.length;
    if (!length) return;
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(length);
    const randomNumber = Math.floor(
      Math.random() * (maxFloored - minCeiled) + minCeiled
    );
    const enemyPokemon = singleLocation.pokemon_encounters[randomNumber];
    setRandomPokemon(enemyPokemon.pokemon);
  };

  useEffect(() => {
    if (singleLocation) {
      handleRandomEnemyPokemon();
    }
  });

  return (
    <>
      {!startGame && !locations && (
        <div>
          <h1>Pokemon Logo</h1>
          <button onClick={handleGetLocations}>Start Game</button>
        </div>
      )}

      {startGame && locations && !singleLocation && (
        <div>
          {locations.results.map((location, index) => (
            <div key={index}>
              <h2>{location.name}</h2>
              <p>{location.url}</p>
              <button onClick={() => handleGetSingleLocation(location.url)}>
                Select
              </button>
            </div>
          ))}
          <button onClick={handleBackToMainPage}>Back to main page</button>
        </div>
      )}

      {singleLocation && randomPokemon && (
        <div>
          <Encounter
            enemyPokemon={randomPokemon}
            backToLocations={() => setSingleLocation(null)}
          />
        </div>
      )}
    </>
  );
};

export default App;

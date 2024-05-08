import { useState, useEffect } from "react";
import { EnemyPokemon, Locations, SingleLocation } from "./modell";
import { getLocations, getSingleLocation } from "./api";
import Encounter from "./components/Encounter";
import logo from "./assets/logo.png";
import pikachu from "./assets/pikachu.png";

const App = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [locations, setLocations] = useState<Locations | null>(null);
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

  const getRandomEnemyPokemon = async () => {
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
      getRandomEnemyPokemon();
    }
  });

  return (
    <>
      {!startGame && !locations && (
        <main className="flex flex-col relative">
          <section className="flex justify-center p-10">
            <img src={logo} alt="pokemonLogo" />
          </section>
          <div className="flex justify-center gap-6 p-4">
            <section className="max-w-[300px] relative">
              <img src={pikachu} alt="pikachu" />
            </section>
            <section className="max-w-[250px] w-[200px] relative">
              <button
                className="bg-[#3b4cca] text-[#fbfff4] font-bold uppercase px-8 py-4 rounded-full absolute bottom-10"
                onClick={handleGetLocations}
              >
                Start Game
              </button>
            </section>
          </div>
        </main>
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

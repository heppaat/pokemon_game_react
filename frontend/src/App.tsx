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
              <img
                className="hover:scale-105 transition-scale duration-300 ease-in-out hover:rotate-2"
                src={pikachu}
                alt="pikachu"
              />
            </section>
            <section className="max-w-[250px] w-[200px] relative">
              <button
                className="bg-[#ff6596] uppercase font-semibold px-8 py-4 absolute bottom-10 shadow-3xl hover:bg-[#fa4c83] transition duration-200"
                onClick={handleGetLocations}
              >
                Start Game
              </button>
            </section>
          </div>
        </main>
      )}

      {startGame && locations && !singleLocation && (
        <main>
          <section className="flex justify-center">
            <div className={`flex justify-center p-5 w-[900px] m-5`}>
              <h1 className="text-center tracking-tight font-bold text-[58px]">
                CHOOSE YOUR AREA
              </h1>
            </div>
          </section>
          <div className="flex flex-wrap gap-8 p-8 justify-center">
            {locations.results.map((location, index) => (
              <div
                key={index}
                className={`flex flex-col justify-center items-center gap-5 w-[350px] h-[150px] bg-[#ff6596] hover:scale-105 hover:shadow-md duration-300 ease-in-out`}
              >
                <h2 className="font-semibold text-center px-4">
                  {location.name}
                </h2>

                <button
                  className="uppercase font-semibold tracking-wide bg-[#111a3b] px-4 py-3 text-[#ffde00] w-[250px]"
                  onClick={() => handleGetSingleLocation(location.url)}
                >
                  Go there
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center pb-40 m-10 relative">
            <button
              className="bg-[#00e8ff] uppercase font-semibold px-8 py-4 absolute shadow-3xl hover:bg-[#30d3e1] transition duration-200"
              onClick={handleBackToMainPage}
            >
              Back to main page
            </button>
          </div>
        </main>
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

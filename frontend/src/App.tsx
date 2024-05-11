import { useState, useEffect } from "react";
import { EnemyPokemon, Locations, SingleLocation } from "./modell";
import { getLocations, getSingleLocation } from "./api";
import Encounter from "./components/Encounter";
import logo from "./assets/logo.png";
import pikachu from "./assets/pikachu.png";
import { GradientColor } from "./enums";

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
        <main className="flex flex-col relative bg-[#ffde00]">
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
                className="bg-[#3b4cca] text-[#fbfff4] font-bold uppercase px-8 py-4 rounded-full absolute bottom-10 hover:scale-105 hover:bg-[#475bf3] hover:shadow-xl transition-scale duration-300 ease-in-out"
                onClick={handleGetLocations}
              >
                Start Game
              </button>
            </section>
          </div>
        </main>
      )}

      {startGame && locations && !singleLocation && (
        <main className="bg-[#ffde00]">
          <section className="flex justify-center">
            <div
              className={`flex justify-center p-10 w-[900px] m-10 rounded-3xl bg-[#ffffff]/25 shadow-md`}
            >
              <h1 className="text-center tracking-wider font-extrabold text-[58px]">
                CHOOSE YOUR LOCATION
              </h1>
            </div>
          </section>
          <div className="flex flex-wrap gap-8 p-8 justify-center">
            {locations.results.map((location, index) => (
              <div
                key={index}
                className={`flex flex-col justify-center items-center gap-5 w-[300px] h-[150px] rounded-2xl bg-gradient-to-b ${GradientColor.yellowToYellow}  hover:scale-105 hover:shadow-md duration-300 ease-in-out`}
              >
                <h2 className="uppercase font-semibold text-center px-4">
                  {location.name}
                </h2>
                <div
                  className={`bg-gradient-to-t ${GradientColor.blueToBlue} px-4 py-2 rounded-xl text-[#fbfff4]`}
                >
                  <button
                    className="uppercase font-medium tracking-wider"
                    onClick={() => handleGetSingleLocation(location.url)}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center m-10 pb-40">
            <div className="bg-[#C52018] rounded-full px-8 py-4 hover:scale-105 hover:bg-[#eb271c] hover:shadow-xl transition-scale duration-300 ease-in-out">
              <button
                className="text-[20px] text-[#fbfff4] font-medium uppercase"
                onClick={handleBackToMainPage}
              >
                Back to main page
              </button>
            </div>
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

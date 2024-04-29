import { useState } from "react";
import { Location, SingleLocation } from "./modell";
import { getLocations, getSingleLocation } from "./api";

const App = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location | null>(null);
  const [singleLocation, setSingleLocation] = useState<SingleLocation | null>(
    null
  );

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
  };

  return (
    <>
      {!startGame && !locations && (
        <div>
          <h1>Pokemon Logo</h1>
          <button onClick={handleGetLocations}>Start Game</button>
        </div>
      )}

      {startGame && locations && (
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

      {singleLocation && (
        <div>
          {singleLocation.pokemon_encounters.map((pokemon) => (
            <p>{pokemon.pokemon.name}</p>
          ))}
        </div>
      )}
    </>
  );
};

export default App;

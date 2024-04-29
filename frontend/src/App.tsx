import { useState } from "react";
import { Location } from "./modell";
import { getLocations } from "./api";

const App = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location | null>(null);

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
            </div>
          ))}
          <button onClick={handleBackToMainPage}>Back to main page</button>
        </div>
      )}
    </>
  );
};

export default App;

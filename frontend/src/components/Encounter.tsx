import { useEffect, useState } from "react";
import { getImageOfEnemyPokemon, getMyPokemons } from "../api";
import { EnemyPokemon, MyPokemon } from "../modell";
import Battle from "./Battle";

const Encounter = (props: {
  enemyPokemon: EnemyPokemon;
  backToLocations: () => void;
}) => {
  const { enemyPokemon, backToLocations } = props;

  const [imageOfEnemyPokemon, setImageOfEnemyPokemon] = useState<
    string | undefined
  >(undefined);
  const [myPokemons, setMyPokemons] = useState<MyPokemon[] | null>(null);
  const [myChoosenPokemon, setMyChoosenPokemon] = useState<MyPokemon | null>(
    null
  );

  const getIdFromUrl = (url: string) => {
    const id = url.split("/")[6];
    return id;
  };

  useEffect(() => {
    const enemyPokemonSprite = () => {
      try {
        const image = getImageOfEnemyPokemon(getIdFromUrl(enemyPokemon.url));
        setImageOfEnemyPokemon(image);
      } catch (error) {
        console.log(error);
      }
    };
    enemyPokemonSprite();
  }, [enemyPokemon.url]);

  const handleGetMyPokemons = async () => {
    const response = await getMyPokemons();
    if (!response.success) return;
    const myPokemonsData = response.data;
    setMyPokemons(myPokemonsData);
  };

  const handleChooseMyPokemon = (myPokemon: MyPokemon) => {
    setMyChoosenPokemon(myPokemon);
  };

  return (
    <>
      {!myPokemons && (
        <div className="flex flex-col items-center">
          <h1>{enemyPokemon.name}</h1>
          <p>{enemyPokemon.url}</p>
          <img src={imageOfEnemyPokemon} alt="enemyPokemon" />
          <button onClick={handleGetMyPokemons}>Choose your Pokemon</button>
          <button onClick={backToLocations}>Back to Locations</button>
        </div>
      )}

      {myPokemons && !myChoosenPokemon && (
        <div>
          {myPokemons.map((myPokemon, index) => (
            <div key={index} className="flex flex-col items-center m-4">
              <h1>{myPokemon.name}</h1>
              <p>{myPokemon.url}</p>
              <img src={myPokemon.spriteUrl} alt="myPokemon" />
              <button
                onClick={() =>
                  handleChooseMyPokemon({
                    name: myPokemon.name,
                    url: myPokemon.url,
                    spriteUrl: myPokemon.spriteUrl,
                  })
                }
              >
                Choose
              </button>
            </div>
          ))}
          <div className="flex justify-center">
            <button onClick={() => setMyPokemons(null)}>
              Back to enemy Pokemon
            </button>
          </div>
        </div>
      )}

      {myChoosenPokemon && (
        <main>
          <Battle
            randomEnemyPokemon={enemyPokemon}
            enemyImage={imageOfEnemyPokemon!}
            myPokemon={myChoosenPokemon}
            myAllPokemons={myPokemons!}
            backToLocations={backToLocations}
          />
        </main>
      )}
    </>
  );
};

export default Encounter;

import { useEffect, useState } from "react";
import { getImageOfEnemyPokemon, getMyPokemons } from "../api";
import { EnemyPokemon, MyPokemons } from "../modell";

const Encounter = (props: {
  enemyPokemon: EnemyPokemon;
  backToLocations: () => void;
}) => {
  const { enemyPokemon, backToLocations } = props;

  const [imageOfEnemyPokemon, setimageOfEnemyPokemon] = useState<
    string | undefined
  >(undefined);
  const [myPokemons, setMyPokemons] = useState<MyPokemons | null>(null);

  const getIdFromUrl = (url: string) => {
    const id = url.split("/")[6];
    return id;
  };

  useEffect(() => {
    const handleImageOfEnemyPokemon = async () => {
      try {
        const image = await getImageOfEnemyPokemon(
          getIdFromUrl(enemyPokemon.url)
        );
        setimageOfEnemyPokemon(image);
      } catch (error) {
        console.log(error);
      }
    };
    handleImageOfEnemyPokemon();
  }, [enemyPokemon.url]);

  const handleGetMyPokemons = async () => {
    const response = await getMyPokemons();
    if (!response.success) return;
    const myPokemonsData = response.data;
    setMyPokemons(myPokemonsData);
  };

  return (
    <>
      {!myPokemons && (
        <div className="flex flex-col items-center">
          <h1>{enemyPokemon.name}</h1>
          <p>{enemyPokemon.url}</p>
          <img src={imageOfEnemyPokemon} alt="enemyPokemon" />
          <button onClick={backToLocations}>Back to Locations</button>
          <button onClick={handleGetMyPokemons}>Choose your Pokemon</button>
        </div>
      )}

      {myPokemons && (
        <div>
          {myPokemons.map((myPokemon, index) => (
            <div key={index} className="flex flex-col items-center">
              <h1>{myPokemon.name}</h1>
              <p>{myPokemon.url}</p>
              <img src={myPokemon.spriteUrl} alt="myPokemon" />
            </div>
          ))}
          <div className="flex justify-center">
            <button onClick={() => setMyPokemons(null)}>
              Back to enemy Pokemon
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Encounter;

import { useEffect, useState } from "react";
import { getImageOfEnemyPokemon, getMyPokemons } from "../api";
import { EnemyPokemon, MyPokemon } from "../modell";

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
    const handleImageOfEnemyPokemon = () => {
      try {
        const image = getImageOfEnemyPokemon(getIdFromUrl(enemyPokemon.url));
        setImageOfEnemyPokemon(image);
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

  const handleChooseMyPokemon = (myPokemon: MyPokemon) => {
    setMyChoosenPokemon(myPokemon);
  };

  useEffect(() => {
    if (myChoosenPokemon) console.log(myChoosenPokemon);
  }, [myChoosenPokemon]);

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
          <div className="flex flex-wrap justify-around items-center gap-4">
            <div className="flex flex-col items-center">
              <h1>{enemyPokemon.name}</h1>
              <p>{enemyPokemon.url}</p>
              <img src={imageOfEnemyPokemon} alt="enemyPokemon" />
            </div>
            <div className="flex flex-col items-center">
              <h1>{myChoosenPokemon.name}</h1>
              <p>{myChoosenPokemon.url}</p>
              <img src={myChoosenPokemon.spriteUrl} alt="myPokemon" />
            </div>
          </div>
          <div className="flex justify-center">
            <button>Fight</button>
          </div>
        </main>
      )}
    </>
  );
};

export default Encounter;

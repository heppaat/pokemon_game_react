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
        <main>
          <section className="flex justify-center">
            <div className={`flex justify-center p-5 w-[900px] m-5`}>
              <h1 className="text-center tracking-tight font-bold text-[58px]">
                YOUR ENEMY
              </h1>
            </div>
          </section>
          <section className="flex flex-col justify-center items-center p-8">
            <div
              className={`bg-[#00e8ff] border-8 border-[#ff6596] hover:scale-105 hover:shadow-md duration-300 ease-in-out`}
            >
              <div className="flex justify-center">
                <h1 className="bg-[#ff6596] w-[175px] p-5 m-8 text-center font-bold tracking-wider text-[25px] shadow-md">
                  {enemyPokemon.name}
                </h1>
              </div>
              <img
                className="w-[250px]"
                src={imageOfEnemyPokemon}
                alt="enemyPokemon"
              />
            </div>
          </section>
          <section className="flex flex-col items-center">
            <button
              className="bg-[#ce74ff] uppercase font-semibold px-8 py-4 mb-10 mt-6 shadow-3xl hover:bg-[#bb53f3] transition duration-200"
              onClick={handleGetMyPokemons}
            >
              Choose your Own Pokemon
            </button>

            <button
              className="bg-[#00e8ff] uppercase font-semibold px-8 py-4 shadow-3xl hover:bg-[#30d3e1] transition duration-200"
              onClick={backToLocations}
            >
              Back to Locations
            </button>
          </section>
        </main>
      )}

      {myPokemons && !myChoosenPokemon && (
        <main>
          <section className="flex justify-center">
            <div className={`flex justify-center p-5 w-[900px] m-5`}>
              <h1 className="text-center tracking-tight font-bold text-[58px]">
                YOUR POKEMONS
              </h1>
            </div>
          </section>

          <div className="flex flex-wrap gap-8 p-8 justify-center">
            {myPokemons.map((myPokemon, index) => (
              <div key={index}>
                <div
                  className={`bg-[#00e8ff] border-8 border-[#ff6596] hover:scale-105 hover:shadow-md duration-300 ease-in-out`}
                >
                  <div className="flex justify-center">
                    <h1 className="bg-[#ff6596] w-[175px] p-5 m-8 text-center font-bold tracking-wider text-[25px] shadow-md">
                      {myPokemon.name}
                    </h1>
                  </div>
                  <img
                    className="w-[250px]"
                    src={myPokemon.spriteUrl}
                    alt="myPokemon"
                  />
                </div>
                <div className="flex justify-center items-center py-5">
                  <button
                    className="bg-[#ce74ff] uppercase font-semibold px-8 py-4 mb-10 mt-6 shadow-3xl hover:bg-[#bb53f3] transition duration-200"
                    onClick={() => handleChooseMyPokemon(myPokemon)}
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className="bg-[#00e8ff] uppercase font-semibold px-8 py-4 shadow-3xl hover:bg-[#30d3e1] transition duration-200"
              onClick={() => setMyPokemons(null)}
            >
              Back to enemy Pokemon
            </button>
          </div>
        </main>
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

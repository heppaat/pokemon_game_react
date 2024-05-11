import { useEffect, useState } from "react";
import { getImageOfEnemyPokemon, getMyPokemons } from "../api";
import { EnemyPokemon, MyPokemon } from "../modell";
import Battle from "./Battle";
import { GradientColor } from "../enums";

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
            <div
              className={`flex justify-center p-10 w-[800px] m-10 rounded-3xl  bg-[#ffffff]/25 shadow-md`}
            >
              <h1 className="text-center tracking-wider font-extrabold text-[58px]">
                ENEMY POKEMON
              </h1>
            </div>
          </section>
          <section className="flex flex-col justify-center items-center p-8">
            <div
              className={`bg-gradient-to-b ${GradientColor.magentaToMagenta} rounded-2xl hover:scale-105 hover:shadow-md duration-300 ease-in-out`}
            >
              <div className="flex justify-center pt-8">
                <h1 className="bg-[#ffffff]/50 w-[150px] p-3 text-center rounded-xl uppercase font-medium tracking-wider text-[20px] shadow-md">
                  {enemyPokemon.name}
                </h1>
              </div>
              <img
                className="w-[350px]"
                src={imageOfEnemyPokemon}
                alt="enemyPokemon"
              />
            </div>
          </section>
          <section className="flex flex-col items-center gap-6 m-8 pb-40">
            <div className="bg-[#3b4cca] rounded-full px-8 py-4 hover:scale-105 hover:bg-[#475bf3] hover:shadow-xl transition-scale duration-300 ease-in-out">
              <button
                className="text-[20px] text-[#fbfff4] font-medium uppercase"
                onClick={handleGetMyPokemons}
              >
                Choose your Own Pokemon
              </button>
            </div>
            <div className="bg-[#C52018] rounded-full px-8 py-4 hover:scale-105 hover:bg-[#eb271c] hover:shadow-xl transition-scale duration-300 ease-in-out">
              <button
                className="text-[20px] text-[#fbfff4] font-medium uppercase"
                onClick={backToLocations}
              >
                Back to Locations
              </button>
            </div>
          </section>
        </main>
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

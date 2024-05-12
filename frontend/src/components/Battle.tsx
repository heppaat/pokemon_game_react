import { useEffect, useState } from "react";
import { addWonPokemon, getStats } from "../api";
import { AllMyPokemons, EnemyPokemon, MyPokemon, Stats } from "../modell";

const Battle = (props: {
  randomEnemyPokemon: EnemyPokemon;
  enemyImage: string;
  myPokemon: MyPokemon;
  myAllPokemons: AllMyPokemons;
  backToLocations: () => void;
}) => {
  const {
    randomEnemyPokemon,
    enemyImage,
    myPokemon,
    myAllPokemons,
    backToLocations,
  } = props;

  type PokemonStat = {
    hp: number;
    attack: number;
    defense: number;
  };

  const [myStats, setMyStats] = useState<PokemonStat | null>(null);
  const [enemyStats, setEnemyStats] = useState<PokemonStat | null>(null);
  const [myTurn, setMyTurn] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(1);
  const [gameEnd, setGameEnd] = useState<boolean>(false);
  const [duplicateError, setDuplicateError] = useState<string>("");

  useEffect(() => {
    const fetchPokemonStats = async () => {
      const myResponse = await getStats(myPokemon.url);
      if (!myResponse.success) return;
      const myStatsData = myResponse.data;

      const findStats = (statName: string, statObject: Stats) => {
        let statNumber = 0;
        statObject.stats.forEach((element) => {
          if (element.stat.name === statName) {
            statNumber = element.base_stat;
          }
        });
        return statNumber;
      };

      const myPokemonsStats: PokemonStat = {
        hp: findStats("hp", myStatsData),
        attack: findStats("attack", myStatsData),
        defense: findStats("defense", myStatsData),
      };

      setMyStats(myPokemonsStats);

      const enemyResponse = await getStats(randomEnemyPokemon.url);
      if (!enemyResponse.success) return;
      const enemyStatsData = enemyResponse.data;

      const enemyPokemonStats: PokemonStat = {
        hp: findStats("hp", enemyStatsData),
        attack: findStats("attack", enemyStatsData),
        defense: findStats("defense", enemyStatsData),
      };

      setEnemyStats(enemyPokemonStats);
    };
    fetchPokemonStats();
  }, [myPokemon.url, randomEnemyPokemon.url]);

  //The damage is calculated using the following formula: ((((2/5+2)*B*60/D)/50)+2)*Z/255, where B is the attacker's Attack, D is defender's Defense, and Z is a random number between 217 and 255.

  const randomNumberGenerator = () => {
    const randomNumber = Math.floor(Math.random() * (255 - 217 + 1)) + 217;
    return randomNumber;
  };

  const battleFormula = (
    randomNumber: number,
    attack: number,
    defense: number
  ) => {
    if (!myStats || !enemyStats) return;

    const B: number = attack;
    const D: number = defense;
    const Z: number = randomNumber;

    const damage = ((((2 / 5 + 2) * B * 60) / D / 50 + 2) * Z) / 255;
    return damage;
  };

  const handleBattle = () => {
    if (myTurn) {
      if (myStats?.attack === undefined || enemyStats?.defense === undefined) {
        return;
      }
      const damage = battleFormula(
        randomNumberGenerator(),
        myStats.attack,
        enemyStats.defense
      );

      if (!enemyStats || !damage) return;

      const updatedEnemyHp = Math.round(Math.max(enemyStats.hp - damage, 0));

      setEnemyStats({
        hp: updatedEnemyHp,
        attack: enemyStats.attack,
        defense: enemyStats.defense,
      });
      setMyTurn(false);
    } else if (!myTurn) {
      if (enemyStats?.attack === undefined || myStats?.defense === undefined)
        return;

      const damage = battleFormula(
        randomNumberGenerator(),
        enemyStats.attack,
        myStats.defense
      );

      if (!myStats || !damage) return;

      const updatedMyHp = Math.round(Math.max(myStats.hp - damage, 0));

      setMyStats({
        hp: updatedMyHp,
        attack: myStats.attack,
        defense: myStats.defense,
      });
      setMyTurn(true);
    }
    setCounter(counter + 1);
  };

  useEffect(() => {
    if (myStats?.hp === 0) {
      setGameEnd(true);
    }
  }, [myStats]);

  const getIdFromUrl = (url: string) => {
    const id = url.split("/")[6];
    return id;
  };

  useEffect(() => {
    if (enemyStats?.hp === 0) {
      setGameEnd(true);

      if (
        myAllPokemons.some(
          (pokemon) => pokemon.name === randomEnemyPokemon.name
        )
      ) {
        setDuplicateError("this enemy Pokemon is already in your list");
        return;
      }

      addWonPokemon({
        name: randomEnemyPokemon.name,
        url: randomEnemyPokemon.url,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(
          randomEnemyPokemon.url
        )}.png`,
      });
      setDuplicateError("");
    }
  }, [
    enemyStats?.hp,
    randomEnemyPokemon.name,
    randomEnemyPokemon.url,
    myAllPokemons,
  ]);

  return (
    <>
      {!gameEnd && (
        <main>
          <section className="flex justify-center">
            <div className={`flex justify-center p-5 w-[900px] m-5`}>
              <h1 className="text-center tracking-tight font-bold text-[58px]">
                FIGHT!
              </h1>
            </div>
          </section>

          <div className="flex flex-wrap justify-around items-center">
            <div className="flex flex-col items-center bg-[#00e8ff] border-8 border-[#ff6596] hover:scale-105 hover:shadow-md duration-300 ease-in-out">
              <div className="flex justify-center">
                <h1 className="bg-[#ff6596] w-[175px] p-5 m-8 text-center font-bold tracking-wider text-[25px] shadow-md">
                  {randomEnemyPokemon.name}
                </h1>
              </div>
              <img className="w-[250px]" src={enemyImage} alt="enemyPokemon" />
              <div className="flex flex-col bg-[#111a3b] w-[150px] p-3 m-8 font-semibold text-[#ffde00] tracking-wide text-[15px] gap-1 shadow-md">
                <p>Hp: {enemyStats?.hp}</p>
                <p>Attack: {enemyStats?.attack}</p>
                <p>Defense: {enemyStats?.defense}</p>
              </div>
            </div>

            <div className="flex flex-col items-center bg-[#00e8ff] border-8 border-[#ff6596] hover:scale-105 hover:shadow-md duration-300 ease-in-out">
              <div className="flex justify-center ">
                <h1 className="bg-[#ff6596] w-[175px] p-5 m-8 text-center font-bold tracking-wider text-[25px] shadow-md">
                  {myPokemon.name}
                </h1>
              </div>
              <img
                className="w-[250px]"
                src={myPokemon.spriteUrl}
                alt="myPokemon"
              />
              <div className="flex flex-col bg-[#111a3b] w-[150px] p-3 m-8 font-semibold text-[#ffde00] tracking-wide text-[15px] gap-1 shadow-md">
                <p>Hp: {myStats?.hp}</p>
                <p>Attack: {myStats?.attack}</p>
                <p>Defense: {myStats?.defense}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center py-5">
            <button
              className="bg-[#ce74ff] uppercase font-semibold px-8 py-4 mb-10 mt-6 shadow-3xl hover:bg-[#bb53f3] transition duration-200"
              onClick={handleBattle}
            >
              ROUND {counter}
            </button>
          </div>
        </main>
      )}

      {gameEnd && !duplicateError && (
        <main>
          {myStats?.hp === 0 ? (
            <div>
              <h1>Game Over, You loose!</h1>
              <button onClick={backToLocations}>Start a new game</button>
            </div>
          ) : (
            <div>
              <h1>
                Congratulations, You won, enemy Pokemon is now in your list!
              </h1>
              <button onClick={backToLocations}>Start a new game</button>
            </div>
          )}
        </main>
      )}
      {duplicateError && (
        <div>
          <h1>Congratulations, You won, however {duplicateError}</h1>
          <button onClick={backToLocations}>Start a new game</button>
        </div>
      )}
    </>
  );
};

export default Battle;

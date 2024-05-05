import { useEffect, useState } from "react";
import { getStats } from "../api";
import { EnemyPokemon, MyPokemon, Stats } from "../modell";

const Battle = (props: {
  randomEnemyPokemon: EnemyPokemon;
  enemyImage: string;
  myPokemon: MyPokemon;
}) => {
  const { randomEnemyPokemon, enemyImage, myPokemon } = props;

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

  if (enemyStats?.hp === 0) {
    setGameEnd(true);
  }

  return (
    <>
      {!gameEnd && (
        <main>
          <div className="flex flex-wrap justify-around items-center gap-4">
            <div className="flex flex-col items-center">
              <h1>{randomEnemyPokemon.name}</h1>
              <p>{randomEnemyPokemon.url}</p>
              <img src={enemyImage} alt="enemyPokemon" />
              <p>Hp: {enemyStats?.hp}</p>
              <p>Attack: {enemyStats?.attack}</p>
              <p>Defense: {enemyStats?.defense}</p>
            </div>
            <div className="flex flex-col items-center">
              <h1>{myPokemon.name}</h1>
              <p>{myPokemon.url}</p>
              <img src={myPokemon.spriteUrl} alt="myPokemon" />
              <p>Hp: {myStats?.hp}</p>
              <p>Attack: {myStats?.attack}</p>
              <p>Defense: {myStats?.defense}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={handleBattle}>{counter}</button>
          </div>
        </main>
      )}

      {gameEnd && (
        <main>
          {myStats?.hp === 0 ? (
            <div>
              <h1>Game Over, You loose!</h1>
            </div>
          ) : (
            <div>
              <h1>Congratulations, You won!</h1>
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default Battle;

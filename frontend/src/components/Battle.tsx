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

  useEffect(() => {
    const allStats = async () => {
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
    allStats();
  }, [myPokemon.url, randomEnemyPokemon.url]);

  return (
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
        <button>Fight</button>
      </div>
    </main>
  );
};

export default Battle;

import { useEffect, useState } from "react";
import { getStats } from "../api";
import { EnemyPokemon, MyPokemon, Stats } from "../modell";

const Battle = (props: {
  randomEnemyPokemon: EnemyPokemon;
  enemyImage: string;
  myPokemon: MyPokemon;
}) => {
  const { randomEnemyPokemon, enemyImage, myPokemon } = props;

  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const allStats = async () => {
      const response = await getStats(myPokemon.url);
      if (!response.success) return;
      const statistics = response.data;
      setStats(statistics);
    };
    allStats();
  }, [myPokemon]);

  return (
    <main>
      <div className="flex flex-wrap justify-around items-center gap-4">
        <div className="flex flex-col items-center">
          <h1>{randomEnemyPokemon.name}</h1>
          <p>{randomEnemyPokemon.url}</p>
          <img src={enemyImage} alt="enemyPokemon" />
        </div>
        <div className="flex flex-col items-center">
          <h1>{myPokemon.name}</h1>
          <p>{myPokemon.url}</p>
          <img src={myPokemon.spriteUrl} alt="myPokemon" />
        </div>
      </div>
      <div className="flex justify-center">
        <button>Fight</button>
      </div>
    </main>
  );
};

export default Battle;

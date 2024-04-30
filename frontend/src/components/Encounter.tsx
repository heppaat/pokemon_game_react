import { useEffect, useState } from "react";
import { getImageOfEnemyPokemon } from "../api";
import { EnemyPokemon } from "../modell";

const Encounter = (props: {
  enemyPokemon: EnemyPokemon;
  backToLocations: () => void;
}) => {
  const { enemyPokemon, backToLocations } = props;

  const [imageOfEnemyPokemon, setimageOfEnemyPokemon] = useState<
    string | undefined
  >(undefined);

  const getIdFromUrl = (url: string) => {
    const id = url.split("/")[6];
    return id;
  };

  useEffect(() => {
    const handleImageOfEnemyPokemon = () => {
      const image = getImageOfEnemyPokemon(getIdFromUrl(enemyPokemon.url));
      setimageOfEnemyPokemon(image);
    };
    handleImageOfEnemyPokemon();
  }, [enemyPokemon.url]);

  return (
    <div>
      <h1>{enemyPokemon.name}</h1>
      <p>{enemyPokemon.url}</p>
      <img src={imageOfEnemyPokemon} alt="enemyPokemon" />
      <button onClick={backToLocations}>Back to Locations</button>
    </div>
  );
};

export default Encounter;

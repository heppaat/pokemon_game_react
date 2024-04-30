import { EnemyPokemon } from "../modell";

const Encounter = (props: {
  enemyPokemon: EnemyPokemon;
  backToLocations: () => void;
}) => {
  const { enemyPokemon, backToLocations } = props;
  return (
    <div>
      <h1>{enemyPokemon.name}</h1>
      <button onClick={backToLocations}>Back to Locations</button>
    </div>
  );
};

export default Encounter;

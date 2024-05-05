import express from "express";
import cors from "cors";
import { MyPokemonSchema } from "./modell";
import { load, save } from "./util/db";

const server = express();
server.use(cors());
server.use(express.json());

server.get("/api/myPokemons", async (req, res) => {
  const myPokemons = await load("data", MyPokemonSchema.array());
  if (!myPokemons) return res.sendStatus(500);

  res.json(myPokemons);
});

server.post("/api/myPokemons/data", async (req, res) => {
  const result = MyPokemonSchema.safeParse(req.body);

  if (!result.success) return res.sendStatus(400);
  const newPokemon = result.data;

  const myPokemons = await load("data", MyPokemonSchema.array());
  if (!myPokemons) return res.sendStatus(500);

  if (myPokemons.some((pokemon) => pokemon.name === newPokemon.name)) {
    return res.status(400).json({ error: "Duplicate Pokemon" });
  }

  const isSuccessfull = await save(
    "data",
    [...myPokemons, newPokemon],
    MyPokemonSchema.array()
  );
  if (!isSuccessfull) return res.sendStatus(500);

  res.sendStatus(200);
});

server.listen(3002);

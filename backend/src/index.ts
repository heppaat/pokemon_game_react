import express from "express";
import cors from "cors";
import { MyPokemonSchema } from "./modell";
import { load } from "./util/db";

const server = express();
server.use(cors());
server.use(express.json());

server.get("/api/myPokemons", async (req, res) => {
  const myPokemons = await load("data", MyPokemonSchema.array());
  if (!myPokemons) return res.sendStatus(500);

  return res.json(myPokemons);
});

server.listen(3002);

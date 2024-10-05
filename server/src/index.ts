import express, { Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";

const app = express();
app.use(express.json());
app.disable("x-powered-by");
const port: number = parseInt(process.env.PORT || "3000", 10);

let usersData = [
  { id: 0, username: "admin", token: "0" },
  { id: 1, username: "user", token: "1" },
];

const resolveUserById = (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { id },
  } = req;

  const requestedId = parseInt(id);
  isNaN(requestedId) ? res.status(400).send({ msg: "Invalid id." }) : null;
  const findUserIndex = usersData.findIndex((user) => user.id === requestedId);
  findUserIndex === -1 ? res.sendStatus(404) : null;
  req.findUserIndex = findUserIndex;

  next();
};

/*

200 OK
201 Created
202 Accepted
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
*/

app.get("/api/users", query("filter").isString().notEmpty(), (req, res) => {
  res.send(usersData);
});

app.get("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;
  res.status(200).send(usersData[findUserIndex as number]);
});

app.post("/api/register", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newUser = { id: usersData[usersData.length - 1].id + 1, ...body };
  usersData.push(newUser);
  res.status(201).send(newUser);
});

app.put("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;

  usersData[findUserIndex as number] = {
    id: usersData[findUserIndex as number].id,
    ...body,
  };
  res.sendStatus(200);
});

app.patch("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;

  usersData[findUserIndex as number] = {
    ...usersData[findUserIndex as number],
    ...body,
  };
  res.sendStatus(200);
});

app.delete("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;

  usersData = usersData.filter(
    (user) => user.id !== usersData[findUserIndex as number].id
  );
  res.send(200);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

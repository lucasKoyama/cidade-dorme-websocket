import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { roles } from "./data.js";

function generateToken(length = 4) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return token;
}

const godToken = generateToken();
console.log(godToken)

const PORT = 3000;
const HOST = "192.168.200.105"

const app = express();
const server = createServer(app);
const io = new Server(server);

const page = (page, res) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  res.sendFile(join(__dirname, "..", "frontend", page));
};

app.get("/", (req, res) => page("index.html", res));
app.get("/app", (req, res) => page("app.html", res));
app.get("/god", (req, res) => page("god.html", res));

/* WEBSOCKET */
const users = {};

io.on("connection", (socket) => {
  socket.broadcast.emit("players", users);

  socket.on("players", () => {
    socket.emit("players", users);
  });
  
  socket.on("login", (user) => {
    if (godToken === user) {
      const data = {
        href: "/god",
        role: roles["god"].role,
        user: "Game Master",
        objective: roles["god"].objective
      };

      return socket.emit("redirect", data);
    } else {
      users[user.toLowerCase()] = {
        alive: 1,
        role: roles["city"].role,
        name: user.charAt(0).toUpperCase() + user.slice(1),
        objective: roles["city"].objective,
        icon: roles["city"].icon
      };

      const data = {
        href: "/app",
        role: roles["city"].name,
        name: user.charAt(0).toUpperCase() + user.slice(1),
        objective: roles["city"].objective
      };

      socket.emit("redirect", data);
    }
  });

  socket.on("update-users", (updatedUsers) => {
      
    Object.values(users).forEach(user => {
      const userName = user.name;
      const updatedUser = updatedUsers.find((user) => user.name === userName);
      users[userName.toLowerCase()] = updatedUser;
    })

    socket.emit("players", users);
  })

});

server.listen(PORT, HOST, () => {
  console.log(`server running at http://${HOST}:${PORT}`);
});

/*

1. Firewall avançado > node.js > propriedades > habilitar conexão
2. criar nova regra de entrada para a porta 3000

*/
const http = require("http");
const { parse } = require("url");
const {
  getUsers,
  getUserHobbies,
  createUser,
  deleteUser,
  updateUser,
  addUserHobby,
  deleteUserHobby,
} = require("./userController");

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url, true);
  const method = req.method.toUpperCase();

  const matchRoute = (path, callback) => {
    const regex = new RegExp(`^${path.replace(/:\w+/g, "(\\d+)")}$`);

    if (regex.test(pathname)) {
      const match = pathname.match(regex);
      const userId = match && match[1];
      callback(userId);
    }
  };

  matchRoute("/users", () => {
    if (method === "GET") {
      const users = getUsers();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } else if (method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const user = JSON.parse(body);
        const newUser = createUser(user);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      });
    }
  });

  matchRoute("/users/:userId", (id) => {
    const userId = parseInt(id);
    if (!isNaN(userId)) {
      if (method === "GET") {
        const hobbies = getUserHobbies(userId);
        if (hobbies !== null) {
          const hobbiesWithLinks = {
            hobbies,
            links: [{ rel: "self", href: `/users/${userId}`, method: "GET" }],
          };
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "max-age=3600",
          });
          res.end(JSON.stringify(hobbiesWithLinks));
        } else {
          res.writeHead(404);
          res.end();
        }
      } else if (method === "DELETE") {
        const deleted = deleteUser(userId);
        if (deleted) {
          res.writeHead(204);
          res.end();
        } else {
          res.writeHead(404);
          res.end();
        }
      } else if (method === "PATCH") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const updatedProps = JSON.parse(body);
          const updatedUser = updateUser(userId, updatedProps);
          if (updatedUser) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedUser));
          } else {
            res.writeHead(404);
            res.end();
          }
        });
      }
    } else {
      res.writeHead(400);
      res.end();
    }
  });

  matchRoute("/users/:userId/hobbies", (id) => {
    const userId = parseInt(id);

    if (!isNaN(userId)) {
      if (method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const hobby = JSON.parse(body);
          const updatedHobbies = addUserHobby(userId, hobby);
          if (updatedHobbies) {
            const hobbiesWithLinks = {
              hobbies: updatedHobbies,
              links: [
                {
                  rel: "self",
                  href: `/users/${userId}/hobbies`,
                  method: "POST",
                },
              ],
            };
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(hobbiesWithLinks));
          } else {
            res.writeHead(404);
            res.end();
          }
        });
      } else if (method === "DELETE") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          const hobby = JSON.parse(body);
          const updatedHobbies = deleteUserHobby(userId, hobby);
          if (updatedHobbies) {
            res.writeHead(204);
            res.end();
          } else {
            res.writeHead(404);
            res.end();
          }
        });
      }
    } else {
      res.writeHead(400);
      res.end();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

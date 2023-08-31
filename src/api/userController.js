let users = [
  {
    id: 1,
    name: "Ann",
    email: "ann@google.com",
    hobbies: ["books", "sport", "dancing"],
  },
  {
    id: 2,
    name: "Ben",
    email: "ben@google.com",
    hobbies: ["series", "sport"],
  },
];

function getUsers() {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
}

function getUserHobbies(userId) {
  const user = users.find((user) => user.id === userId);
  if (user) {
    return user.hobbies;
  }
  return null;
}

function createUser(user) {
  const newUser = { ...user, id: users.length + 1, hobbies: [] };
  users.push(newUser);
  return newUser;
}

function deleteUser(userId) {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
}

function updateUser(userId, updatedProps) {
  const user = users.find((user) => user.id === userId);
  if (user) {
    Object.assign(user, updatedProps);
    return user;
  }
  return null;
}

function addUserHobby(userId, hobby) {
  const user = users.find((user) => user.id === userId);
  if (user) {
    user.hobbies.push(hobby);
    return user.hobbies;
  }
  return null;
}

function deleteUserHobby(userId, hobby) {
  const user = users.find((user) => user.id === userId);
  if (user) {
    const hobbyIndex = user.hobbies.indexOf(hobby);
    if (hobbyIndex !== -1) {
      user.hobbies.splice(hobbyIndex, 1);
      return user.hobbies;
    }
  }
  return null;
}

module.exports = {
  getUsers,
  getUserHobbies,
  createUser,
  deleteUser,
  updateUser,
  addUserHobby,
  deleteUserHobby,
};

const db = require("../../data/dbConfig");

function find() {
    return db("users");
}
function findBy(filter) {
    return db("users").where(filter);
}

function findById(user_id) {
    return db("users").where("id", user_id).first();
}

async function register(user) {
    const [id] = await db("users").insert(user);
    return findById(id);
}

module.exports = {
    find,
    findBy,
    register,
}
const db = require("../../data/dbConfig");
const { BCRYPT_ROUNDS } = require("../secrets/index")
const bcrypt = require("bcryptjs");

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

async function remove(id) {
    const user = await db("users").where("id", id).first()
    await db("users").del().where("id", id)
    return user;
}

async function update(id, changes) {
    const { username, password } = changes;
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const newUser = { username, password: hash };
    await db("users").update(newUser).where("id", id)
    const result = await db("users").where("id", id).first()
    return result;
}

module.exports = {
    find,
    findBy,
    register,
    remove,
    findById,
    update
}
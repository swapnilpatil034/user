const express = require("express");
const app = express();
require("./config");
app.use(express.json());
const User = require("./User");
const Jwt = require('jsonwebtoken');
const jwtKey = 'MyKey';


app.post("/register", async (req, resp) => {
    let user = User(req.body);
    let result = await user.save();
    resp.send(result);
});

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h " }, (err, token) => {
                if (err) {
                    resp.send({ result: "somethig went wrong please after some time" })
                }
                resp.send({ user, auth: token });
            })
        } else {
            resp.send({ result: "no user found" })
        }
    } else {
        resp.send({ result: "no user found" })
    }
});



app.get("/users", async (req, resp) => {
    let page = 1;
    let limit = 10;
    let user = await User.find().
        skip((page - 1) * limit).
        select('_id').limit(limit)
    Jwt.sign({ user }, jwtKey, { expiresIn: "2h " }, (err, token) => {
        if (err) {
            resp.send({ result: "somethig went wrong please after some time" })
        }
        resp.send({ user, auth: token });
    })
});

app.put("/user/:id", async (req, resp) => {
    let result = await User.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});

app.get("/search/:key", async (req, resp) => {
    let page = 1;
    let limit = 10;
    let result = await user.find({
        "$or": [
            { firstName: { $regex: req.params.key } },
            { lastName: { $regex: req.params.key } },
            { email: { $regex: req.params.key } },
            { mobileNo: { $regex: req.params.key } },


        ]
    }).skip((page - 1) * limit).select('_id').limit(limit);
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h " }, (err, token) => {
        if (err) {
            resp.send({ result: "somethig went wrong please after some time" })
        }
        resp.send({ result, auth: token });
    })
});

app.listen(7000);
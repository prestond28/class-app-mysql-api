const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const con = require('../db-config');
const jwtconfig = require('../jwt-config');
const authQueries = require('../queries/auth.queries');
const userQueries = require('../queries/user.queries');

exports.registerUser = function(req, res) {
    const passwordHash = bcrypt.hashSync(req.body.password);

    con.query(
        authQueries.INSERT_NEW_USER,
        [req.body.username, req.body.email, passwordHash],
        function(err, result) {
            if (err) {
                // stop registeration
                console.log(err);
                res.status(500).send({ msg: "Could not register user. Please try again later." });
            }

            con.query(userQueries.GET_ME_BY_USERNAME, [req.body.username], function(err, user) {
                if (err) {
                    res.status(500).send({ msg: "Could not retrieve user." });
                }

                console.log(user);
                res.send(user);
            });
        }
    );
};

exports.login = function(req, res) {
    // checking if user exists
    con.query(
        userQueries.GET_ME_BY_USERNAME_WITH_PASSWORD,
        [req.body.username],
        function(err, user) {
            if (err) {
                res.status(500).send({ msg: "Could not retrieve user." });
            }

            console.log(user);
            // validate entered password from saved database password
            bcrypt
                .compare(req.body.password, user[0].password)
                .then(function(validPass) {
                    if(!validPass) {
                        res.status(400).send({ msg: "Invalid password!" });
                    }
                    // create token
                    const token = jwt.sign({ id: user[0].user_id }, jwtconfig.secret);
                    res.header('auth-token', token).send({ auth: true, msg: "Logged in!" });
                })
                .catch(console.log);
        }
    );
};

exports.updateUser = function(req, res) {
    con.query(
        userQueries.GET_ME_BY_USER_ID_WITH_PASSWORD,
        [req.user.id],
        function(err, user) {
            console.log(err, user);
            if (err) {
                res.status(500).send({ msg: "Could not retrieve user." });
            }
            
            console.log(user);

            const passwordHash = bcrypt.hashSync(req.body.password);
            
            con.query(
                authQueries.UPDATE_USER,
                [req.body.username, req.body.email, passwordHash, user[0].id],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ msg: "Could not update user settings." });
                    }
                    res.json({ msg: "Updated successfully!" });
                }
            );
        }
    );
};
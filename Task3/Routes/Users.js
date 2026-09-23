const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");

const router = express.Router();


router.post("/", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.run(sql, [name, email, hashedPassword], function (err) {

            
            if (err) {

            if (err.message.includes("UNIQUE")) {
               return res.status(400).json({
                    error: "Email already exists"
                    });
              }

            return res.status(500).json({
                error: "User could not be created"
         });
}
            res.status(201).json({
                message: "User created successfully",
                id: this.lastID,
                name: name,
                email: email
            });

        });

    } catch (error) {

        res.status(500).json({
            error: "Server error"
        });

    }

});


module.exports = router;





router.get("/", (req, res) => {

    const sql = `
        SELECT id, name, email
        FROM users
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: "Could not get users"
            });
        }

        res.status(200).json(rows);
    });

});



router.get("/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT id, name, email
        FROM users
        WHERE id = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {
            return res.status(500).json({
                error: "Could not get user"
            });
        }

        if (!row) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json(row);
    });

});



router.put("/:id", async (req, res) => {

    const id = req.params.id;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            UPDATE users
            SET name = ?, email = ?, password = ?
            WHERE id = ?
        `;

        db.run(sql, [name, email, hashedPassword, id], function (err) {

            if (err) {
                return res.status(400).json({
                    error: "User could not be updated"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            res.status(200).json({
                message: "User updated successfully",
                id: Number(id),
                name: name,
                email: email
            });

        });

    } catch (error) {
        res.status(500).json({
            error: "Server error"
        });
    }

});



router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {

        if (err) {
            return res.status(500).json({
                error: "User could not be deleted"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    });

});
//required imports
const express = require("express");
const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// let tasks = [
//   { id: 1, title: "Learning node.js" },
//   { id: 2, title: "Learn React" },
//   { id: 3, title: "currently at 8" },
// ];

//just a resposne form the backend
app.get("/", (req, res) => {
  res.send("Hello form the backend!!!");
});

//reads data from database and displays it in the frontend
app.get("/tasks", auth, (req, res) => {
  const user = req.user;
  // res.json(tasks);
  const sql = "select * from tasks where user_id = ?";

  db.query(sql, [user.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }
    res.json(result);
  });
});

//inserts new data to the database
app.post("/tasks", auth, (req, res) => {
  const title = req.body.title;
  const userId = req.user.id;

  const sql = "insert into tasks (title, user_id) values(?, ?)";

  db.query(sql, [title, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.status(201).json({
      message: "task created",
      id: result.insertId,
    });
  });
});

//updates the existing data
app.put("/tasks/:id", auth, (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const completed = req.body.completed;
  const userid = req.user.id;

  const sql =
    "update tasks set title = ?, completed = ? where id = ? and user_id = ?";

  db.query(sql, [title, completed, id, userid], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "task not found T_T, make sure it's YOUR task.",
      });
    }
    res.json({
      message: "task updated",
    });
  });
});

//deletes an existing data
app.delete("/tasks/:id", auth, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const sql = "delete from tasks where id = ? and user_id = ?";
  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "database error",
      });
    }
    if (result.affectedRows === 0) {
      return res.json({
        message: "data not found or it doesnt belong to you",
      });
    }
    res.json({
      message: "data deleted sucessfully!",
    });
  });
});

//creating register route
app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  //for checking if the user already exists or not
  const sql = "select * from users where email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Databse error",
      });
    }
    //in case of existing user in the database
    if (result.length > 0) {
      return res.status(400).json({
        message: "the email already exists",
      });
    }

    //creating a hash using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); //password has the plain text and 10 is the cost factor

    //query for inserting new user data to the database
    const insertSql =
      "insert into users (name, email, password) values (?,?,?)";

    //inserting new user
    db.query(insertSql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
        });
      }
      //user created sucessfully
      res.status(201).json({
        message: "new user was registered succesfully!",
      });
    });
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = "select * from users where email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Databse error",
      });
    }
    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or Password",
      });
    }
    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or Password",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      "my_secret_key",
      {
        expiresIn: "1h",
      },
    );
    res.json({
      message: "login sucessful",
      token: token,
    });
  });
});

app.get("/user", (req, res) => {
  const sql = "select count(*) from users";

  db.query(sql, (err, result) => {
    // var output = result;
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "no users found",
      });
    }
    res.json({
      Users: result,
    });
  });
});

// app.delete("/register/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "delete from users where id = ?";

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         message: "database error",
//       });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         message: "user not found or already deleted.",
//       });
//     }
//     res.json({
//       message: "user deleted sucessfully!",
//     });
//   });
// });

//the port where the server is running (:5000) (localhost:5000)
app.listen(5000, () => {
  console.log("Server is running on the prot 5000");
});

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 8080;
const path=require('path');
var cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname + "/public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2110990810",
    database: "fashion_store"
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

/************************************ */
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password exist in the database
  const query = 'SELECT * FROM customers WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const user = result[0];
        // console.log(user);
        res.status(200).json({ success: true, message: 'Sign-in successfull', user });
      } else {
        res.status(401).json({ success: false, message: 'Wrong Email or Password'});
      }
    }
  });
});


app.post('/signup', async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
    } = req.body;
  
    try {
      // Check if the email already exists in the customers table
      const checkQuery = 'SELECT * FROM customers WHERE email = ?';
      const existingUser = await queryAsync(checkQuery, [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).send('Email already exists');
      }
  
      // Insert new user into the customers table
      const insertQuery =
        'INSERT INTO customers (first_name, last_name, email, password, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)';
      await queryAsync(insertQuery, [
        firstName,
        lastName,
        email,
        password,
        address,
        phoneNumber,
      ]);
  
      res.status(201).send('Signup successful');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  function queryAsync(query, values) {
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  

  app.post('/contactApp', (req, res) => {
    const { name, email, phoneNumber, message } = req.body;
  
    // Insert the contact information into the contact_us table
    const query =
      'INSERT INTO contact_us (name, email, phone_number, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, phoneNumber, message], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(201).send('Message received successfully');
      }
    });
  });
  



  app.get('/blogsComp', (req, res) => {
    // Retrieve all blogs from the database
    db.query('SELECT * FROM blogs', (err, results) => {
      if (err) {
        console.error('Error fetching blogs from database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  
  app.post('/blogsComp', (req, res) => {
    // Add a new blog to the database
    const { title, content, author } = req.body;
    db.query('INSERT INTO blogs (title, content, author) VALUES (?, ?, ?)', [title, content, author], (err, results) => {
      if (err) {
        console.error('Error adding blog to database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const newBlogId = results.insertId;
        res.json({ blog_id: newBlogId, title, content, author });
      }
    });
  });











  app.get('/menProductsApp', (req, res) => {
    const sql = 'SELECT * FROM menProducts';
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  app.get('/womenProductsApp', (req, res) => {
    const sql = 'SELECT * FROM womenProducts';
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  app.get('/allProductsApp', (req, res) => {
    const sql = 'SELECT * FROM allProducts';
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });













app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
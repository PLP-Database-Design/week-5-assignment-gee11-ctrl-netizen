
//import dependencies

const express = require('express');
const app = express();
const mysql = require('mysql2');  //we want to connect to the database workbench
const dotenv = require('dotenv'); // my variables are in the .env file so we import it.


// configure the .env fileso that we can use the variables in the file. configure environment variables.

dotenv.config();


//create connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


//Test the connection 
db.connect((err) => {
    //connection not successful
    if (err) {
        return console.log('Error connceting to the database', err)
    }

    //connection successful
    console.log('Connection to the database is successful.', db.threadId)
})


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



// Retrieve all patients on certain condition.

app.get('/patients', (req, res) => {

    const getPatients = 'SELECT * FROM patients'
    db.query(getPatients, (err, data) => {
        //error retrieving patients
        if (err) {
            return res.status(400).send('Failed to get patients', err)
        }

        // success retrieve patients
        res.status(200).send(data)
    })
})

// Create a GET endpoint that displays all providers with their:

// first_name
// last_name
// provider_specialty

app.get('/providers', (req, res) => {
    const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers'
    db.query(getProviders, (err, data) => {
        //error retrieving
        if (err) {
            return res.status(400).send('Failed to obtain providers', err)
        }

        //success retrieving
        res.status(200).render('data', { data })
    })
})



// app.get('patients firstname', (req, res) =>{
//     const patientFisrtName = 
// })






// ## 3. Filter patients by First Name
// Create a ```GET``` endpoint that retrieves all patients by their first name

//1 using request query key values

app.get('/patientBy_firstName', (req, res) => {
    const firstName = req.query.firstName;
    const getPatientsByfirstName = 'SELECT patient_id, first_name, language FROM patients WHERE first_name = ? ';
    console.log({ firstName });

    db.query(getPatientsByfirstName, [firstName], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({ data: data })
    })
})

//2.using specifying the parameters on path

app.get('/patient/:fName', (req, res) => {
    const { fName } = req.params;
    const getPatientfName = 'SELECT patient_id, first_name, last_name, language FROM patients WHERE first_name = ?';

    db.query(getPatientfName, [fName], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results)
    })
})



//## 4. Retrieve all providers by their specialty
// Create a ```GET``` endpoint that retrieves all providers by their specialty
//1 by defining parameters on the path

app.get('/providersData/:bySpecialty', (req, res) => {
    const { bySpecialty } = req.params;
    const getProviderSpecialty = 'SELECT provider_id, first_name,provider_specialty FROM providers WHERE provider_specialty = ?';
    console.log({ bySpecialty });
    db.query(getProviderSpecialty, [bySpecialty], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json(results);

    });

});

// 2. Request query value statement

app.get('/doctorSpecialty', (req, res) => {
    const docSpecialty = req.query.docSpecialty;
    const getDocSpecialty = 'SELECT provider_id, first_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    console.log({ docSpecialty });
    db.query(getDocSpecialty, [docSpecialty], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({ results: results });
    });

});








//define and listen to port 3300

app.listen(3300, () => {
    console.log(`Server is running successfully on port 3300....`)
})

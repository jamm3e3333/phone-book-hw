const express = require('express');
const app = express();
const Contact = require('./models/contact');
require('./db/mongodb');
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Jakub Vala's app</h1>
    `);
});

//CREATE CONTACT
app.post('/contact/add', async(req, res) => {
    if(!req.body) {
        res.status(400)
            .send("No data to store.");
    }
    const contact = new Contact(req.body);
    try{
        await contact.save();
        res.status(201)
            .send(contact);
    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
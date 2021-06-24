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

app.get('/contacts', async(req, res) => {
    const sort = {};

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        console.log(sort);
    }
    try{
        const contacts = await Contact.find({
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            });
        res.status(200)
            .send(contacts);

    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
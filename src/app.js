const express = require('express');
const app = express();
const Contact = require('./models/contact');
require('./db/mongodb');


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

//LISTING ALL CONTACTS
app.get('/contacts', async(req, res) => {
    const sort = {};

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    try{
        const contacts = await Contact.find({})
                                        .sort(sort)
                                        .limit(Number.parseInt(req.query.limit))
                                        .skip(Number.parseInt(req.query.skip));
        res.status(200)
            .send(contacts);

    }
    catch(e) {
        res.status(400)
            .send({Error: e.message});
    }
});

//LISTING A PARTICULAR CONTACT BY A NAME
app.get('/contacts/name', async(req, res) => {
    const name = req.query.name;
    if(!name) {
        return res.status(404)
                    .send("Name cannot be an empty string!");
    }
    try{
        const contact = await Contact.findOne({ name: new RegExp(`.*${name}.*`, 'i')});
        if(!contact){
            return res.status(404)
                        .send("Contact not found.");
        }
        res.status(200)
            .send(contact);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

//UPDATING A CONTACT
app.patch('/contact/update', async(req, res) => {
    //the only items that could be updated
    const updates = ['name','title','phone'];
    const updateOnes = Object.keys(req.body);
    const isUpdate = updateOnes.every((update) => {
        return updates.includes(update);
    });
    try{
        if(!isUpdate) {
            return res.status(400)
                        .send("Wrong updates.");
        }
        const contact = await Contact.findOne({ name: new RegExp(`.*${req.query.name}.*`, 'i')});
        if(!contact) {
            return res.status(404)
                        .send(`Contact ${req.query.name} was not found.`);
        }

        updateOnes.forEach((update) => {
            contact[update] = req.body[update];
        })
        await contact.save();
        res.status(200)
            .send(contact);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    };
});

//DELETING A CONTACT
app.delete('/contact/delete', async(req, res) => {
    const name = req.query.name;
    try{
        if(!name){
            return res.status(400)
                        .send("You must pick a contact you want to delete.");
        }
        await Contact.deleteOne({name}, (error, data) => {
            if(error) {
                return res.status(400)
                            .send({Error: error.message});
            }
            if(!data.deletedCount) {
                return res.status(400)
                    .send("Contact doesn\'t exist.");
            }
            res.status(200)
                .send("Contact deleted.");
        });

    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
});

app.get('*', (req, res) => {
    res.status(404)
        .send("Not found.");
});

module.exports = app;
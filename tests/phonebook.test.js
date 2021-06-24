const request = require('supertest');
const mongoose = require('mongoose');
const Contact = require('../src/models/contact');
const app = require('../src/app');

const userId = new mongoose.Types.ObjectId();
const newContact = {
    _id: userId,
    name: "User",
    phone: "+420222333999",
    title: "Ing",
}

beforeEach(async() => {
    await Contact.deleteMany();
    await new Contact(newContact).save();
});

test('Getting a contact by a name', async() => {
    const response = await request(app)
                            .get(`/contacts/name?name=${newContact.name}`)
                            .send()
                            .expect(200);

    const contact = await Contact.findOne();
    
    expect(contact).not.toBeNull();

    expect(response.body).not.toBeNull();

    expect(response.body).toMatchObject({
        _id: contact._id.toString(),
        name: contact.name,
        phone: contact.phone,
        title: contact.title
    });
});

test('Creating a duplicate contact.', async() => {
    await request(app)
            .post('/contact/add?name=user')
            .send({
                name: 'User'
            })
            .expect(400);
});

test('Getting contacts.', async() => {
    const response = await request(app)
                            .get('/contacts')
                            .send()
                            .expect(200);
    expect(response.body.length).toBe(1);                           
});

test('Updating non-existing items.', async() => {
    const response = await request(app)
                            .patch('/contact/update?name=user')
                            .send({
                                "occupation": "student"
                            })
                            .expect(400);

    
    expect(response.text).toBe('Wrong updates.');
});

test('Deleting non-existing contact.', async() => {
    const response = await request(app)
                            .delete('/contact/delete?name=user')
                            .send()
                            .expect(400);
    expect(response.text).toBe('Contact doesn\'t exist.');
});

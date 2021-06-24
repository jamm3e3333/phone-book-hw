const mongoose = require('mongoose');

mongoose.connect(process.env.DB_NAME, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
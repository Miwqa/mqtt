let fs = require('fs');
let path = require('path');
let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {

    try {

        let file = path.join(__dirname, '..', 'mqtt', 'devices.json');
        let json = fs.readFileSync(file);
        let data = JSON.parse(json);

        res.send(data);

    } catch (error) {

        res.send({
            success: false,
            message: 'Что-то пошло не так'
        });

        console.error(error);

    }

});

module.exports = router;
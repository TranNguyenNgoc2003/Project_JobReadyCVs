let mongoose = require('mongoose');

const mongodb_url = 'mongodb://localhost:27017/ProjectJS_CV';

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(mongodb_url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log("Kết nối cơ sở dữ liệu thành công!");
            })
            .catch(err => {
                console.error("Lỗi kết nối cơ sở dữ liệu: " + err.message);
            });
    }
}

module.exports = new Database();
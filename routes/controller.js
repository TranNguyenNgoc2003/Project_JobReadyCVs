var express = require('express');
var router = express.Router();
var Job = require('./../db/models/Jobs');
var CV = require('./../db/models/cvModel');

//router home
router.get('/home', function (req, res) {
    Job.find({})
        .then(jobs => {
            res.render('home', {
                jobs: jobs
            });
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        });
});


//router create cv and show cv
router.get('/createcvform', function (req, res) {
    res.render('createcvform');
});

router.post('/submit', async (req, res) => {
    try {
        const data = req.body;

        if (!data.projects) {
            return res.status(400).send('Dự án là trường bắt buộc.');
        }

        const cv = new CV(data);
        await cv.save();

        res.redirect(`/showcv/${cv._id}`);
    } catch (error) {
        res.status(500).send('Lỗi khi lưu CV: ' + error.message);
    }
});

router.get('/showcv/:id', async (req, res) => {
    try {
        const cv = await CV.findById(req.params.id);
        if (!cv) {
            return res.status(404).send('Không tìm thấy CV');
        }
        res.render('showcv', {
            cv: cv
        });
    } catch (error) {
        res.status(500).send('Lỗi khi tải CV: ' + error.message);
    }
});
module.exports = router;
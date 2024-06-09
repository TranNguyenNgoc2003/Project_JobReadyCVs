const express = require('express');
const router = express.Router();
const session = require('express-session');
const Job = require('./../db/models/Jobs');
const CV = require('./../db/models/cvModel');
const User = require('./../db/models/User');

// Add session middleware
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

//router sign in
router.get('/', function (req, res) {
    res.render('sign_in');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.render('sign_in', { error: 'Email hoặc mật khẩu không đúng.' });
        }
        req.session.user = user;
        res.redirect('/home');
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).send('Đã xảy ra lỗi khi đăng nhập.');
    }
});

//router sign up
router.get('/sign_up', (req, res) => {
    res.render('sign_up');
});

router.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    try {
        if (password !== confirm_password) {
            return res.render('sign_up', { error: 'Mật khẩu xác nhận không khớp.' });
        }

        const newUser = new User({ name, email, password });

        await newUser.save();

        res.redirect('/');

    } catch (error) {
        console.error('Lỗi khi đăng ký người dùng:', error);
        return res.render('sign_up', { error: 'Đã xảy ra lỗi khi đăng ký người dùng. Vui lòng thử lại sau.' });
    }
});


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


//router create cv
router.get('/createcvform', function (req, res) {
    res.render('createcvform');
});

router.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        if (!req.session.user) {
            return res.redirect('/');
        }

        if (!data.projects) {
            return res.status(400).send('Dự án là trường bắt buộc.');
        }

        const cv = new CV({
            ...data,
            user: req.session.user._id
        });

        await cv.save();

        res.redirect(`/showcv/${cv._id}`);
    } catch (error) {
        res.status(500).send('Lỗi khi lưu CV: ' + error.message);
    }
});

//router show cv
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

// Route list CV
router.get('/list_cv', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    try {
        const userCvs = await CV.find({ user: req.session.user._id });
        res.render('list_cv', { cvs: userCvs });
    } catch (error) {
        console.error('Error fetching CVs:', error);
        res.status(500).send('Lỗi khi lấy danh sách CV.');
    }
});

// Route edit CV
router.get('/editcv/:id', async (req, res) => {
    try {
        const cv = await CV.findById(req.params.id);
        if (!cv) {
            return res.status(404).send('Không tìm thấy CV');
        }
        res.render('editcv', {
            cv: cv
        });
    } catch (error) {
        res.status(500).send('Lỗi khi tải CV: ' + error.message);
    }
});

// Route update CV
router.post('/updatecv/:id', async (req, res) => {
    try {
        const data = req.body;
        const cvId = req.params.id;

        const cv = await CV.findById(cvId);
        if (!cv) {
            return res.status(404).send('Không tìm thấy CV');
        }

        Object.assign(cv, data);
        await cv.save();

        res.redirect(`/showcv/${cv._id}`);
    } catch (error) {
        res.status(500).send('Lỗi khi cập nhật CV: ' + error.message);
    }
});

// Router delete CV
router.get('/deletecv/:id', async (req, res) => {
    try {
        const cvId = req.params.id;
        const deletedCV = await CV.findByIdAndDelete(cvId);
        if (!deletedCV) {
            return res.status(404).send('Không tìm thấy CV');
        }
        res.redirect('/list_cv');
    } catch (error) {
        console.error('Lỗi khi xóa CV:', error);
        res.status(500).send('Đã xảy ra lỗi khi xóa CV.');
    }
});

//router user
router.get('/user', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const user = req.session.user;

    res.render('user', { user: user });
});

//router edit user
router.get('/edit_user', function (req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const user = req.session.user;

    res.render('edit_user', { user: user });
});

//router update user
router.post('/update_user', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const { name, dateOfBirth, gender, address, phoneNumber, password } = req.body;
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);

        user.name = name;
        user.dateOfBirth = dateOfBirth;
        user.gender = gender;
        user.address = address;
        user.phoneNumber = phoneNumber;
        user.password = password;

        await user.save();

        req.session.user = user;

        res.redirect('/user');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        res.status(500).send('Đã xảy ra lỗi khi cập nhật thông tin người dùng.');
    }
});

// Router logout
router.get('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Lỗi khi đăng xuất:', err);
            return res.status(500).send('Đã xảy ra lỗi khi đăng xuất.');
        }
        res.redirect('/');
    });
});

module.exports = router;

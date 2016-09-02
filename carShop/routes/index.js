var express = require('express');
var csrf = require('csurf');
var login = require('./login');
var manage = require('./manage');
var carshop = require('./carshop');
var router = express.Router();
var csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, function (req, res, next) {
	res.render('login', {
		csrfToken: req.csrfToken()
	});
});

router.post('/', csrfProtection, login.submit);
router.get('/logout', login.logout);

router.get('/manage', csrfProtection, function (req, res, next) {
	if ( 1 == req.session.uid ) {
		console.log('req.session.uid ', req.session.uid);
		res.render('manage',{
			csrfToken: req.csrfToken()
		});
	}else
		res.redirect('back');
});

router.post('/register', csrfProtection, manage.regist);
router.post('/deluser', csrfProtection, manage.deluser);
router.post('/crtcartab', csrfProtection, manage.crttable);
router.post('/delcartab', csrfProtection, manage.deltable);

router.get('/carshop', csrfProtection, function (req, res, next) {
	if (0 == req.session.uid) {
		res.render('carshop',{
			csrfToken: req.csrfToken()
		});
	}else
		res.redirect('back');
});

router.post('/addcar', csrfProtection, carshop.addcar);
router.post('/delcar', csrfProtection, carshop.delcar);
router.post('/updatecar', csrfProtection, carshop.updatecar);
router.post('/srhcar', csrfProtection, carshop.srhcar);


module.exports = router;

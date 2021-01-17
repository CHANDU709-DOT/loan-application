const express = require('express');
const authController = require('../controllers/activities');

const router = express.Router();

// router.get('/', authController.isLoggedIn, (req, res) => {
//   console.log("inside");
//   res.render('index');
// });


router.get('/otpverify', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('otpverify.hbs', {
      user: req.user
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/Home', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('home.hbs', {
      user: req.user,
      user6: req.user6
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/profile', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('profile.hbs', {
      user: req.user
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/address', authController.isLoggedIn, (req, res) => {
  if(req.user1) {
    res.render('address.hbs', {
      user1: req.user1,
      user: req.user
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/work', authController.isLoggedIn, (req, res) => {
  if(req.user) {
    res.render('work.hbs', {
      user: req.user
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/bankinfo', authController.isLoggedIn, (req, res) => {
  if(req.user2) {
    res.render('bankinfo.hbs', {
      user2: req.user2,
      user: req.user
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/documents', authController.isLoggedIn, (req, res) => {
  if(req.user3) {
    res.render('documents.hbs', {
      user3: req.user3,
      user: req.user,
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/allinformation', authController.isLoggedIn, (req, res) => {
  if(req.user6) {
    res.render('allinformation.hbs', {
      user6: req.user6,
      user: req.user,
      user1: req.user1,
      user2: req.user2,
      user3: req.user3
    });
  } else {
    res.redirect("/authservice/login");
  }
});
router.get('/loan', authController.isLoggedIn, (req, res) => {
  if(req.user6) {
    res.render('loan.hbs', {
      user6: req.user6,
    });
  } else {
    res.redirect("/authservice/login");
  }
});

//router.get('/login', (req, res) =>{
  //res.render('login');
//})
router.get('/logout',authController.logout,(req,res)=>{
  res.render('/login.hbs');
})

module.exports = router;

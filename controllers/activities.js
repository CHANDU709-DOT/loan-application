const jwt = require('jsonwebtoken');
const client = require('../database/database');
const { promisify } = require('util');
var otpGenerator = require('otp-generator');
var nodemailer = require('nodemailer');
var  fs = require('fs');
var global1 = {};

//OTP verify
exports.otpverify = async (req, res) =>{
  const { otp } = req.body;
  if(!otp){
    return res.status(200).redirect('/authservice/otpverify');
  }
  try{
    const result4 = await client.query("SELECT otp FROM user_tables WHERE user_id = $1",[global1.id]
    ); 
    if(result4.rows[0].otp === otp){
      client.query("UPDATE user_tables SET otpverified = $1 WHERE user_id = $2", ['YES', global1.id])
      return res.status(200).redirect('/authservice/Home')
    }else{
      return res.status(200).render('otpverify', {
        message: 'please provoide correct OTP'
      })
    }
  }
  catch(err) {
    return console.log(err)
  }
}

//Resend Otp
exports.resendotp = (req, res) =>{
  var  otp =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  try{
  client.query('UPDATE user_tables SET otp = $1 WHERE user_id = $2', [otp, global1.id]
  );
  return res.status(200).redirect('/authservice/otpverify');
}
catch(err){
  return console.log(err)
}

}

//Verify Email
exports.emailotp = async (req, res) =>{
  var  otp =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  const { email } = req.body;
  try {
    client.query("UPDATE user_tables SET email = $1 WHERE user_id = $2", [email, global1.id]
    );
    try {
    client.query("UPDATE user_tables SET otp = $1 WHERE user_id = $2", [otp, global1.id]
    );
              //Mail
              // var smtpConfig = {
              //   host: 'smtp.gmail.com',
              //   port: 465,
              //   secure: true, // use SSL
              //   auth: {
              //       user: process.env.USER,
              //       pass: process.env.PASSWORD
              //   }
              // };
              // var transporter = nodemailer.createTransport(smtpConfig);
              
              // var mailOptions = {
              //   from: process.env.USER,
              //   to: email,
              //   subject: 'Mail From cashe',
              //   text: `Your four digit verification code for Loan is `+otp
              // };
                      
              // transporter.sendMail(mailOptions, function(error, info){
              //   if (error) {
              //     console.log(error);
              //   } else {
              //     console.log('Email sent has sent to register Email Address');
              //     console.log('otp is '+otp)
              //   }
              // });
              try{
              const result = await client.query("SELECT * FROM user_tables WHERE user_id = $1",[global1.id]
              );
              return res.status(200).render('profile.html', { user: result.rows[0], message:'Please verify your Email Address' })
            }
            catch(err){
              return console.log(err);
            }
    }
            catch(err){
              return console.log(err);
            }
  }
  catch(err){
    return console.log(err)
  }
}

//Email verify
exports.emailverify = async (req, res) =>{
  const { emailotp } = req.body;
  try{
    const result = await client.query("SELECT * FROM user_tables WHERE user_id = $1",[global1.id]
    );
    if(result.rows[0].otp === emailotp){
      try{
        client.query("UPDATE user_tables SET emailverified = $1 WHERE user_id = $2", ['YES', global1.id])
      }
      catch(err){
        return console.log(err)
      }
      try {
      const result = await client.query("SELECT * FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.status(200).render('profile.hbs', { user: result.rows[0] })
  }
  catch(err){
    return console.log(err);
  }
    }else{
      return res.status(200).render('profile.hbs',{
        message: 'Please enter correct OTP'
      })
    }
  }
  catch(err){
    return console.log(err)
  }
}

//Profile
exports.profile = async (req, res) =>{
  const { fullname, gender, date2, education, owner, pin, city } = req.body;
  console.log(global1.id);
  try{
    client.query("UPDATE user_tables SET user_fullname = $1, user_gender = $2, date_of_birth = $3, education_qualification = $4, owner_ship = $5, user_pincode = $6, city = $7, user_profile = $8 WHERE user_id = $9",
    [fullname, gender, date2, education, owner, pin, city, 'YES', global1.id]
    );
    return res.status(200).redirect('/authservice/profile.hbs')
  }
  catch(err){
    return console.log(err)
  }
}

//Work info
exports.workinfo = async (req, res) =>{
  const { emp, employe, date1, disignation, salary, month } = req.body;
  try{
    client.query("UPDATE user_tables SET employement_type = $1, employe_name = $2, work_date = $3, disignation = $4, salary_type = $5, net_salary = $6 WHERE user_id = $7",
    [ emp, employe, date1, disignation, salary, month, global1.id]);
    return res.status(200).redirect('/authservice/work')
  }
  catch(err){
    return console.log(err)
  }
}

//Upload Profilepic
exports.upload = async (req, res) =>{
try{
const result = await client.query("SELECT * FROM user_tables WHERE user_id = $1",[global1.id]
);
if (!req.files)
    return res.status(400).send('No files were uploaded.');
    var file = req.files.uploaded_image;
    var img_nam=file.name
    if(result.rows[0].upload_image == null){
    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
      file.mv('public/images/user_auth_image/'+file.name, function(err) {
        if (err)
          return res.status(500).send(err);
          try{
            client.query("UPDATE user_tables SET upload_image = $1 WHERE user_id = $2",[img_nam, global1.id]
            );
            return res.redirect('/authservice/home');
          }
          catch(err){
            return console.log(err)
          }
});
} else {
res.redirect('/authservice/home')
} 
    } else{
    fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image)
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
    var file = req.files.uploaded_image;
    var img_nam=file.name
    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
      file.mv('public/images/user_auth_image/'+file.name, function(err) {
        if (err)
          return res.status(500).send(err);
          try{
            client.query("UPDATE user_tables SET upload_image = $1 WHERE user_id = $2",[img_nam, global1.id]
            );
            return res.redirect('/authservice/home')
          }
          catch(err){
            return console.log(err)
          }
});
} else {
res.redirect('/authservice/home')
}
    }
}
catch(err){
return console.log(err)
}
}

//Documents
exports.documents = async (req, res) =>{
  try{
  const result = await client.query("SELECT * FROM user_tables WHERE user_id = $1",[global1.id]
  );
  if(result.rows[0].user_profile == 'YES'){
    try{
      if (!req.files)
      return res.status(400).send('No files were uploaded.');
      fs.mkdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents');
      console.log('folder is created')
    var file = req.files.photo;
    var file1 = req.files.front;
    var file3 = req.files.back;
    var file4 = req.files.pan;
    var file5 = req.files.salary;
    var file6 = req.files.bank;
    var file7 = req.files.residentail;
    var file8 = req.files.utility;
    var file9 = req.files.telbill;
    var file10 = req.files.pass;
    var file11 = req.files.vot;
    var file12 = req.files.drive;
    var file13 = req.files.rent;
    var file14 = req.files.comp;
    var img_name = file.name;
    var img_name2 = file1.name;
    var img_name3 = file3.name;
    var img_name4 = file4.name;
    var img_name5 = file5.name;
    var img_name6 = file6.name;
    var img_name7 = file7.name;
    var img_name8 = file8.name;
    var img_name9 = file9.name;
    var img_name10 = file10.name;
    var img_name11 = file11.name;
    var img_name12 = file12.name;
    var img_name13 = file13.name;
    var img_name14 = file14.name;
     if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
            file.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file.name, function(err) {
              if (err)
                return res.status(500).send(err);
                try{
                  console.log(img_name)
                  client.query("UPDATE user_documents SET photo = $1 WHERE user_id = $2",[img_name, global1.id]
                  );
                  if(file1.mimetype == "image/jpeg" ||file1.mimetype == "image/png"||file1.mimetype == "image/gif" ){
                    file1.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file1.name, function(err) {
                      if (err)
                        return res.status(500).send(err);
                        try {
                          console.log(img_name2)
                          client.query("UPDATE user_documents SET aadhaar_front = $1 WHERE user_id = $2",[img_name2, global1.id]
                          );
                          if(file3.mimetype == "image/jpeg" ||file3.mimetype == "image/png"||file3.mimetype == "image/gif" ){
                            file3.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file3.name, function(err) {
                              if (err)
                                return res.status(500).send(err);
                                try{
                                  client.query("UPDATE user_documents SET aadhaar_back = $1 WHERE user_id = $2",[img_name3, global1.id]
                                  );
                                  if(file4.mimetype == "image/jpeg" ||file4.mimetype == "image/png"||file4.mimetype == "image/gif" ){
                                    file4.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file4.name, function(err) {
                                      if (err)
                                        return res.status(500).send(err);
                                        try{
                                          client.query("UPDATE user_documents SET pan_card = $1 WHERE user_id = $2",[img_name4, global1.id]
                                          );
                                          if(file5.mimetype == "image/jpeg" ||file5.mimetype == "image/png"||file5.mimetype == "image/gif" ){
                                            file5.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file5.name, function(err) {
                                              if (err)
                                                return res.status(500).send(err);
                                                try{
                                                  client.query("UPDATE user_documents SET salary_slip = $1 WHERE user_id = $2",[img_name5, global1.id]
                                                  );
                                                  if(file6.mimetype == "image/jpeg" ||file6.mimetype == "image/png"||file6.mimetype == "image/gif" ){
                                                    file6.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file6.name, function(err) {
                                                      if (err)
                                                        return res.status(500).send(err);
                                                        try{
                                                          client.query("UPDATE user_documents SET bank_statement = $1 WHERE user_id = $2",[img_name6, global1.id]
                                                          );
                                                          if(file7.mimetype == "image/jpeg" ||file7.mimetype == "image/png"||file7.mimetype == "image/gif" ){
                                                            file7.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file7.name, function(err) {
                                                              if (err)
                                                                return res.status(500).send(err);
                                                                try{
                                                                  client.query("UPDATE user_documents SET residental_proof = $1 WHERE user_id = $2",[img_name7, global1.id]
                                                                  );
                                                                  if(file8.mimetype == "image/jpeg" ||file8.mimetype == "image/png"||file8.mimetype == "image/gif" ){
                                                                    file8.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file8.name, function(err) {
                                                                      if (err)
                                                                        return res.status(500).send(err);
                                                                        try{
                                                                          client.query("UPDATE user_documents SET utility_bill = $1 WHERE user_id = $2",[img_name8, global1.id]
                                                                          );
                                                                          if(file9.mimetype == "image/jpeg" ||file9.mimetype == "image/png"||file9.mimetype == "image/gif" ){
                                                                            file9.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file9.name, function(err) {
                                                                              if (err)
                                                                                return res.status(500).send(err);
                                                                                try{
                                                                                  client.query("UPDATE user_documents SET telephone_bill = $1 WHERE user_id = $2",[img_name9, global1.id]
                                                                                  );
                                                                                  if(file10.mimetype == "image/jpeg" ||file10.mimetype == "image/png"||file10.mimetype == "image/gif" ){
                                                                                    file10.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file10.name, function(err) {
                                                                                      if (err)
                                                                                        return res.status(500).send(err);
                                                                                        try{
                                                                                          client.query("UPDATE user_documents SET passport = $1 WHERE user_id = $2",[img_name10, global1.id]
                                                                                          );
                                                                                          if(file11.mimetype == "image/jpeg" ||file11.mimetype == "image/png"||file11.mimetype == "image/gif" ){
                                                                                            file11.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file11.name, function(err) {
                                                                                              if (err)
                                                                                                return res.status(500).send(err);
                                                                                                try{
                                                                                                  client.query("UPDATE user_documents SET voter_id = $1 WHERE user_id = $2",[img_name11, global1.id]
                                                                                                  );
                                                                                                  if(file12.mimetype == "image/jpeg" ||file12.mimetype == "image/png"||file12.mimetype == "image/gif" ){
                                                                                                    file12.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file12.name, function(err) {
                                                                                                      if (err)
                                                                                                        return res.status(500).send(err);
                                                                                                        try{
                                                                                                          client.query("UPDATE user_documents SET driving_lisence = $1 WHERE user_id = $2",[img_name12, global1.id]
                                                                                                          );
                                                                                                          if(file13.mimetype == "image/jpeg" ||file13.mimetype == "image/png"||file13.mimetype == "image/gif" ){
                                                                                                            file13.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file13.name, function(err) {
                                                                                                              if (err)
                                                                                                                return res.status(500).send(err);
                                                                                                                try{
                                                                                                                  client.query("UPDATE user_documents SET rental_agreement = $1 WHERE user_id =$2",[img_name13, global1.id]
                                                                                                                  );
                                                                                                                  if(file14.mimetype == "image/jpeg" ||file14.mimetype == "image/png"||file14.mimetype == "image/gif" ){
                                                                                                                    file14.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file14.name, function(err) {
                                                                                                                      if (err)
                                                                                                                        return res.status(500).send(err);
                                                                                                                        try{
                                                                                                                          client.query("UPDATE user_documents SET company_hr = $1, user_document = $2 WHERE user_id = $3",[img_name14, 'YES', global1.id]
                                                                                                                          );
                                                                                                                        }
                                                                                                                        catch(err){
                                                                                                                          return console.log(err)
                                                                                                                        }
                                                                                                                    });
                                                                                                                  }else{
                                                                                                                    res.redirect('/authservice/home')        
                                                                                                                  }
                                                                                                                }
                                                                                                                catch(err){
                                                                                                                  return console.log(err)
                                                                                                                }
                                                                                                            });
                                                                                                          }else{
                                                                                                            res.redirect('/authservice/home')        
                                                                                                          }
                                                                                                        }
                                                                                                        catch(err){
                                                                                                          return console.log(err)
                                                                                                        }
                                                                                                    });
                                                                                                  }else{
                                                                                                    res.redirect('/authservice/home')        
                                                                                                  }
                                                                                                }
                                                                                                catch(err){
                                                                                                  return console.log(err)
                                                                                                }
                                                                                            });
                                                                                          }else{
                                                                                            res.redirect('/authservice/home')                                                                                          
                                                                                          }
                                                                                        }
                                                                                        catch(err){
                                                                                          return console.log(err)
                                                                                        }
                                                                                    });
                                                                                  }else{
                                                                                    res.redirect('/authservice/home')        
                                                                                  }
                                                                                }
                                                                                catch(err){
                                                                                  return console.log(err)
                                                                                }
                                                                            });
                                                                          }else{
                                                                            res.redirect('/authservice/home')        
                                                                          }
                                                                        }
                                                                        catch(err){
                                                                          return console.log(err)
                                                                        }
                                                                    });
                                                                  }else{
                                                                    res.redirect('/authservice/home')        
                                                                  }                                                           }
                                                                catch(err){
                                                                  return console.log(err)
                                                                }
                                                            });
                                                          }else{
                                                            res.redirect('/authservice/home')        
                                                          }
                                                        }
                                                        catch(err){
                                                          return console.log(err)
                                                        }
                                                    });
                                                  }else{
                                                    res.redirect('/authservice/home')        
                                                  }
                                                }
                                                catch(err){
                                                  return console.log(err)
                                                }
                                            });
                                          }else{
                                            res.redirect('/authservice/home')        
                                          }
                                        }
                                        catch(err){
                                          return console.log(err)
                                        }
                                    });
                                  }else{
                                    res.redirect('/authservice/home')        
                                  }
                                }
                                catch(err){
                                  return console.log(err)
                                }
                          })
                          }else{
                            res.redirect('/authservice/home')
                          }
                        }
                        catch(err){
                          return console.log(err)
                        }
                  })
                  }else{
                    res.redirect('/authservice/home')                
                  }
                }
                catch(err){
                  return console.log(err)
                }
    });
    } else {
    res.redirect('/authservice/home')
    }
        //Already Exist dir
    }
    catch(err){
      if(err.code == 'EEXIST'){
        console.log('Already exist');
        const result1 = await client.query('SELECT * FROM user_documents WHERE user_id = $1',[global1.id]
        );
        try {         
          switch(req.files.photo || req.files.front || req.files.back || req.files.pan || req.files.salary || req.files.bank || req.files.residential || req.files.utility || req.files.telbill || req.files.pass || req.files.vot || req.files.drive || req.files.rent || req.files.comp ){
            case req.files.photo:
              var file = req.files.photo
              var img_name = file.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].photo+'')
              if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                file.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET photo = $1 WHERE user_id = $2",[img_name, global1.id]
                      );

                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
            case req.files.front:
              var file1 = req.files.front
              var img_name1 = file1.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].aadhaar_front+'')
              if(file1.mimetype == "image/jpeg" ||file1.mimetype == "image/png"||file1.mimetype == "image/gif" ){
                file1.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file1.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET aadhaar_front = $1 WHERE user_id = $2",[img_name1, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.back:
                var file2 = req.files.back
                var img_name2 = file2.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].aadhaar_back+'')
              if(file2.mimetype == "image/jpeg" ||file2.mimetype == "image/png"||file2.mimetype == "image/gif" ){
                file2.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file2.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET aadhaar_back = $1 WHERE user_id = $2",[img_name2, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.pan:
                var file3 = req.files.pan
                var img_name3 = file3.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].pan_card+'')
              if(file3.mimetype == "image/jpeg" ||file3.mimetype == "image/png"||file3.mimetype == "image/gif" ){
                file3.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file3.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET pan_card = $1 WHERE user_id = $2",[img_name3, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.salary:
                var file4 = req.files.salary
                var img_name4 = file4.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].salary_slip+'')
              if(file4.mimetype == "image/jpeg" ||file4.mimetype == "image/png"||file4.mimetype == "image/gif" ){
                file4.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file4.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET salary_slip = $1 WHERE user_id = $2",[img_name4, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.bank:
                var file5 = req.files.bank
                var img_name5 = file5.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].bank_statement+'')
              if(file5.mimetype == "image/jpeg" ||file5.mimetype == "image/png"||file5.mimetype == "image/gif" ){
                file5.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file5.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET bank_statement = $1 WHERE user_id = $2",[img_name5, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.residentail:
                var file6 = req.files.residentail
                var img_name6 = file6.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].residental_proof+'')
              if(file6.mimetype == "image/jpeg" ||file6.mimetype == "image/png"||file6.mimetype == "image/gif" ){
                file6.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file6.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET residental_proof = $1 WHERE user_id = $2",[img_name6, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.utility:
                var file7 = req.files.utility
                var img_name7 = file7.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].utility_bill+'')
              if(file7.mimetype == "image/jpeg" ||file7.mimetype == "image/png"||file7.mimetype == "image/gif" ){
                file7.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file7.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET utility_bill = $1 WHERE user_id = $2",[img_name7, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.telbill:
                var file8 = req.files.telbill
                var img_name8 = file8.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].telephone_bill+'')
              if(file8.mimetype == "image/jpeg" ||file8.mimetype == "image/png"||file8.mimetype == "image/gif" ){
                file8.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file8.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET telephone_bill = $1 WHERE user_id = $2",[img_name8, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.pass:
                var file9 = req.files.pass
                var img_name9 = file9.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].passport+'')
              if(file9.mimetype == "image/jpeg" ||file9.mimetype == "image/png"||file9.mimetype == "image/gif" ){
                file9.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file9.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET passport = $1 WHERE user_id = $2",[img_name9, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.vot:
                var file10 = req.files.vot
                var img_name10 = file10.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].voter_id+'')
              if(file10.mimetype == "image/jpeg" ||file10.mimetype == "image/png"||file10.mimetype == "image/gif" ){
                file10.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file10.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET voter_id = $1 WHERE user_id = $2",[img_name10, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.drive:
                var file11 = req.files.drive
                var img_name11 = file11.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].driving_lisence+'')
              if(file11.mimetype == "image/jpeg" ||file11.mimetype == "image/png"||file11.mimetype == "image/gif" ){
                file11.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file11.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET driving_lisence = $1 WHERE user_id = $2",[img_name11, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.rent:
                var file12 = req.files.rent
                var img_name12 = file12.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].rental_agreement+'')
              if(file12.mimetype == "image/jpeg" ||file12.mimetype == "image/png"||file12.mimetype == "image/gif" ){
                file12.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file12.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET rental_agreement = $1 WHERE user_id = $2",[img_name12, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
              case req.files.comp:
                var file13 = req.files.comp
                var img_name13 = file13.name
              fs.unlinkSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+result1.rows[0].company_hr+'')
              if(file13.mimetype == "image/jpeg" ||file13.mimetype == "image/png"||file13.mimetype == "image/gif" ){
                file13.mv('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents/'+file13.name, function(err) {
                  if (err)
                    return res.status(500).send(err);
                    try{
                      client.query("UPDATE user_documents SET company_hr = $1 WHERE user_id = $2",[img_name13, global1.id]
                      );
                    }
                    catch(err){
                      return console.log(err)
                    }
        });
        } else {
        res.redirect('/authservice/home')
        }
              break;
            }
          //file removed
        } catch(err) {
          console.error(err)
        }
      }else{
        console.log(err)
      }
    }
  res.redirect('/authservice/home')
  }else{
    return res.status(200).render('profile', {
      message: 'Please enter Persona; details First'
    })
  }
}
catch(err){
 return console.log(err)
}
}

//Address
exports.address = async (req, res) =>{
var dateTime = new Date();
var date = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate1 = date+' '+time;
  const { flatno, area, town, state, district, postals, flatno1, area1, town1, state1, district1, postals1 } = req.body;
  try{
    client.query("UPDATE user_addresses SET flate_no = $1, area = $2, town = $3, state = $4, district = $5, zip = $6, p_flate_no = $7, p_area = $8, p_town = $9, p_state = $10, p_district = $11, p_zip = $12, created_at = $13, user_address = $14 WHERE user_id = $15",
    [flatno, area, town, state, district, postals, flatno1, area1, town1, state1, district1, postals1, formate1, 'YES', global1.id]
    );
    return res.status(200).redirect('/authservice/address')
  }
  catch(err){
    return console.log(err);
  }
}
//Bank Info
exports.bankinfo = async (req, res) =>{
var dateTime = new Date();
var date = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate1 = date+' '+time;
  const { bank, account, confirm, ifsc, upi } = req.body;
  if(!bank || !account || !confirm || !ifsc || !upi){
    return res.render('bankinfo', {
      message: 'Please Provoide Information'
     })
  }
if(account === confirm){
    try{
      client.query("UPDATE bank_details SET bank_name = $1, account_no = $2, ifsc_code = $3, upi = $4, created_at = $5, user_bank = $6 WHERE user_id = $7",
      [bank, account, ifsc, upi, formate1, 'YES', global1.id]
      );
      return res.status(200).redirect('/authservice/bankinfo')
    }
    catch(err){
      return console.log(err);
    }
}else{
  return res.render('bankinfo', {
    message: 'Please Confirm Account number'
  })
}
};

//Delete Account
exports.delete = async (req, res) =>{
  try{
    const result1 = await client.query("SELECT loan_status FROM user_loans WHERE user_id = $1",[global1.id]
    );
    if(result1.rows[0].loan_status == 'Cancelled'){
  try{
    const result = await client.query("SELECT * FROM user_documents JOIN user_tables ON user_documents.user_id=user_tables.user_id AND user_tables.user_id = $1",[global1.id]
    );
    if(result.rows[0].upload_image == null && result.rows[0].user_document == 'NO'){
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }      
    }else if(result.rows[0].upload_image != null && result.rows[0].user_document == 'NO'){
      fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image);
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }
    }else if(result.rows[0].user_document == 'YES' && result.rows[0].upload_image == null){
      fs.rmdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents', { recursive: true });
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }
    }else if(result.rows[0].upload_image != null && result.rows[0].user_document == 'YES'){
      fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image);
      fs.rmdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents', { recursive: true });
      try{
      client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
      );
      return res.redirect('/authservice/logout')
    }
    catch(err){
      return console.log(err)
    }
    }
  }
  catch(err){
    return console.log(err)
  }
  //Condition
  }else if(result1.rows[0].loan_status == null){
      try{
    const result = await client.query("SELECT * FROM user_documents JOIN user_tables ON user_documents.user_id=user_tables.user_id AND user_tables.user_id = $1",[global1.id]
    );
    if(result.rows[0].upload_image == null && result.rows[0].user_document == 'NO'){
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }      
    }else if(result.rows[0].upload_image != null && result.rows[0].user_document == 'NO'){
      fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image);
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }
    }else if(result.rows[0].user_document == 'YES' && result.rows[0].upload_image == null){
      fs.rmdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents', { recursive: true });
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }
    }else if(result.rows[0].upload_image != null && result.rows[0].user_document == 'YES'){
      fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image);
      fs.rmdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents', { recursive: true });
      try{
      client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
      );
      return res.redirect('/authservice/logout')
    }
    catch(err){
      return console.log(err)
    }
    }
  }
  catch(err){
    return console.log(err)
  }
  //Condition
  }else if(result1.rows[0].loan_status == 'With draw'){
      try{
    const result = await client.query("SELECT * FROM user_documents JOIN user_tables ON user_documents.user_id=user_tables.user_id AND user_tables.user_id = $1",[global1.id]
    );
    if(result.rows[0].upload_image == null && result.rows[0].user_document == 'NO'){
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }      
    }else if(result.rows[0].upload_image != null && result.rows[0].user_document == 'NO'){
      fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image);
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }
    }else if(result.rows[0].user_document == 'YES' && result.rows[0].upload_image == null){
      fs.rmdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents', { recursive: true });
    try{
    client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
    );
    client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
    );
    return res.redirect('/authservice/logout')
  }
  catch(err){
    return console.log(err)
  }
    }else if(result.rows[0].upload_image != null && result.rows[0].user_document == 'YES'){
      fs.unlinkSync('public/images/user_auth_image/'+result.rows[0].upload_image);
      fs.rmdirSync('public/images/documents/'+result.rows[0].user_fullname+' Loan Documents', { recursive: true });
      try{
      client.query("DELETE FROM user_documents WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM bank_details WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_addresses WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_loans WHERE user_id = $1",[global1.id]
      );
      client.query("DELETE FROM user_tables WHERE user_id = $1",[global1.id]
      );
      return res.redirect('/authservice/logout')
    }
    catch(err){
      return console.log(err)
    }
    }
  }
  catch(err){
    return console.log(err)
  }
  }else if(result1.rows[0].loan_status == 'Pending'){
    return res.redirect('/authservice/Home')
  }
  }
  catch(err){
    return console.log(err)
  }
}
//Loan View
exports.loan = async (req, res) =>{
  var  otp =  otpGenerator.generate(10, {upperCase: false, specialChars: false, alphabets: false})
  var otp1 = 'APLOID'+otp
  const { loanamount } = req.body;
  var dateTime = new Date();
  var date = dateTime.getDate()+'/'+(dateTime.getMonth())+'/'+dateTime.getFullYear();
  var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
  var formate1 = date+' '+time;
  try{
  const result = await client.query("SELECT * FROM admins")
  if(loanamount >= 2000 && loanamount <= 5000){
      var interest = loanamount*result.rows[0].loan_interest1/100;
      var total = interest+ +loanamount;
       if((+dateTime.getDate()+7) <= 31 && +(dateTime.getMonth()+1) <= 12){
        var date3 = (dateTime.getDate()+7)+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
        try{
          client.query("UPDATE user_loans SET loan_amount = $1, loan_interest = $2, loan_duration =$3, repayment_amount = $4, repayment_duration = $5, application_id = $6, loan_status = $7, action = $8 WHERE user_id = $9",
          [loanamount, result.rows[0].loan_interest1, result.rows[0].loan_duration, total, date3, otp1, 'Pending', 'With draw', global1.id]);
          return res.redirect('/authservice/loan')
        }
        catch(err){
          return console.log(err)
        }
      }else if((+dateTime.getDate()+7) <= 31 || +(dateTime.getMonth()+1 ) <= 12){
        try{
          var date4 = (+dateTime.getDate()+7+''-dateTime.getDate()-6)+'/'+(dateTime.getMonth()+2)+'/'+dateTime.getFullYear();
          client.query("UPDATE user_loans SET loan_amount = $1, loan_interest = $2, loan_duration =$3, repayment_amount = $4, repayment_duration = $5, application_id = $6, loan_status = $7, action = $8 WHERE user_id = $9",
          [loanamount, result.rows[0].loan_interest1, result.rows[0].loan_duration, total, date4, otp1, 'Pending', 'With draw', global1.id]);
          return res.redirect('/authservice/loan')
        }
        catch(err){
          return console.log(err)
        }
      }else if(+(dateTime.getMonth()+1 ) <= 12){
        
      }else if((+dateTime.getDate()+7) <= 31){
  
      }
  }else if(loanamount >=5001 && loanamount <=10000 ){
    var interest = loanamount*result.rows[0].loan_interest2/100;
    var total = interest+ +loanamount;
     if((+dateTime.getDate()+7) <= 31 && +(dateTime.getMonth()+1) <= 12){
      var date3 = (dateTime.getDate()+7)+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
      try{
        client.query("UPDATE user_loans SET loan_amount = $1, loan_interest = $2, loan_duration =$3, repayment_amount = $4, repayment_duration = $5, application_id = $6, loan_status = $7, action = $8 WHERE user_id = $9",
        [loanamount, result.rows[0].loan_interest2, result.rows[0].loan_duration, total, date3, otp1, 'Pending', 'With draw', global1.id]);
        return res.redirect('/authservice/loan')
      }
      catch(err){
        return console.log(err)
      }

    }else if((+dateTime.getDate()+7) <= 31 || +(dateTime.getMonth()+1 ) <= 12){
      try{
        var date4 = (+dateTime.getDate()+7+''-dateTime.getDate()-6)+'/'+(dateTime.getMonth()+2)+'/'+dateTime.getFullYear();
        client.query("UPDATE user_loans SET loan_amount = $1, loan_interest = $2, loan_duration =$3, repayment_amount = $4, repayment_duration = $5, application_id = $6, loan_status = $7, action = $8 WHERE user_id = $9",
        [loanamount, result.rows[0].loan_interest2, result.rows[0].loan_duration, total, date4, otp1, 'Pending', 'With draw', global1.id]);
        return res.redirect('/authservice/loan')
      }
      catch(err){
        return console.log(err)
      }
    }else if(+(dateTime.getMonth()+1 ) <= 12){
      
    }else if((+dateTime.getDate()+7) <= 31){
      
    }
  }else if(loanamount >=10001 && loanamount <= 15000){
    var interest = loanamount*result.rows[0].loan_interest3/100;
    var total = interest+ +loanamount;
     if((+dateTime.getDate()+7) <= 31 && +(dateTime.getMonth()+1) <= 12){
      var date3 = (dateTime.getDate()+7)+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
      try{
        client.query("UPDATE user_loans SET loan_amount = $1, loan_interest = $2, loan_duration =$3, repayment_amount = $4, repayment_duration = $5, application_id = $6, loan_status = $7, action = $8 WHERE user_id = $9",
        [loanamount, result.rows[0].loan_interest3, result.rows[0].loan_duration, total, date3, otp1, 'Pending', 'With draw', global1.id]);
        return res.redirect('/authservice/loan')
      }
      catch(err){
        return console.log(err)
      }

    }else if((+dateTime.getDate()+7) <= 31 || +(dateTime.getMonth()+1 ) <= 12){
      try{
        var date4 = (+dateTime.getDate()+7+''-dateTime.getDate()-6)+'/'+(dateTime.getMonth()+2)+'/'+dateTime.getFullYear();
        client.query("UPDATE user_loans SET loan_amount = $1, loan_interest = $2, loan_duration =$3, repayment_amount = $4, repayment_duration = $5, application_id = $6, loan_status = $7, action = $8 WHERE user_id = $9",
        [loanamount, result.rows[0].loan_interest3, result.rows[0].loan_duration, total, date4, otp1, 'Pending', 'With draw', global1.id]);
        return res.redirect('/authservice/loan')
      }
      catch(err){
        return console.log(err)
      }
    }else if(+(dateTime.getMonth()+1 ) <= 12){
      
    }else if((+dateTime.getDate()+7) <= 31){
      
    }
  }
  }
  catch(err){
    return console.log(err)
  }
  // var  r = (2/100);
  // const r1 = '2%' 
  // var p = Math.pow(1+r,duration)
  // var emi = loanamount*r*p
  // var emi2 = p-1;
  // var emi3 = (emi/emi2)
}


//View Appliaction History
exports.viewpages = (req, res) => {
  res.status(200).redirect('/authservice/allinformation');
}

//With Draw
exports.withdraw = async (req, res) =>{
  try{
    client.query("UPDATE user_loans SET loan_status = $1 WHERE user_id = $2",['Cancelled', global1.id]
    )
    return res.status(200).redirect('/authservice/Home')
  }
  catch(err){
    return console.log(err)
  }
}

//Login
exports.login =  async (req, res) =>{
var dateTime = new Date();
var date = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
var formate1 = date+' '+time;
  var  otp =  otpGenerator.generate(4, {upperCase: false, specialChars: false, alphabets: false})
  var otp1 = 'AD'+otp
  var otp2 = 'BN'+otp
  var otp3 = 'DOC'+otp
  var otp4 = 'LOAN'+otp
  const { phone } = req.body;
  if(!phone){
    return res.render('login.hbs', {
      message: 'Please Provide Phone number'
    })
  }
  try {
  const result = await client.query("SELECT * FROM user_tables WHERE user_phno = $1", [phone]);
  if(result.rows.length > 0){
    try{
     client.query("UPDATE user_tables SET otp = $1, login_at = $2 WHERE user_id = $3",[otp, formate1, result.rows[0].user_id]
      );
      global1.id = result.rows[0].user_id;
      function Lid() {
          console.log(global1.id);
      }
      Lid();
  const id = result.rows[0].user_id;
  console.log(id)
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN
    ),
    httpOnly: true
  };
  res.cookie('jwt', token, cookieOptions)
  return res.status(200).redirect('/authservice/otpverify');
    }
    catch(err){
      return console.log(err)
    }    
  }else{
    try{
      client.query("INSERT INTO user_tables(user_id, user_phno, otp, otpverified, emailverified, created_at, user_profile) VALUES($1, $2, $3, $4, $5, $6, $7)",[otp, phone, otp, 'NO', 'NO', formate1, 'NO']
      );
      try {
        const result1 = await client.query("SELECT * FROM user_tables WHERE user_phno = $1",[phone]
        );
       client.query("INSERT INTO user_addresses(address_id, user_id, created_at, user_address) VALUES($1, $2, $3, $4) RETURNING *",[otp1, otp, formate1, 'NO']
      );
      client.query("INSERT INTO bank_details(bank_id, user_id, created_at, user_bank) VALUES($1, $2, $3, $4) RETURNING *",[otp2, otp,formate1,  'NO']
      );
      client.query("INSERT INTO user_documents(documents_id, user_id, created_at, user_document) VALUES($1, $2, $3, $4) RETURNING *",[otp3, otp, formate1, 'NO']
      );
      client.query("INSERT INTO user_loans(loan_id, user_id, created_at) VALUES($1, $2, $3) RETURNING *",[otp4, otp, formate1]
      );
      global1.id = result1.rows[0].user_id;
    function Lid() {
        console.log(global1.id);
    }
    Lid();
const id = result1.rows[0].user_id;
console.log(id)
const token = jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN
  ),
  httpOnly: true
};
res.cookie('jwt', token, cookieOptions)
return res.status(200).redirect('/authservice/otpverify');
      }
      catch(error){
        return console.log(error);
      }
    }
    catch(err){
      return console.log(err);
    }
  }
 }
 catch(err){
   console.log(err);
 }
}


// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) =>{
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      console.log("vamshi krishna bura "+decoded.id);
      global1.id = decoded.id;
      function Lid() {
          console.log(global1.id);
      }
      Lid();
      // 2) Check if user still exists
      const result = await client.query('SELECT * FROM user_tables WHERE user_id = $1', [decoded.id]);
      const result1 = await client.query("SELECT * FROM user_addresses WHERE user_id = $1", [decoded.id])
      const result4 = await client.query("SELECT * FROM bank_details WHERE user_id = $1",[decoded.id])
      const result5 = await client.query("SELECT * FROM user_documents WHERE user_id = $1",[decoded.id])
      const result6 = await client.query("SELECT * FROM user_loans WHERE user_id = $1",[decoded.id])
        if(!result) {
          if(!result1){
            if(!result4){
              if(!result5){
                if(!result6){
                  return next();
                }
                return next();
              }
              return next();
            }
            return next();
          }
          return next();
        }
        // THERE IS A LOGGED IN USER
        req.user = result.rows[0];
        req.user1 = result1.rows[0]
        req.user2 = result4.rows[0]
        req.user3 = result5.rows[0]
        req.user6 = result6.rows[0]
        // res.locals.user = result[0];
        console.log("next")
        return next();
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect('/')
  // res.status(200).redirect("/authservice/login");
};
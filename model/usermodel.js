const express = require('express');
const Sequelize = require('sequelize');


const connection = new Sequelize('Application','postgres','chandu',{
    host: 'localhost',
    dialect: 'postgres',
    port:'5433',
   // ssl: true
})


const User_details = connection.define('user_tables',{
    user_id: {
        user_id: Sequelize.STRING,
        type: Sequelize.STRING,
        primaryKey: true
    },
    user_phno: Sequelize.STRING,
    otp: Sequelize.STRING,
    otpverified: Sequelize.STRING,
    email: Sequelize.STRING,
    emailverified: Sequelize.STRING,
    user_fullname: Sequelize.STRING,
    user_gender: Sequelize.STRING,
    date_of_birth: Sequelize.STRING,
    education_qualification: Sequelize.STRING,
    owner_ship: Sequelize.STRING,
    user_pincode: Sequelize.STRING,
    city: Sequelize.STRING,
    employement_type: Sequelize.STRING,
    employe_name: Sequelize.STRING,
    work_date: Sequelize.STRING,
    disignation: Sequelize.STRING,
    salary_type: Sequelize.STRING,
    net_salary: Sequelize.STRING,
    upload_image: Sequelize.STRING,
    user_profile: Sequelize.STRING,
    created_at: Sequelize.STRING,
    login_at: Sequelize.STRING,
  },{
      timestamps: false,
});
const User_details1 = connection.define('user_address',{
    address_id: {
        address_id: Sequelize.STRING,
        type: Sequelize.STRING,
        primaryKey: true
    },
    user_id: {
        user_id: Sequelize.STRING,
        type: Sequelize.STRING,
        foreignKey: true
    },
    flate_no: Sequelize.STRING,
    area: Sequelize.STRING,
    town: Sequelize.STRING,
    state: Sequelize.STRING,
    district: Sequelize.STRING,
    zip: Sequelize.STRING,
    p_flate_no: Sequelize.STRING,
    p_area: Sequelize.STRING,
    p_town: Sequelize.STRING,
    p_state: Sequelize.STRING,
    p_district: Sequelize.STRING,
    p_zip: Sequelize.STRING,
    user_address: Sequelize.STRING,
    created_at: Sequelize.STRING,
    login_at: Sequelize.STRING,
  },{
      timestamps: false,
});
const User_details2 = connection.define('bank_detail',{
    bank_id: {
        bank_id: Sequelize.STRING,
        type: Sequelize.STRING,
        primaryKey: true
    },
    user_id: {
        user_id: Sequelize.STRING,
        type: Sequelize.STRING,
        foreignKey: true
    },
    bank_name: Sequelize.STRING,
    account_no: Sequelize.STRING,
    ifsc_code: Sequelize.STRING,
    upi: Sequelize.STRING,
    user_bank: Sequelize.STRING,
    created_at: Sequelize.STRING,
    login_at: Sequelize.STRING,
  },{
      timestamps: false,
});
const User_details3 = connection.define('user_document',{
    documents_id: {
        documents_id: Sequelize.STRING,
        type: Sequelize.STRING,
        primaryKey: true
    },
    user_id: {
        user_id: Sequelize.STRING,
        type: Sequelize.STRING,
        foreignKey: true
    },
    photo: Sequelize.STRING,
    aadhaar_front: Sequelize.STRING,
    aadhaar_back: Sequelize.STRING,
    pan_card: Sequelize.STRING,
    salary_slip: Sequelize.STRING,
    bank_statement: Sequelize.STRING,
    residental_proof: Sequelize.STRING,
    utility_bill: Sequelize.STRING,
    telephone_bill: Sequelize.STRING,
    passport: Sequelize.STRING,
    voter_id: Sequelize.STRING,
    driving_lisence: Sequelize.STRING,
    rental_agreement: Sequelize.STRING,
    company_hr: Sequelize.STRING,
    user_document: Sequelize.STRING,
    created_at: Sequelize.STRING,
    login_at: Sequelize.STRING,
  },{
      timestamps: false,
});
const User_details4 = connection.define('user_loan',{
    loan_id: {
        loan_id: Sequelize.STRING,
        type: Sequelize.STRING,
        primaryKey: true
    },
    user_id: {
        user_id: Sequelize.STRING,
        type: Sequelize.STRING,
        foreignKey: true
    },
    application_id: Sequelize.STRING,
    loan_amount: Sequelize.INTEGER,
    loan_duration: Sequelize.STRING,
    action: Sequelize.STRING,
    loan_interest: Sequelize.STRING,
    repayment_amount: Sequelize.STRING,
    repayment_duration: Sequelize.STRING,
    loan_status: Sequelize.STRING,
    created_at: Sequelize.STRING,
    login_at: Sequelize.STRING,
  },{
      timestamps: false,
});
connection
.sync({
    logging: console.log,
    force: true
});

module.exports = connection;

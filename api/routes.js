
var fileUploadModel = require('./models/user/fileupload.js');

var decisionController = require('./controllers/marksimos/decision.js');
var chartController = require('./controllers/marksimos/chart.js');
var reportController = require('./controllers/marksimos/report.js');
var initController = require('./controllers/marksimos/init.js');
var auth = require('./controllers/user/authentication.js');
var administratorController = require('./controllers/user/admin.js');
var studentController = require('./controllers/user/student.js');
var campaignController = require('./controllers/b2c/campaign.js');
var seminarController = require('./controllers/marksimos/seminar.js');
var glossaryController = require('./controllers/b2c/glossary.js');
var tagController = require('./controllers/b2c/tag.js');

var questionnaireController = require('./controllers/questionnaire.js');
var faqController  =  require('./controllers/faq.js');
var utility = require('../common/utility.js')
var userModel = require('./models/user/user.js');
var userRoleModel = require('./models/user/userrole.js');

var marksimosRight = userRoleModel.right.marksimos;
var logger = require('../common/logger.js');
var mongoose = require('mongoose');
var util = require('util');
var express = require('express');

var config = require('../common/config.js');
var userList = require('../common/user-list.js');

var apiRouter = express.Router();




/**********     Init Passport Auth     **********/
auth.initAuth();









/**********     Routes for rendering templates HCD Learning Website     **********/

apiRouter.get('/', function(req, res, next){
    logger.log("Website Host:", req.headers.host);
    if(req.headers.host.indexOf('bridgeplus.cn') !== -1){
        return res.redirect('/e4e');
    }else{
        return res.redirect('/cn');
    }

});

apiRouter.get('/admin', function(req, res, next){
    res.redirect('/marksimos/admin');
});








/**********     Routes for rendering templates E4E Website     **********/

apiRouter.get('/e4e', auth.authLoginToken({successRedirect: '/e4e/campaigns'}), function(req, res, next){
    res.render('b2c/registration/indexreg.ejs', {title : 'Welcome to Bridge+ '});
});

apiRouter.get('/e4e/emailverify/registration', auth.activateRegistrationEmail);


apiRouter.get('/e4e/login', function(req, res, next){
    res.render('b2c/login.ejs', {title:'Bridge+ Sign in to Your Account | Bridge+'});
});


apiRouter.get('/e4e/forgotpassword', function(req, res, next){
    res.render('b2c/forgotpassword/forgotpassword.ejs', {title:'Forgotten Your Password? | Bridge+'});
});
apiRouter.get('/e4e/emailverify/changepassword', auth.forgotPasswordStep2);


apiRouter.get('/e4e/profile', auth.authLoginToken({failureRedirect: '/e4e/login'}), auth.authRole(marksimosRight.studentLogin, {failureRedirect: '/e4e/login'}), function(req, res, next){
    res.render('b2c/profile.ejs', {title:'Bridge+ User Home | Bridge+'});
});

apiRouter.get('/e4e/campaigns',  campaignController.campaignListPage);
apiRouter.get('/e4e/campaign/:campaignId', auth.authLoginToken({failureRedirect: '/e4e/login'}), auth.authRole(marksimosRight.studentLogin, {failureRedirect: '/e4e/login'}), campaignController.campaignSingleInfoPage);

apiRouter.get('/e4e/about', function(req, res, next){
    res.render('b2c/about/about.ejs', {title:'About Bridge+ | Bridge+'});
});

apiRouter.get('/e4e/intro', function(req, res, next){
    res.render('b2c/about/intro.ejs', {title:'Project Introduction | Bridge+'});
});

apiRouter.get('/e4e/activity', function(req, res, next){
    res.render('b2c/about/activity.ejs', {title:'Newest Activities | Bridge+'});
});

apiRouter.get('/e4e/contact', function(req, res, next){
    res.render('b2c/about/contact.ejs', {title:'Contact | Bridge+'});
});

apiRouter.get('/e4e/media', function(req, res, next){
    res.render('b2c/about/unfinished.ejs', {title:'Media Reports | Bridge+'});
});

apiRouter.get('/e4e/cooperate', function(req, res, next){
    res.render('b2c/about/cooperate.ejs', {title:'Cooperation | Bridge+'});
});






/**********     Routes for rendering templates MarkSimos User/Student     **********/

apiRouter.get('/marksimos', auth.authLoginToken({failureRedirect: '/marksimos/login'}), auth.authRole(marksimosRight.studentLogin, {failureRedirect: '/marksimos/login'}), function(req, res, next){
    res.redirect('/marksimos/intro');
});

apiRouter.get('/marksimos/login', function(req, res, next){
    res.render('marksimosuser/userlogin.ejs', { title : 'MarkSimos - Sign In | HCD Learning'});
});

apiRouter.get('/marksimos/intro', auth.authLoginToken({failureRedirect: '/marksimos/login'}), auth.authRole(marksimosRight.studentLogin, {failureRedirect: '/marksimos/login'}), function(req, res, next){
    res.render('marksimosuser/userintroduction.ejs', { title : 'MarkSimos - Introduction Videos | HCD Learning'});
});

apiRouter.get('/marksimos/home', auth.authLoginToken({failureRedirect: '/marksimos/login'}), auth.authRole(marksimosRight.studentLogin, {failureRedirect: '/marksimos/login'}), function(req, res, next){
    res.render('marksimosuser/userhome.ejs', { title : 'MarkSimos - User Home | HCD Learning'});
});


apiRouter.get('/marksimos/help', function(req, res, next){
    res.render('marksimosuser/userhelp.ejs', { title : 'MarkSimos - Help | HCD Learning'});
});

//download file
apiRouter.get('/marksimos/download/manualeng', function(req, res, next){
    res.download('./public/app/file/MarkSimos_Participants_Manual.pdf');
});

apiRouter.get('/marksimos/download/manualchs', function(req, res, next){
    res.download('./public/app/file/MarkSimos_Participants_Manual_chs.pdf');
});

apiRouter.get('/marksimos/manual/zh_CN',function(req,res,next){
    res.render('marksimosuser/help/manual_cn.md',{layout:false});
});

apiRouter.get('/marksimos/manual/en_US',function(req,res,next){
    res.render('marksimosuser/help/manual_en.md',{layout:false});
});











/**********     Routes for rendering templates Administrator     **********/

apiRouter.get('/marksimos/admin', function(req, res, next){
    res.render('marksimosadmin/adminlogin.ejs', {title : 'Admin | Log in'});
});

apiRouter.get('/marksimos/adminhome', auth.authLoginToken({failureRedirect: '/marksimos/admin'}), auth.authRole(marksimosRight.adminLogin, {failureRedirect: '/marksimos/admin'}), function(req, res, next){
    res.render('marksimosadmin/adminhome.ejs', {title : 'Admin | Dashboard'});
});

apiRouter.get('/marksimos/adminhomereport/:seminar_id', auth.authLoginToken({failureRedirect: '/marksimos/admin'}), auth.authRole(marksimosRight.adminLogin, {failureRedirect: '/marksimos/admin'}), seminarController.seminarInfoForFacilitator);










/**********     Set Content-Type for all API JSON response     **********/

apiRouter.all("/e4e/api/*", function(req, res, next){
    res.set('Content-Type', 'application/json; charset=utf-8');
    next();
});

apiRouter.all("/marksimos/api/*", function(req, res, next){
    res.set('Content-Type', 'application/json; charset=utf-8');
    next();
});










/**********     API For E4E Student     **********/
apiRouter.post('/e4e/api/registercompany', auth.registerB2CEnterprise);
apiRouter.post('/e4e/api/registerstudent', auth.registerB2CStudent);

apiRouter.post('/e4e/api/register/username', auth.verifyUsername);
apiRouter.post('/e4e/api/register/email', auth.verifyEmail);
apiRouter.post('/e4e/api/register/mobilePhone', auth.verifyMobilePhone);

// comment-captcha-start
apiRouter.get('/e4e/api/captcha', auth.generateRegistrationCaptcha);
// comment-captcha-end

apiRouter.post('/e4e/api/forgotpasswordstep1', auth.sendResetPasswordEmail);
apiRouter.post('/e4e/api/forgotpasswordstep2', auth.verifyResetPasswordCode);
apiRouter.post('/e4e/api/forgotpasswordstep3', auth.resetNewPassword);


apiRouter.put('/e4e/api/student/password', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), studentController.updateStudentB2CPassword);
apiRouter.put('/e4e/api/student', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), studentController.updateStudentB2CInfo);

apiRouter.post('/e4e/api/student/avatar', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), fileUploadModel.multerUpload('studentavatar'), studentController.uploadStudentAvatar );

apiRouter.get('/e4e/api/student/phoneverifycode', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), auth.generatePhoneVerifyCode);
apiRouter.post('/e4e/api/student/phoneverifycode', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), auth.verifyPhoneVerifyCode);

apiRouter.post('/e4e/api/team', auth.authLoginToken(), auth.authRole(marksimosRight.teamInfoSingleCUD), studentController.updateTeam);
apiRouter.post('/e4e/api/team/student',  auth.authLoginToken(), auth.authRole(marksimosRight.teamInfoSingleGet), studentController.addStudentToTeam);
apiRouter.delete('/e4e/api/team/student/:student_id',  auth.authLoginToken(), auth.authRole(marksimosRight.teamInfoSingleCUD), studentController.removeStudentToTeam);

apiRouter.get('/e4e/api/campaigns/:campaignId', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleGet), campaignController.campaignSingleInfo);
apiRouter.post('/e4e/api/campaigns/teams', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleGet), campaignController.addTeamToCampaign);
apiRouter.post('/e4e/api/campaigns/teams/remove', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleGet), campaignController.removeTeamFromCampaign);






/**********     API For MarkSimos Student     **********/
apiRouter.post('/marksimos/api/login', auth.studentLogin);
apiRouter.get('/marksimos/api/logout', auth.logout);


// get seminar
apiRouter.get('/marksimos/api/user', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleGet), auth.getUserInfo);
apiRouter.get('/marksimos/api/student/seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfStudentGet), seminarController.getSeminarList);
apiRouter.get('/marksimos/api/choose_seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfStudentGet), seminarController.chooseSeminarForStudent);

//report
apiRouter.get('/marksimos/api/report/:report_name', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), reportController.getReport);

//chart
apiRouter.get('/marksimos/api/chart/:chart_name', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), chartController.getChart);

//final score
apiRouter.get('/marksimos/api/finalscore', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), reportController.getStudentFinalScore);


//company info
apiRouter.get('/marksimos/api/company', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), decisionController.getDecision);
apiRouter.get('/marksimos/api/product_portfolio', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), decisionController.getProductPortfolio);
apiRouter.get('/marksimos/api/spending_details', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), decisionController.getSpendingDetails);
apiRouter.get('/marksimos/api/future_projection_calculator/:sku_id', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), decisionController.getSKUInfoFutureProjection);
apiRouter.get('/marksimos/api/company/otherinfo', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), decisionController.getOtherinfo);

//make decision page
apiRouter.put('/marksimos/api/sku/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.updateSKUDecision);
apiRouter.post('/marksimos/api/sku/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.addSKU);
apiRouter.delete('/marksimos/api/sku/decision/:company_id/:brand_id/:sku_id', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.deleteSKU);

apiRouter.put('/marksimos/api/brand/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.updateBrandDecision);
apiRouter.post('/marksimos/api/brand/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.addBrand);

apiRouter.put('/marksimos/api/company/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.updateCompanyDecision);
apiRouter.put('/marksimos/api/company/decision/lock', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), decisionController.lockCompanyDecision);

//getQuestionnaire
apiRouter.get('/marksimos/api/questionnaire', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionGet), questionnaireController.getQuestionnaire);
apiRouter.put('/marksimos/api/questionnaire', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleDecisionCUD), questionnaireController.submitQuestionnaire);

//getFaq
apiRouter.get('/marksimos/api/faq', faqController.getFAQ);


//seminar online chat
apiRouter.post('/marksimos/api/seminar/chat/seminar', auth.authLoginToken(), seminarController.sendChatMessageSeminar);
apiRouter.post('/marksimos/api/seminar/chat/company', auth.authLoginToken(), seminarController.sendChatMessageSeminarCompany);

//get Glossary
apiRouter.post('/marksimos/api/glossaries', auth.authLoginToken(), auth.authRole(marksimosRight.glossaryInfoListGet), glossaryController.searchGlossaryWithWord);







/**********     API For Administrator     **********/
apiRouter.post('/marksimos/api/admin/login', auth.adminLogin);

// get current admin role
apiRouter.get('/marksimos/api/admin/user', auth.authLoginToken(), auth.authRole(marksimosRight.adminLogin), auth.getUserInfo);

apiRouter.get('/marksimos/api/admin/distributors', auth.authLoginToken(), auth.authRole(marksimosRight.distributorInfoListGet), administratorController.searchDistributor);
apiRouter.post('/marksimos/api/admin/distributors', auth.authLoginToken(), auth.authRole(marksimosRight.distributorInfoSingleCUD), administratorController.addDistributor);
apiRouter.put('/marksimos/api/admin/distributors/:distributor_id', auth.authLoginToken(), auth.authRole(marksimosRight.distributorInfoSingleCUD), administratorController.updateDistributor);


apiRouter.get('/marksimos/api/admin/facilitators', auth.authLoginToken(), auth.authRole(marksimosRight.facilitatorInfoListGet), administratorController.searchFacilitator);
apiRouter.post('/marksimos/api/admin/facilitators', auth.authLoginToken(), auth.authRole(marksimosRight.facilitatorInfoSingleCUD), administratorController.addFacilitator);
apiRouter.put('/marksimos/api/admin/facilitators/:facilitator_id',  auth.authLoginToken(), auth.authRole(marksimosRight.facilitatorInfoSingleCUD), administratorController.updateFacilitator);


apiRouter.get('/marksimos/api/admin/students', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoListGet), administratorController.searchStudent);
apiRouter.get('/marksimos/api/admin/students/byday', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoListGet), administratorController.listStudentNumberByDay);
apiRouter.post('/marksimos/api/admin/students', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), administratorController.addStudent);
apiRouter.put('/marksimos/api/admin/students/:student_id', auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), administratorController.updateStudent);



apiRouter.post('/marksimos/api/admin/students/reset_password',  auth.authLoginToken(), auth.authRole(marksimosRight.studentInfoSingleCUD), administratorController.resetStudentPassword);


//Facilitator manager Campaign
apiRouter.get('/marksimos/api/admin/campaigns', auth.authLoginToken(), auth.authRole(marksimosRight.campaignInfoListGet), campaignController.searchCampaign);
apiRouter.get('/marksimos/api/admin/campaigns/score', auth.authLoginToken(), auth.authRole(marksimosRight.campaignInfoListGet), campaignController.searchTeamMarksimosScore);
apiRouter.get('/marksimos/api/admin/campaigns/teamcount', auth.authLoginToken(), auth.authRole(marksimosRight.campaignInfoListGet), campaignController.countTeamJoinCampaign);
apiRouter.post('/marksimos/api/admin/campaigns', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), campaignController.addCampaign);
apiRouter.put('/marksimos/api/admin/campaigns', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), campaignController.updateCampaign);
apiRouter.post('/marksimos/api/admin/campaigns/upload', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), fileUploadModel.multerUpload(), campaignController.uploadCampaignPics );


apiRouter.post('/marksimos/api/admin/campaigns/seminars', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), campaignController.addMarkSimosSeminarToCampaign);
apiRouter.post('/marksimos/api/admin/campaigns/seminars/remove', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), campaignController.removeMarkSimosSeminarFromCampaign);

apiRouter.post('/marksimos/api/admin/campaigns/teams', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), campaignController.addTeamToCampaign);
apiRouter.post('/marksimos/api/admin/campaigns/teams/remove', auth.authLoginToken(), auth.authRole(marksimosRight.campaignSingleCUD), campaignController.removeTeamFromCampaign);


//Facilitator manager seminars
apiRouter.get('/marksimos/api/admin/facilitator/seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), seminarController.getSeminarOfFacilitator);
apiRouter.post('/marksimos/api/admin/seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleCUD), seminarController.addSeminar);
apiRouter.put('/marksimos/api/admin/seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarSingleCUD), seminarController.updateSeminar);


apiRouter.post('/marksimos/api/admin/assign_student_to_seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarAssignStudentCUD), seminarController.assignStudentToSeminar);
apiRouter.post('/marksimos/api/admin/remove_student_from_seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarAssignStudentCUD), seminarController.removeStudentFromSeminar);

apiRouter.post('/marksimos/api/admin/seminar/:seminar_id/init', auth.authLoginToken(), auth.authRole(marksimosRight.seminarInit), initController.init());
apiRouter.post('/marksimos/api/admin/seminar/:seminar_id/runsimulation', auth.authLoginToken(), auth.authRole(marksimosRight.seminarRunRound), initController.runSimulation());
apiRouter.post('/marksimos/api/admin/seminar/:seminar_id/unlockDecision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarRunRound), seminarController.updateSeminarUnlockDecision);

apiRouter.get('/marksimos/api/admin/delphi_cgi', auth.authLoginToken(), auth.authRole(marksimosRight.seminarInit), initController.getCgiStatus);



//facilitator decisions, report, chart
//note : To get full version of some reports, plz make sure user role != student
apiRouter.get('/marksimos/api/admin/seminar/:seminar_id/decisions', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), decisionController.getDecisionForFacilitator);

apiRouter.get('/marksimos/api/admin/report/:report_name', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), reportController.getReport);
apiRouter.get('/marksimos/api/admin/chart/:chart_name', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), chartController.getChart);
apiRouter.get('/marksimos/api/admin/finalscore/:seminarId', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), reportController.getStudentFinalScore);

apiRouter.get('/marksimos/api/admin/questionnaire/:seminarId', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), questionnaireController.getQuestionnaireListForAdmin);

apiRouter.put('/marksimos/api/admin/sku/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarDecisionsOfFacilitatorCUD), decisionController.updateSKUDecision);
apiRouter.put('/marksimos/api/admin/brand/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarDecisionsOfFacilitatorCUD), decisionController.updateBrandDecision);
apiRouter.put('/marksimos/api/admin/company/decision', auth.authLoginToken(), auth.authRole(marksimosRight.seminarDecisionsOfFacilitatorCUD), decisionController.updateCompanyDecision);

//seminar online chat
apiRouter.post('/marksimos/api/admin/seminar/chat/seminar', auth.authLoginToken(), auth.authRole(marksimosRight.seminarListOfFacilitatorGet), seminarController.sendChatMessageSeminar);



//Facilitator manager Glossary
apiRouter.get('/marksimos/api/admin/glossaries', auth.authLoginToken(), auth.authRole(marksimosRight.glossaryInfoListGet), glossaryController.searchGlossary);
apiRouter.post('/marksimos/api/admin/glossaries', auth.authLoginToken(), auth.authRole(marksimosRight.glossarySingleCUD), glossaryController.addGlossary);
apiRouter.put('/marksimos/api/admin/glossaries', auth.authLoginToken(), auth.authRole(marksimosRight.glossarySingleCUD), glossaryController.updateGlossary);

apiRouter.get('/marksimos/api/admin/tags', auth.authLoginToken(), auth.authRole(marksimosRight.glossaryInfoListGet), tagController.searchTag);




/**********     Database Init     **********/
apiRouter.get('/marksimos/api/initfaq', faqController.initFAQ);

apiRouter.get('/marksimos/api/create_admin', function (req,res,next) {

    userModel.find({role: userRoleModel.roleList.admin.id}).execQ().then(function (userResult) {
        if (userResult.length) {
            //已经存在管理员了，不进行初始化，只列出这些用户

            // 补充增加 b2c_facilitator 账号
            userModel.findOne({"username": "b2c_facilitator"}).execQ().then(function (userB2CResult) {
                console.log(userB2CResult);
                if(userB2CResult){
                    return res.status(400).send ({message: "already added."});
                }else{
                    userModel.create(userList[3], function (err, b2cFacilitatorResults) {
                        if (err) {
                            return res.status(400).send( {message: "add default admin and users failed."});
                        } else {
                            //for (var i=1; i<arguments.length; ++i) {
                            //    var user = arguments[i];
                            //    // do some stuff with candy
                            //}

                            return res.status(200).send(b2cFacilitatorResults);
                        }
                    });
                }
            }).fail(function(err){
                next (err);
            }).done();


        }else {
            //不存在管理员，需要初始化
            userModel.create(userList, function (err) {
                if (err) {
                    return res.status(400).send( {message: "add default admin and users failed."});
                } else {
                    //for (var i=1; i<arguments.length; ++i) {
                    //    var user = arguments[i];
                    //    // do some stuff with candy
                    //}

                    var userListResults = Array.prototype.slice.call(arguments, 1);
                    return res.status(200).send(userListResults);
                }
            });
        }
    }).fail(function(err){
        next (err);
    }).done();
});





module.exports = apiRouter;


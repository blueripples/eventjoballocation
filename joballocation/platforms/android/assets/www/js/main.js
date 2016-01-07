var serverURL = 'http://digitaleffectz.co.uk/discopartydjs/EventJobAllocation/';
function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}
//Checking for Pre-authentication
function checkPreAuth() {
	var form = $("#loginForm");
		if(window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
			$("#email", form).val(window.localStorage["email"]);
			$("#password", form).val(window.localStorage["password"]);
			handleLogin();
}
}
//Authentication Login
function handleLogin() {

	var form = $("#loginForm");
	//disable the button so we can't resubmit while we wait
	$("#loginButton",form).attr("disabled","disabled");
	var email = $("#email", form).val();
	var password = $("#password", form).val();
	if(email != '' && password!= '') {
	window.plugins.spinnerDialog.show(null, null, true);
		$.post(serverURL+"login.php",
		$("#loginForm :input").serializeArray(),
			function(res) {
			//$('#msg').text(res);
			if(res == 'Success') {

			//store
				window.localStorage["email"] = email;
				window.localStorage["password"] = password;
				//$.mobile.changePage("#events", {transition: "slide"});
				$('#email , #password').val('');
				$.mobile.changePage("#mydiary", {transition: "slide"});
				//fetching data
					fetchDiaryEvents();
					fetchInvitedEvents();
					viewProfile();
					viewBiodata();
					//fetchEvents();
			} else if(res == 'deactivated'){
			navigator.notification.alert('Your account has been deactivated, Contact your administrator to activate.',function() {});
			window.plugins.spinnerDialog.hide();
			}else {
             		navigator.notification.alert("Your login failed, Email or Password incorrect", function() {});
             		window.plugins.spinnerDialog.hide();
             		}
		$("#loginButton").removeAttr("disabled");

		});
	} else {
	//Thanks Igor!
	window.plugins.spinnerDialog.hide();
	navigator.notification.alert("You must enter a valid email and password", function() {});
	$("#loginButton").removeAttr("disabled");
	}
	return false;
}
//Registration
function registration(){
	var form = $("#registrationForm");
	var name = $("#name", form).val();
	var email = $("#email", form).val();
	var validEmail = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	var pass = $("#password", form).val();
	var rePass = $("#re-password", form).val();
		if(name != '' && email != '' && pass != '' && rePass != '' ){
			if(validEmail.test(email)){
				if(pass.length>=6){
					if(pass==rePass){
                    	window.plugins.spinnerDialog.show('', 'Loading...', true);
                    	 $.post(serverURL+"registration.php",
                    	 $("#registrationForm :input").serializeArray(),
                    	 function(info){
                    		if(info == 0){
                    			navigator.notification.alert("'"+ email + "' already in use try another valid email.",null,'Registration failed');
                    			window.plugins.spinnerDialog.hide();
                    			$('#email, #password, #re-password').val('');
                    		}else{
                    			//$("#message").html(info);
                    			$('#name, #email, #password, #re-password').val('');
                    			 navigator.notification.alert('You are successfully registered',null,'Sucess','OK');
                    			$.mobile.changePage("#loginPage",{ transition: "slide"});
                    			window.plugins.spinnerDialog.hide();
                    		}

                    });

                    }else{
                    	navigator.notification.alert("Password Does not Match");
                    }

				}else{
					navigator.notification.alert("Password should be minimum of 6 characters");
				}
		}else{
			navigator.notification.alert("Enter a valid email");
		}
		}else{
	navigator.notification.alert("Fill all the fields");
	}
	return false;
}
//Verification
function verification(){
 	var form = $("#verificationForm");
 	var email = $("#email", form).val();
 		if(email != ''){
			window.plugins.spinnerDialog.show('', 'Loading...', true);
 			$.post(serverURL+"verification.php",
 				 $("#verificationForm :input").serializeArray(),
 				 function(info){
						if(info=='No registered email found.'){
							$.mobile.loading( "hide" );
 							navigator.notification.alert('No registered email found.');
 						}else{
 						window.plugins.spinnerDialog.hide();
 						navigator.notification.alert('Verification code has been sent to your email.',null,'Code sent','OK');
                        $.mobile.changePage("#verificationCodepage", { transition: "slide" });
                        //$('#message4').text(info);
                        $("#confirmCodeButton").on("click",confirmVerification);
							var vercode = info;
							function confirmVerification(vercode){
								var form = $("#verificationCodeForm");
								var vcode = $("#vcode", form).val();
								if(vcode != ''){

									if(vcode == info){
										navigator.notification.alert('Reset your password now',null,'Success','OK');
										$.mobile.changePage("#forgotPasswordpage", { transition: "slide"});
										$("#confirmCodeButton").off("click",confirmVerification);
										$("#verificationCodeForm #vcode").val('');
									}else{
										navigator.notification.alert('Verification Code Incorrect',null,'Failed','OK');
										$("#vcode", form).val('');
									}
								}else{
									navigator.notification.alert('Enter verification code',null,'Alert','OK');
								}
								return false;
							}
					}
 				});
		 }else{
 			navigator.notification.alert("Fill all the fields");
 		}
 	return false;
 }
//Forgot Password
function forgotPassword(){
 	var form = $("#forgotForm");
 	//var email = $("#email", form).val();
 	var pass = $("#password", form).val();
 	var rePass = $("#re-password", form).val();
 		if(pass != '' && rePass != '' ){
 			if(pass.length>=6){
				if(pass==rePass){
					window.plugins.spinnerDialog.show('', 'Loading...', true);
					 $.post(serverURL+"forgotpassword.php",
					 $("#verificationForm :input , #forgotForm :input").serializeArray(),
					 function(info){
							if(info=='No registered email found.'){
								navigator.notification.alert('No registered email found.');
							}else{
								 $('#forgotForm :input',"#verificationForm :input","#verificationCodeForm :input").val('');
								 navigator.notification.alert('Your password has been Reset',null,'Sucess','OK');
								 $('#loginPage #email').val($('#verificationForm #email').val());
								 $.mobile.changePage("#loginPage", { transition: "slide" });
							}
						 });
						window.plugins.spinnerDialog.hide();
				}else{
					navigator.notification.alert("Password Does not Match");
				}
				}else{
					navigator.notification.alert('Password should be minimum of 6 characters');
				}
 		}else{
 	navigator.notification.alert("Fill all the fields");
 	}
 	return false;
 }

//Update Profile
function updateProfile(){
	var form = $("#profileForm");
	var name = $("#name", form).val();
	var email = $("#email", form).val();
    var phone = $("#phone", form).val();
    var validPhone = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
    var validEmail = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		if(name != '' && email != '' && phone != '' ){
			if(validEmail.test(email)){
				if(validPhone.test(phone) && phone.length<=16){
					window.plugins.spinnerDialog.show('', 'Loading...', true);
				$.post(serverURL+"profile.php",
                   	$("#profileForm :input").serializeArray(),
                   	function(info){
                   		if(info == 'Already registered'){
							navigator.notification.alert("'"+ email + "' already in use try another valid email.",null,'Update failed');
							window.plugins.spinnerDialog.hide();
                   		}else{
                            navigator.notification.alert('Your Profile Updated',null,'Sucess','OK');
							window.plugins.spinnerDialog.hide();
							viewProfile();
							//$.mobile.changePage("#profile", { transition: "slide" });
                   		}
                   	});
				}else{
					navigator.notification.alert('Enter a valid Phone number');
				}
			}else{
				navigator.notification.alert('Enter a valid email');
			}

		}else{
			navigator.notification.alert("Fill all the fields");
		}
 	return false;
 }

//View Profile

function viewProfile(){
			$.ajax({
				  method: "POST",
				  url: serverURL+"viewprofile.php",
				  dataType: "json"
				})
				  .done(function( data ) {
					//alert( "Data Saved: " + msg );
					$.each(data, function(key, value){
						//alert( value.event_name );
						var viewProfilepic = $('#profile #main_profilepic');
						var viewPanelProfilepic = $('.panel_profilepic');
						var editProfilepic = $('#editProfile #avatar');
						var viewPhone = $('#profile #prophone');
						var viewUsename = $('#profile .profile-head .user_name');
						var panel_user = $('.panel_user');
						var viewEmail = $('#profile #proemail');
						var panelEmail = $('.panel_email');
						var editEmail = $('#profileForm #email');
						var editName = $('#profileForm #name');
						var editPhone = $('#profileForm #phone');
						var defaultimage = 'img/avatar1.png';

						if(value.image_path == ''){
							viewProfilepic.attr('src',defaultimage);
							editProfilepic.attr('src',defaultimage);
							viewPanelProfilepic.attr('src',defaultimage);
						}else{
							viewProfilepic.attr('src',value.image_path);
							editProfilepic.attr('src',value.image_path);
							viewPanelProfilepic.attr('src',value.image_path);
						}
						if(value.phone == ''){
								viewPhone.attr('Add a phone number');
								editPhone.attr('placeholder','Add phone number');
							}else{
								viewPhone.html(value.phone);
								editPhone.val(value.phone);
							}
						viewUsename.html(value.Name);
						panel_user.html(value.Name);
						viewEmail.html(value.email);
						panelEmail.html(value.email);
						editEmail.val(value.email);
						editName.val(value.Name);
					});
				  });

}

//View Bio-data
function viewBiodata(){
			$.ajax({
				  method: "POST",
				  url: serverURL+"viewbiodata.php",
				  dataType: "json"
				})
				  .done(function( data ) {
					//alert( "Data Saved: " + data );
					$.each(data, function(key, value){
						 var bioList = $("#bio #bio_view_list"),
							 fullname = $('#bio_view_list #bio_name'),
							 gender = $('#bio_view_list #bio_gender'),
							 location = $('#bio_view_list #bio_location'),
							 experince = $('#bio_view_list #bio_exper'),
							 bio = $('#bio_view_list #bio_bio'),
							 equipment = $('#bio_view_list #equipment'),
							 areascover = $('#bio_view_list #bio_areas'),
							 fbLink = $('#bio_view_list #fb_linkv'),
							 twtLink = $('#bio_view_list #twt_linkv'),
							 webLink = $('#bio_view_list #web_linkv'),
							 eBfname = $('#editBio #fname'),
							 eBlname = $('#editBio #lname'),
							 eBgender = $('#editBio #select-choice-1'),
							 eBlocation = $('#editBio #location'),
							 eBexper = $('#editBio #select-choice-2'),
							 eBbiotext = $('#editBio #bio_text'),
							 eBeqtext = $('#editBio #bio_eq_text'),
							 eBareacov = $('#editBio #bio_areas_text'),
							 eBfb = $('#editBio #fb_link'),
							 eBtwt = $('#editBio #twt_link'),
							 eBweb = $('#editBio #wetsite_link');
							 opBfb = $('#bio .bio_fb');
							 opBtwt = $('#bio .bio_twt');
							 opBweb = $('#bio .bio_web');
							 eBcount1 = $('#editBio #bio_count1');
							 eBcount2 = $('#editBio #bio_eq_count2');
							 eBcount3 = $('#editBio #bio_area_count3');
							 bioLengh = 200 - value.bio.length+'/200';
							 eqLengh = 200 - value.equipment.length+'/200';
							 acLengh = 200 - value.areas_cover.length+'/200';

						fullname.html(value.first_name+' '+value.last_name);
						gender.html(value.gender);
						location.html(value.location);
						experince.html(value.experience);
						bio.html(value.bio);
						equipment.html(value.equipment);
						areascover.html(value.areas_cover);
						fbLink.html(value.facebook);
						if(value.facebook!=''){opBfb.attr('href',value.facebook)}
						if(value.twitter!=''){opBtwt.attr('href',value.twitter)}
						if(value.website!=''){opBweb.attr('href',value.website)}
						twtLink.html(value.twitter);
						webLink.html(value.website);
						eBfname.val(value.first_name);
						eBlname.val(value.last_name);
						eBgender.val(value.gender);
						eBlocation.val(value.location);
						eBexper.val(value.experience);
						eBbiotext.val(value.bio);
						eBeqtext.val(value.equipment);
						eBareacov.val(value.areas_cover);
						eBfb.val(value.facebook);
						eBtwt.val(value.twitter);
						eBweb.val(value.website);
						eBcount1.html(bioLengh);
						eBcount2.html(eqLengh);
						eBcount3.html(acLengh);
					});
				  });

}
//update Bio data

function updateBiodata(){
 	var form = $("#bioForm");
 	var fname = $("#fname", form).val();
 	var lname = $("#lname", form).val();
 	var gender = $("#select-choice-1").val();
 	var location = $("#location", form).val();
 	var experience = $("#select-choice-2").val();
 	var bio_txt = $("#bio_text", form).val();
 	var bio_eq_text = $("#bio_eq_text", form).val();
 	var bio_areas_text = $("#bio_areas_text", form).val();
 	var fb = $("#fb_link", form).val();
 	var twt = $("#twt_link", form).val();
 	var web = $("#wetsite_link", form).val();

		if(fname != '' && lname != ''&& gender != '' && location != '' && experience != '' && bio_txt != '' && bio_eq_text != '' && bio_areas_text != ''){

 				window.plugins.spinnerDialog.show(null, null, true);
 				 $.post(serverURL+"biodataupdate.php",
 				 {fname:fname, lname:lname, gender:gender, location:location, experience:experience, bio:bio_txt, equipment:bio_eq_text, areascover:bio_areas_text, facebook:fb, twitter:twt, website:web})
 				 .done(function( data ) {

 				 navigator.notification.alert("Bio data Updated",null,'Sucess');
                     viewBiodata();
                     //$.mobile.changePage("#bio", { transition: "slide" });
                   });
 					window.plugins.spinnerDialog.hide();
 		}else{
 		$('#bioForm :input').each(function(){
 			if($(this).val() == ''){
 				$(this).addClass('invalidInput');
 				$('#bioForm #bioSubmit').removeClass('invalidInput');
 			}else{
 				$(this).removeClass('invalidInput');
 			}
 		});
 	navigator.notification.alert("Fill all required fields");
 	}
 	return false;
 }
function removeValidate(){
	$(this).removeClass('invalidInput');
}
//Logout
 function logout(){
 	window.plugins.spinnerDialog.show('', 'Loading...', true);
 	window.localStorage.clear();
    $.mobile.changePage("#loginPage", { transition: "slide" });
   window.plugins.spinnerDialog.hide();
    $.post(serverURL+"logout.php",
    function(res){
   	 return false;
    }

    );

 }
 //Prevent Backbutton to navigate

 function backButtonCallback() {

 if($.mobile.activePage.is('#mydiary,#events,#avmarker,#loginPage')){
 	navigator.notification.confirm('Do you want to exit the app?',confirmCallback);
 }else if($.mobile.activePage.is('#eventDetails')){
	$.mobile.changePage("#mydiary", {reverse: true, transition: "slide" });

 }else if($.mobile.activePage.is('#diaryEventDetails')){
 $.mobile.changePage("#events", {reverse: true, transition: "slide" });
 $('#back_to_evnts').trigger('click');
 }else if($.mobile.activePage.is('#verificationCodepage')){
	$.mobile.changePage("#verificationCodepage", {reverse: true, transition: "none" });
 }else if($.mobile.activePage.is('#forgotPasswordpage')){
  	$.mobile.changePage("#forgotPasswordpage", {reverse: true, transition: "none" });
  }else{
	navigator.app.backHistory()
 }

 }

 function confirmCallback(buttonIndex) {
    if(buttonIndex == 1) {
       navigator.app.exitApp();
    return true;
 }
 else {
    return false;
 }
 }

 //Menu Swipe
function swipePanel1(){
	$( "#panel1" ).panel( "open" );}
function swipePanel2(){
	$( "#panel2" ).panel( "open" );}

//Allocated Events
function fetchDiaryEvents(){
//window.plugins.spinnerDialog.show('', 'Loading...', true);
	$.getJSON(serverURL+"allocatedEvents.php", function(data){
		if(data.result == ''){
		$("#mydairy_list").empty();
		$("#mydairy_list").append("<h2 style='text-align:center;margin-top:20%;color:#ccc;'>No events available</h2>");
		//window.plugins.spinnerDialog.hide();
		$("div.pull-demo-page ul.ui-listview").listview("refresh");
		}else{
			$("#mydairy_list").empty();
			$.each(data.result, function(){
			$("#mydairy_list").prepend("<li><a id='dirayList' class='ui-btn ui-btn-icon-right ui-icon-carat-r' href='#'><span style='display:none;'>"+this['q_foreignkey']+"</span><h2>"+this['b_event_type']+"</h2><p><strong>"+this['b_customername']+"</strong></p><p>"+this['b_date_of_event']+"</p></a></li>");
			});
			//window.plugins.spinnerDialog.hide();
			$("div.pull-demo-page ul.ui-listview").listview("refresh");
		}
		$('#mydairy_list li').on('click','#dirayList',function(){
			window.plugins.spinnerDialog.show('', 'Loading...', true);
					var q_id = $(this).closest('a').find('span').html();
						$.ajax({
						  method: "POST",
						  url: serverURL+"eventdetails.php",
						  dataType: "json",
						  data: { q_id:q_id }
						})
						  .done(function( data ) {
							//alert( "Data Saved: " + msg );
							 $.each(data, function(key, value){
								//alert( value.event_name );
								$('#eventHeadE, #cus_nameE, #phoneE, #event_dateE, #event_typeE, #venue_addE, #postcodeE, #event_startE, #event_endE, #event_priceE, #event_notesE').empty();
								$('#event_typeE,#eventHeadE').html(value.q_event_type);
								$('#cus_nameE').html(value.q_customername);
								$('#phoneE').html(value.q_telephone);
								$('#event_dateE').html(value.q_date_of_event);
								$('#venue_addE').html(value.q_location);
								$('#postcodeE').html(value.q_postcode);
								$('#event_startE').html(value.q_start_time);
								$('#event_endE').html(value.q_end_time);
								$('#event_priceE').html(value.q_rem_price);
								$('#event_notesE').html(value.q_notes);
								$.mobile.changePage('#eventDetails',{reverse:false, transition: "slide" });
							});

						  });
                              window.plugins.spinnerDialog.hide();
        				});
	});
	window.plugins.spinnerDialog.hide();
}


//Invited Events
var AccNotifier = 1;
var RejNotifier = 1;
function fetchInvitedEvents(){
//window.plugins.spinnerDialog.show('', 'Loading...', true);
	$.getJSON(serverURL+"invitedEvents.php", function(data){
		if(data.result == ''){
			$("#events_list").empty();
			$("#events_list").append("<h2 style='text-align:center;margin-top:20%;color:#ccc;'>No events available</h2>");
			//window.plugins.spinnerDialog.hide();
			$("div.pull-demo-page ul.ui-listview").listview("refresh");
		}else{
			$("#events_list").empty();
				$.each(data.result, function(){
					if(this['b_accepted']=='accepted'){
					//$("#events_list").prepend("<li><a id='dirayList' class='ui-btn ui-btn-icon-right ui-icon-carat-r' href='#'><span style='display:none;'>"+this['q_foreignkey']+"</span><h2>"+this['b_event_type']+"</h2><p><strong>"+this['b_customername']+"</strong></p><p>"+this['b_date_of_event']+"</p><p>"+this['b_accepted']+"</p></a></li>");
					$("#events_list").prepend("<li class='ui-li-has-alt'><a id='dirayList' class='ui-btn' href='#'><span style='display:none;'>"+this['q_foreignkey']+"</span><h2>"+this['b_event_type']+"</h2><p><strong>"+this['b_customername']+"</strong></p><p>"+this['b_date_of_event']+"</p></a><a class='eventaction ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a' id='event_accept' href='#' style='border-radius: 50%;'></a></li>");
					}else{
					//$("#events_list").prepend("<li><a id='dirayList' class='ui-btn ui-btn-icon-right ui-icon-carat-r' href='#'><span style='display:none;'>"+this['q_foreignkey']+"</span><h2>"+this['b_event_type']+"</h2><p><strong>"+this['b_customername']+"</strong></p><p>"+this['b_date_of_event']+"</p></a></li>");
					$("#events_list").prepend("<li class='ui-li-has-alt'><a id='dirayList' class='ui-btn' href='#'><span style='display:none;'>"+this['q_foreignkey']+"</span><h2>"+this['b_event_type']+"</h2><p><strong>"+this['b_customername']+"</strong></p><p>"+this['b_date_of_event']+"</p></a><a class='eventaction ui-btn ui-btn-icon-notext reject ui-icon-gear ui-btn-a' id='event_reject' href='#' style='border-radius: 50%;'></a></li>");
					}

				});
				//window.plugins.spinnerDialog.hide();
				$("div.pull-demo-page ul.ui-listview").listview("refresh");
		}
		$('#events_list li').on('click','#dirayList',function(){
		 AccNotifier++;
		 RejNotifier++;
		$('#diaryEventDetailsList').empty();
		$.mobile.changePage('#diaryEventDetails',{reverse:false, transition: "slide" });
			window.plugins.spinnerDialog.show('', 'Loading...', true);
					var q_id = $(this).closest('a').find('span').html();

					$.post(serverURL+'acceptEvent.php',{accepted_evnt:q_id}).done(function(data){
						if(data == 1){
							$('#accepted_DD_evnts').show();
							$('#accept_DD_evnts').hide();
							$('#reject_DD_evnt').hide();
						}else{
							$('#accepted_DD_evnts').hide();
							$('#accept_DD_evnts').show();
							$('#reject_DD_evnt').show();
						}
						});
						$.ajax({
						  method: "POST",
						  url: serverURL+"eventdetails.php",
						  dataType: "json",
						  data: { q_id:q_id }
						})
						  .done(function( data ) {
							//alert( "Data Saved: " + msg );
							$.each(data, function(key, value){
								//alert( value.event_name );
								$('#diaryEventDetailsList').empty();

								$('#eventHead, #event_nameD, #cus_nameD, #phoneD, #event_dateD, #event_typeD, #venue_addD, #postcodeD, #event_startD, #event_endD, #event_priceD, #event_notesD').empty();
									$('#event_typeD,#eventHead').html(value.q_event_type);
									$('#cus_nameD').html(value.q_customername);
									$('#phoneD').html(value.q_telephone);
									$('#event_dateD').html(value.q_date_of_event);
									$('#venue_addD').html(value.q_location);
									$('#postcodeD').html(value.q_postcode);
									$('#event_startD').html(value.q_start_time);
									$('#event_endD').html(value.q_end_time);
									$('#event_priceD').html(value.q_rem_price);
									$('#event_notesD').html(value.q_notes);

							});
								 $('#diaryEventDetails').on('click','#accept_DD_evnts',rectify);
								 $('#diaryEventDetails').on('click','#reject_DD_evnt',rejectDiaryEvent);
										 function rectify(){
												navigator.notification.confirm('Do you want to accept this event?',acceptEvent,'Accept?',['Accept','Cancel']);
											 function acceptEvent(buttonIndex) {
												if(buttonIndex == 1) {
												   $.post(serverURL+'acceptEvent.php',{accept_evnt:q_id}).done(function(){

												    cordova.plugins.notification.local.schedule({
                                                   				  id         : AccNotifier,
                                                   				  title      : 'You have accepted '+$('#event_typeD').html()+' on '+$('#event_dateD').html()+' -Pending',
                                                   				  text       : 'Thank you for accepting the Job. Our team are now working all applicants to make a decision. Good Luck!',
                                                   				  sound      : 'res://platform_default',
                                                   				  icon		 :'res/drawable/icon.png',
                                                                  smallIcon	 :'res/drawable/abap.png',
                                                   				  autoClear  : false,

                                                   				});
                                                   		fetchInvitedEvents();
												   });
												   $('#accept_DD_evnts').hide();
												   $('#reject_DD_evnt').hide();
												   $('#accepted_DD_evnts').show();

													$('#diaryEventDetails').off('click','#accept_DD_evnts',rectify);
												return true;
											 }
											 else {
												return false;
											 }
											 }
										}
									function rejectDiaryEvent(){
										navigator.notification.confirm('Do you want to reject this event?',rejectEvent,'Reject?',['Reject','Cancel']);
										 function rejectEvent(buttonIndex) {
												if(buttonIndex == 1) {
												 cordova.plugins.notification.local.schedule({
													  id         : RejNotifier,
													  title      : 'Sorry you missed out this time '+$('#event_typeD').html()+' on '+$('#event_dateD').html(),
													  text       : 'We are sorry to inform you that this job was not allocated to you on this occasion. Keep going and we hope you the best of luck next time!',
													  sound      : 'res://platform_default',
													  icon		 :'res/drawable/icon.png',
                                                      smallIcon	 :'res/drawable/abap.png',
													  autoClear  : false,

													});
												  $.post(serverURL+'acceptEvent.php',{reject_evnt:q_id}).done(function(){
														fetchInvitedEvents();
														$.mobile.changePage('#events',{reverse:false, transition: "slide" });
														calendarRefresh();
													 });
												$('#diaryEventDetails').off('click','#reject_DD_evnt',rejectDiaryEvent);
												return true;
											 }
											 else {
												return false;
											 }
											 }
									}
								$('#back_to_evnts').on('click',prevetLooConfirmation);
								function prevetLooConfirmation(){
									$('#diaryEventDetails').off('click','#accept_DD_evnts',rectify);
									$('#diaryEventDetails').off('click','#reject_DD_evnt',rejectDiaryEvent);
									}
						 window.plugins.spinnerDialog.hide();
						   });
        				});
        				window.plugins.spinnerDialog.hide();
	});
}

//Events available
//function fetchEvents(){
	//$.getJSON(serverURL+"openevents.php", function(data){

	//	if(data.result == ''){
	//	$("#events_list").append("<h2 style='text-align:center;margin-top:20%;'>No events available</h2>");
	//	}else{
	//		$("#events_list").empty();
	//		$.each(data.result, function(){
	//		var param1 = new Date();
	//		var param2 = param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();
	//		$("#events_list").prepend("<li class='ui-li-has-alt'><a id='achornav' class='ui-btn' href='#'><span style='display:none;'>"+this['q_foreignkey']+"</span><h2>"+this['b_event_type']+"</h2><p><strong>"+this['b_customername']+"</strong></p><p>"+this['b_date_of_event']+"</p></a><a style='right: 4px; border-radius: 50%;' class='eventaction ui-btn ui-btn-icon-notext reject ui-icon-gear ui-btn-a' id='event_reject' href='#'></a><a class='eventaction ui-btn ui-btn-icon-notext ui-icon-gear ui-btn-a' id='event_accept' href='#' style='border-radius: 50%;'></a></li>");

	//			});
	//	}

	//	$('#events_list li').on('click','#achornav',function(){
	//			var q_id = $(this).closest('a').find('span').html();
	//				$.ajax({
    //                  method: "POST",
    //                  url: serverURL+"eventdetails.php",
    //                  dataType: "json",
    //                  data: { q_id:q_id }
    //                })
    //                  .done(function( data ) {
    //                    //alert( "Data Saved: " + msg );
    //                   $.each(data, function(key, value){
	//						//alert( value.event_name );
	//						$('#eventHeadE, #cus_nameE, #phoneE, #event_dateE, #event_typeE, #venue_addE, #postcodeE, #event_startE, #event_endE, #event_priceE, #event_notesE').empty();
	//						$('#event_typeE,#eventHeadE').html(value.q_event_type);
	//						$('#cus_nameE').html(value.q_customername);
	//						$('#phoneE').html(value.q_telephone);
	//						$('#event_dateE').html(value.q_date_of_event);
	//						$('#venue_addE').html(value.q_location);
	//						$('#postcodeE').html(value.q_postcode);
	//						$('#event_startE').html(value.q_start_time);
	//						$('#event_endE').html(value.q_end_time);
	//						$('#event_priceE').html(value.q_fullprice);
	//						$('#event_notesE').html(value.q_notes);
	//						$.mobile.changePage('#eventDetails',{reverse:false, transition: "slide" });
    //                    });
    //                  });
	//			});

	//			$('#events_list li').on('click','#event_accept',function(){
	//				var $this = $(this);
	//				var newid = $this.prev('a').prev('a').find('span').html();
	//					$.post(serverURL+'acept_reject.php',{fkey:newid}).done(function(data){
	//					navigator.notification.alert('This event moved to your diary');
	//					$this.closest('li').remove();
	//					fetchDiaryEvents();
	//					});
	//				  //navigator.notification.alert('Event id '+newid+' Accepted');

	//				});
	//			$('#events_list li').on('click','#event_reject',function(){
	//				var $this = $(this);
	//				var newid = $this.prev('a').find('span').html();
	//					 navigator.notification.confirm('Do you want to Reject this event?',rejectEventcallback,'Are you sure?',['Reject','Cancel']);

	//					  function rejectEventcallback(buttonIndex) {
    //                        if(buttonIndex == 1) {
    //                         $.post(serverURL+'acept_reject.php',{fkey:newid}).done(function(data){
	//							//navigator.notification.alert(newid);
	//							$this.closest('li').remove();
	//							//fetchDiaryEvents();
	//							fetchEvents();
	//							});
    //                            //$this.closest('li').remove();
    //                            return true;
    //                         return true;
    //                      }
    //                      else {
    //                         return false;
    //                      }
    //                      }
	//				});

	//		});
	//		$.mobile.loading( "hide" );
	//}

//Profile picture Upload
function getImage() {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(uploadPhoto, function(message) {
			//alert('get picture failed');
		},{
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit : true,
			targetWidth: 300,
			targetHeight: 300
		}
            );

        }

        function uploadPhoto(imageURI) {

        var image = document.getElementById('avatar');
                    image.src = imageURI;
        var proimge = document.getElementById('main_profilepic');
					proimge.src = imageURI;
		var proimge1 = document.getElementById('panel_profilepic');
        					proimge1.src = imageURI;
		var proimge2 = document.getElementById('panel_profilepic2');
        					proimge2.src = imageURI;
        var proimge3 = document.getElementById('panel_profilepic3');
                			proimge3.src = imageURI;

            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";

            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(imageURI, serverURL+"profileupload.php", win, fail, options);
        }

        function win(r) {
          //  console.log("Code = " + r.responseCode);
          //  console.log("Response = " + r.response);
         //   console.log("Sent = " + r.bytesSent);
           //alert(r.response);
        }

        function fail(error) {
            //alert("An error has occurred: Code = " = error.code);
            $.navigator.notification.alert('Failed to upload profile picture',null,'Failed','OK')
        }

//Image Attachement
function chooseImage(){
window.imagePicker.getPictures(
    function(results) {
    	$("#imagesPreview").empty();
        for (var i = 0; i < results.length; i++) {
            //alert('Image URI: ' + results[i]);
			$("#imagesPreview").append("<img src='"+results[i]+"' style='width:100px;height:100px;'>");
            var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=results[i].substr(results[i].lastIndexOf('/')+1);
			options.mimeType="image/jpeg";

			var params = new Object();
			params.value1 = "test";
			params.value2 = "param";

			options.params = params;
			options.chunkedMode = false;

			var ft = new FileTransfer();
			ft.upload(results[i], serverURL+"uploadattchment.php", win, fail, options);
        }
    }, function (error) {
       // console.log('Error: ' + error);
       navigator.notification.alert('Failed to upload attachments',null,'Failed','OK')
    }, {
        maximumImagesCount: 4,
        width: 800,
        quality: 100


    }
);

}
//Availability Marker
function calendarMarker(){
	var $this = $(this);
	var targetDay = $this.closest('div');
	var targetTomorrow = $this.parent().prev('div');
	var fulldate = $this.attr('data-fulldate');
		if(targetDay.is('.today')){
			navigator.notification.alert("Today you can't mark unavailable",null);
		}else if(targetDay.is('.past')){
			navigator.notification.alert("You can't mark anything on past days.",null);
		}else if(targetDay.is('.evtrue')){
         		navigator.notification.alert("You have event for this day",null);
         }else if(targetDay.is('.not-current')){
		}else if(targetTomorrow.is('.today')){

			navigator.notification.alert("You can't mark unavailability for tomorrow.",null);
		}else{
		navigator.notification.confirm('Mark this day as unavailable?',unavailableMarking,fulldate,['Yes','Cancel']);

			function unavailableMarking(buttonIndex) {
				if(buttonIndex == 1) {
			   // $this.closest('div').addClass('active');
			   window.plugins.spinnerDialog.show('', 'Loading...', true);
			   checkConnection();
				   $.post(serverURL+"availabilityMarking.php",
							 {unavailableDate:fulldate})
							.done(function( data ) {
							if(data =='commited'){
							navigator.notification.alert("You are committed for an event");
							}else{
							$this.closest('div').addClass('active');
							window.plugins.spinnerDialog.hide();
							}
							});
				  return true;
					  }else {
				return false;
			 }
			}
}

	}
function calendarRemarker(){
	$this = $(this);
	var targetDay = $this.closest('div');
	var fulldate = $this.attr('data-fulldate');
	if(targetDay.is('.past')){
		navigator.notification.alert("You can't mark anything on past days.",null);
	}else{
			navigator.notification.confirm('Mark this day as available?',availableMarking,fulldate,['Yes','Cancel']);

            	function availableMarking(buttonIndex) {
                    if(buttonIndex == 1) {
                    window.plugins.spinnerDialog.show('', 'Loading...', true);
                    checkConnection();
                   	 $.post(serverURL+"availabilityMarking.php",
							 {availableDate:fulldate})
								.done(function( data ) {
								 targetDay.removeClass('active');
								 setTimeout(window.plugins.spinnerDialog.hide(), 1000);

								});
        						return true;
                 			}else {
                    		return false;
               				  }
              			  }
						}
					}

 function calendarSwipeLeft(){
 	$('[data-go="next"]').trigger('click');
 }
 function calendarSwipRight(){
  	$('[data-go="prev"]').trigger('click');
  }


function deactivateAccount(){
navigator.notification.confirm('You will not get any events if you deactivated your account, You should contact administrator for activate your account',deactivateAccountCallback,'Deactivate Account?',['Deactivate','Cancel']);

	function deactivateAccountCallback(buttonIndex) {
		if(buttonIndex == 1) {
	 		$.post(serverURL+"deactivateAccount.php")
				.done(function( data ) {
				logout();
				});
				return true;
			}else {
			return false;
			  }
		  }
}
//swipeup and swipe down events.

function calendarRefresh(){
calendarSwipRight();
calendarSwipeLeft();
}

function refreshEvents(){
fetchDiaryEvents();
}
function refreshInEvents(){
fetchInvitedEvents();
calendarRefresh();
}
function OpenBrowesrGo() {
    url = $(this).attr("href");
    loadURL(url);
}
function loadURL(url){
    navigator.app.loadUrl(url, { openExternal:true });
    return false;
}

//function calendarEventFiletr(){
//var $this = $(this);
//var fulldate = $this.attr('data-fulldate');
//var filterBox = $('#events .ui-filterable input');
//filterBox.val(fulldate);
//filterBox.trigger(jQuery.Event('keyup', {keyCode: 13}));
//$.mobile.changePage("#events", {reverse: true, transition: "slide" });
//}
var inviteNotId = 0,
	sigleEvnt = 'New job has become available',
	multiEvnt = 'New jobs have become available';
  function inviteNotification(){
  $.post(serverURL+'eventsCount.php',{invite:'invite'}).done(function(data){
		if(data!=''){
			if(data==1){
			cordova.plugins.notification.local.schedule({
					  id         : inviteNotId,
					  title      : data +' '+ sigleEvnt,
					  text       : 'Check your job centre for more details',
					  sound      : 'res://platform_default',
					  icon		 :'res/drawable/icon.png',
					  smallIcon	 :'res/drawable/abap.png',
					  autoClear  : false
					});
			   inviteNotId++;
			}else{
			cordova.plugins.notification.local.schedule({
				  id         : inviteNotId,
				  title      : data +''+ multiEvnt,
				  text       : 'Check your job centre for more details',
				  sound      : 'res://platform_default',
				  icon		 :'res/drawable/icon.png',
                  smallIcon	 :'res/drawable/abap.png',
				  autoClear  : false
				});
		   inviteNotId++;
			}
		}
  	});
cordova.plugins.notification.local.on("click", function (notification) {
		var notTitle = notification.title;
		//var txtHint = 'available';
		if(notTitle.indexOf('available') > -1){
			$.mobile.changePage("#events", {reverse: false, transition: "slide" });
			preventDefault();
		}else if(notTitle.indexOf('accepted') > -1){
			navigator.notification.alert(notTitle+'\n'+notification.text,null,'Accepted Event','OK');
				preventDefault();
		}else if(notTitle.indexOf('missed') > -1){
			navigator.notification.alert(notTitle+'\n'+notification.text,null,'Rejected Event','OK');
         			preventDefault();
        }else if(notTitle.indexOf('Congratulations') > -1){
		$.mobile.changePage("#mydiary", {reverse: false, transition: "slide" });
					preventDefault();
				}
	  });
  }
var allocateNotId = 0,
	sigleEvntAll = 'Congratulations! You Got The Job!';
  function allocateNotification(){
  $.post(serverURL+'eventsCount.php',{allocate:'allocate'}).done(function(data){
		if(data!=''){
			if(data==1){
			cordova.plugins.notification.local.schedule({
					  id         : allocateNotId,
					  title      : sigleEvntAll,
					  text       : 'Congratulations on getting the job. Full information is now available in your My Jobs. If you have any questions, feel free to contact us.',
					  sound      : 'res://platform_default',
					  icon		 :'res/drawable/icon.png',
                      smallIcon	 :'res/drawable/abap.png',
					  autoClear  : false
					});
			   allocateNotId++;
			}
		}
  	});
  	}
 setInterval(function(){inviteNotification();}, 3000);
 setInterval(function(){allocateNotification();}, 4000);

 function checkConnection() {
     var networkState = navigator.connection.type;

     var states = {};
     states[Connection.UNKNOWN]  = 'Unknown connection';
     states[Connection.ETHERNET] = 'Ethernet connection';
     states[Connection.WIFI]     = 'WiFi connection';
     states[Connection.CELL_2G]  = 'Cell 2G connection';
     states[Connection.CELL_3G]  = 'Cell 3G connection';
     states[Connection.CELL_4G]  = 'Cell 4G connection';
     states[Connection.CELL]     = 'Cell generic connection';
     states[Connection.NONE]     = 'No network connection';

   //  alert('Connection type: ' + states[networkState]);
if(states[networkState]== states[Connection.NONE]){
   window.plugins.toast.showLongBottom(states[networkState],null,null);
   window.plugins.spinnerDialog.hide();
   }
 }

//Pull down refresh
(function pullPagePullImplementation($) {
  "use strict";
  var pullDownGeneratedCount = 0,
      listSelector = "div.pull-demo-page ul.ui-listview";

  function onPullDownEvents () {
  if($.mobile.activePage.is("#events")){
  refreshInEvents();
   window.plugins.toast.showLongBottom('Job Centre Refreshed',null,null);
  }else if($.mobile.activePage.is("#mydiary")){
  refreshEvents();
  window.plugins.toast.showLongBottom('My Jobs Refreshed',null,null);
  }
	//$(listSelector).listview("refresh");
    }
  // Set-up jQuery event callbacks
  $(document).delegate("div.pull-demo-page", "pageinit",
    function bindPullPagePullCallbacks(event) {
      $(".iscroll-wrapper", this).bind( {
      iscroll_onpulldown : onPullDownEvents
      } );
    } );

  }(jQuery));






//deviceready event call back function
function deviceReady() {
	checkPreAuth();
	$("#loginForm").on("submit",handleLogin);
	$("#submitButton").on("click",registration);
    $("#forgotButton").on("click",forgotPassword);
    $("#getcodeButton").on("click",verification);
    $("#bioSubmit").on("click",updateBiodata);
	document.addEventListener('backbutton', backButtonCallback, false);
	$(".logout,.header-logout").on("click",logout);
	$("#mydiary").on("swiperight",swipePanel1);
	$("#mydiary").on("swipedown",refreshEvents);
	$("#events").on("swipedown",refreshInEvents);
	$("#events").on("swiperight",swipePanel2);
	$('#events_list').on('swipeleft','li',function(){$(this).find('#event_reject').trigger('click');});
	$("#profileSubmit").on("click",updateProfile);
	$("#imagepicker").on('click',getImage);
	$("#fileAttachBtn").on('click',chooseImage);
	$('.days').on('click','.day:not(.active,.evtrue) a',calendarMarker);
	$('.days').on('click','.day.active a',calendarRemarker);
    $(document).on('swipeleft','.days',calendarSwipeLeft);
    $(document).on('swiperight','.days',calendarSwipRight);
    $(document).on('click',checkConnection);
    $('#deactivate_accnt').on('click',deactivateAccount);
	inviteNotification();
	allocateNotification();
	checkConnection();
	$('#bioForm :input').on('keypress',removeValidate);
	//$('.days').on('click','.day.evtrue a',calendarEventFiletr);
  $('.bio_fb,.bio_twt,.bio_web').live('tap',OpenBrowesrGo);
}

<div ng-app="myApp" class="container" >
<div class="row" controller="enquiryController">
	<div class="col-sm-12" ng-controller ="enquiryController">
		<div class="main-content">	
			<form class="form-horizontal form-border" role="form" name="enquiryForm" ng-submit="enquiryForm.$valid" novalidate >
				<h3> Enquiry Form</h3>
				<div class="form-group">
					<label for="phone" class="col-sm-2 control-label">User Name </label>
					<div class="col-sm-9">
						<input type="text" class="form-control" id="name" ng-model="enquiry.name" name="name" placeholder="User Name" ng-required="true">	
							<span class="text-danger" ng-show="enquiryForm.name.$error.required && (enquiryForm.name.$dirty || submitted)" class="help-block">Name is required.</span>						
					</div>	
				</div>
				<div class="form-group">
					<label for="from" class="col-sm-2 control-label">Enquiry From</label>
					<div class="col-sm-9">
						<input type="email" class="form-control" id="from" name="from" placeholder="example@gmail.com" ng-model="enquiry.from_email.from" required>
						<span  ng-show="enquiryForm.from.$dirty && enquiryForm.from.$invalid">
							<span class="text-danger" ng-show="enquiryForm.from.$error.required">From is required.</span>
							<span class="text-danger" ng-show="enquiryForm.from.$error.email">Invalid Email address.</span>
						</span>
					</div>
				</div>
					
				
				<div class="form-group">
					<label for="phone" class="col-sm-2 control-label">Mobile Number </label>
					<div class="col-sm-9">
						<input type="text" class="form-control help-block" id="phone" ng-model="enquiry.message.phone" name="phone" placeholder="Your Phone number"  ng-pattern="/(7|8|9)\d{9}$/" maxlength="10"  required >							
						<p ng-show="enquiryForm.phone.$error.pattern && (enquiryForm.phone.$dirty || submitted)" class="text-danger" >Enter a valid contact no.</p>
					</div>						
				</div>	
				<div class="form-group">
					<label for="message" class="col-sm-2 control-label">Address</label>
					<div class="col-sm-9">
						<textarea id="address" name="address" class="form-control" rows="3" ng-model="enquiry.message.address" ng-minlength="2" ng-maxlength="356" required>
						</textarea>
					</div>
				</div>
				<div class="form-group">
					<label for="message" class="col-sm-2 control-label">Message</label>
					<div class="col-sm-9">
						<textarea id="message" name="message" class="form-control" rows="3" ng-model="enquiry.message.message" ng-minlength="2" ng-maxlength="356" required>
						</textarea>
					</div>
				</div>
				<input type="hidden" class="form-control" id="to_email" name="to_email" ng-init="enquiry.to_email.to='vilas@wtouch.in'" ng-model="enquiry.to_email.to" >
				
				<input type="hidden" class="form-control" id="subject" name="subject"  ng-init="enquiry.subject='Website Enquiry'" ng-model="enquiry.subject" >
				
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-9">
						<button type="submit" class="btn btn-primary" ng-click="postData(enquiry)" ng-disabled="enquiryForm.$dirty && enquiryForm.$invalid">Send</button>
						<button type="reset" class="btn btn-danger" title="Cancel Sending">Cancel</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
</div>

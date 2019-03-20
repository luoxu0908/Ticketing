var RoleName = '',PrintFlag='',FileID='',caseID='',TargetRoleID='';

$(function(){

  //get caseID from URL
  var urlParams = new URLSearchParams(window.location.search),
      caseID = urlParams.get('caseID');
      FileID=urlParams.get('FileID');

      $('#Print').click(function () {
          DoPrint();
          var PrintFlag=document.execCommand("print");
          if (PrintFlag) {
            window.location.href = './case.html?caseID=' + caseID;
          }
      });
  var checkRoleAccess =
    $.ajax({
      url: apiSrc+"BCMain/iCtc1.CheckRoleAccess.json",
      method: "POST",
      dataType: "json",
      xhrFields: {withCredentials: true},
      data: { 'data':JSON.stringify({}),
              'WebPartKey':WebPartVal,
              'ReqGUID': getGUID() },
      success: function(data){
        if ((data) && (data.d.RetVal === -1)) {
          if (data.d.RetData.Tbl.Rows.length > 0) {
            RoleName = data.d.RetData.Tbl.Rows[0].RoleName;
          }
        }
        else {
          alert(data.d.RetMsg);
        }
      },
      error: function(data){
        alert("Error: " + data.responseJSON.d.RetMsg);
      }
    });

  $.when(checkRoleAccess).then(function( x ) {
    GetCaseDetails(caseID);
    GetCaseHistory(caseID);
    GetCaseInvolvement(caseID);
    if (RoleName=='Admin'){

    }else if (RoleName=='Clients'){
      $('#AddNewActivity').show();
    }else if (RoleName=='Support Developer'){
      $('.supportControl').show();
    }else if (RoleName=='Support Team Lead'){
      getStaffList();
      GetAvailablePackage(caseID);
      $('.teamLeadControl, .supportControl').show();
    }else if (RoleName=='Sales'){

    }else{

    }
  });

  $('#activityForm #submit').click(function(){
    addNewActivity(caseID);
  });

  $('#involvementForm #submit').click(function(){
    addNewInvolvement(caseID);
  });

  $('#reviewForm #submit').click(function(){
    reviewCase(caseID);
  });

  $('#chargeForm #submit').click(function(){
    chargeToPackage(caseID);
  });

});


function DoPrint() {
       $('.boxContent').hide();
       $('.titleMain').hide();
       $('#Print').hide();
       $('.buttonType2').hide();
       var printData = document.getElementById("mainContent").innerHTML;
       window.document.body.innerHTML = printData
       window.print()
   }
function AddNewAttactment(){
  window.open('../BCMain/tabs.htm?Prefix=FL&Type=CaseAttach&title='+caseID+'&TabParam='+FileID);
}
function reviewCase(caseID){
  var status, category, dateFrom, dateTo, manHours, actualHour,PriorityLevel;
  status = $('#reviewForm #status').val();
  category = $('#reviewForm #category').val();
  dateFrom = $('#reviewForm #scheduleDateFrom').val();
  dateTo = $('#reviewForm #scheduleDateTo').val();
  manHours = $('#reviewForm #manHours').val();
  PriorityLevel = $('#reviewForm #PriorityLevel').val();
  actualHour = $('#reviewForm #actualManHours').val();

  if (PriorityLevel.length==0) {
      alert('Please fill in all mandatory fields!');
      return false;
  }
  var data = {'FLID':caseID, 'Status':status, 'Category':category, 'ChargeHours':manHours, 'ActualHours':actualHour, 'TargetStartDate':dateFrom, 'TargetEndDate':dateTo,'PriorityLevel':PriorityLevel};
  $.ajax({
    url: apiSrc+"BCMain/FL1.ReviewCase.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify(data),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            $('#reviewForm #status').val('');
            $('#reviewForm #category').val('');
            $('#reviewForm #scheduleDateFrom').val('');
            $('#reviewForm #scheduleDateTo').val('');
            $('#reviewForm #PriorityLevel').val('');
            $('#reviewForm #manHours').val('');
            GetCaseDetails(caseID);
            GetCaseHistory(caseID);

            $('#reviewForm').foundation('close');
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
}

function addNewInvolvement(caseID){
  var staff, task;
  staff = $('#involvementForm #person').val();
  task = $('#involvementForm #task').val();

  if (staff.length==0){
    alert('Please fill in all mandatory fields!');
    return false;
  }

  var data = {'FLID':caseID, 'RoleID':staff, 'Details':task};
  $.ajax({
    url: apiSrc+"BCMain/FL1.AddInvolvement.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify(data),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            GetCaseInvolvement(caseID);
            GetCaseHistory(caseID);
            $('#involvementForm #person').val('');
            $('#involvementForm').foundation('close');
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
}

function addNewActivity(caseID){
  var Description, internal;
  Description = $('#activityForm #description').val();

  internal= $("#activityForm [name=internal]:checked").val()||'';

  if (Description.length==0){
    alert('Please fill in description!');
    return false;
  }
  if (RoleName!='Clients'){
    if (internal.length==0){
      alert('Please fill in internal or All!');
      return false;
    }
  }

  var data = {'FLID':caseID, 'Details':Description, 'Internal':internal};
  $.ajax({
    url: apiSrc+"BCMain/FL1.InsertActivityLog.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify(data),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            $('#activityForm #description').val('');
            $('#activityForm').foundation('close');
            GetCaseHistory(caseID);
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
}

function GetAvailablePackage(caseId){
  $('#chargeForm #packageID').html('');
  var html = '<option value="">-- Please Select --</option>';
      html += '<option value="0">Quotation</option>';
  $.ajax({
    url: apiSrc+"BCMain/Ctc1.GetAvailablePackage.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify({'FLID':caseId}),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var availablePackage = data.d.RetData.Tbl.Rows;
          for (var i=0; i<availablePackage.length; i++ ){
            html += '<option value="'+availablePackage[i].PackageID+'">'+availablePackage[i].AvailablePackage+'</option>';
          }
        }
      }else {
        alert(data.d.RetMsg);
      }
      $('#chargeForm #packageID').html(html);
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
}

//Get Case Details
function GetCaseDetails(caseId){
  $.ajax({
    url: apiSrc+"BCMain/FL1.GetCasesDetails.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify({'FLID':caseId}),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var caseDetails = data.d.RetData.Tbl.Rows[0];
          var createdDate = convertDateTime(caseDetails.CreatedDate, 'datetime'),
              updatedDate = convertDateTime(caseDetails.ModifiedDate, 'datetime');
          $('#summary .CaseID').html(caseDetails.FLID);
          $('#summary .organisation').html(caseDetails.Organisation);
          $('#summary .name').html(caseDetails.ContactPerson);
          $('#summary .email').html(caseDetails.Email);
          $('#summary .contact').html(caseDetails.ContactNo);
          $('#summary .subject').html(caseDetails.Subject);
          $('#summary .details').html(caseDetails.Details);
          $('#summary .createdDate').html(createdDate);
          $('#summary .updatedDate').html(updatedDate);
          $('#reviewInfo .status').html(caseDetails.Status);
          $('#reviewInfo .category').html(caseDetails.Category);
          $('#reviewInfo .dateFrom').html(caseDetails.DateFrom);
          $('#reviewInfo .dateTo').html(caseDetails.DateTo);
          $('#reviewInfo .manHours').html(caseDetails.ActualHours);
          $('#reviewInfo .actualHour').html(caseDetails.ActualHours);
          $('#reviewForm #status').val(caseDetails.Status);
          $('#reviewForm #category').val(caseDetails.Category);
          $('#reviewForm #PriorityLevel').val(caseDetails.PriorityLevel);
          $('#reviewForm #manHours').val(caseDetails.ChargeHours);
          $('#reviewForm #scheduleDateFrom').val(caseDetails.DateFrom);
          $('#reviewForm #scheduleDateTo').val(caseDetails.DateTo);
          $('#chargeForm #actualManHours').val(caseDetails.ChargeHours);
        // $('#reviewForm #actualManHours').val(caseDetails.ActualHours);
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
};

function GetCaseHistory(caseId){
  $.ajax({
    url: apiSrc+"BCMain/FL1.GetCasesActivityLog.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify({'FLID':caseId}),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var caseLogs = data.d.RetData.Tbl.Rows;
          var threadContainer = ' <div class="legend"><h6>Legend</h6><ul><li class="active">User</li><li class="non-active">Staff</li></ul></div>';
          for (var i=0; i<caseLogs.length; i++ ){
            var date = convertDateTime(caseLogs[i].CreatedDate,'date');
            var time = convertDateTime(caseLogs[i].CreatedDate,'time');
            if (caseLogs[i].Internal){
              threadContainer += '<div class="thread">'
              threadContainer += '<div class="top"> <span class="datetime">'+date+'<i> '+time+'</i> by '+caseLogs[i].CreatedBy+'</span> <span class="tag">Internal</span></div>'
              threadContainer += '<div class="text">'+caseLogs[i].Details+'</div> </div>';
            }else{
              if (caseLogs[i].StaffOrClient=='colorCodeActive') {
                threadContainer += '<div class="thread" style="border-left:15px #00cc00 solid;margin-top:3px;">'
              }else if(caseLogs[i].StaffOrClient=='colorCodeNonActive'){
                threadContainer += '<div class="thread" style="border-left:15px #e60000 solid;margin-top:3px;">'
              }
              threadContainer += '<div class="top"><span class="datetime">'+date+'<i> '+time+'</i> by '+caseLogs[i].CreatedBy+'</span> </div>'
              threadContainer += '<div class="text">'+caseLogs[i].Details+'</div> </div>';
            }
          }
          $('#logThread .threadLog').html(threadContainer);
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
};

function GetCaseInvolvement(caseId){
  $.ajax({
    url: apiSrc+"BCMain/FL1.GetCasesInvolvement.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify({'FLID':caseId}),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var caseInvolvements = data.d.RetData.Tbl.Rows;
          var involvementContainer = '';
          for (var i=0; i<caseInvolvements.length; i++ ){
            var date = convertDateTime(caseInvolvements[i].CreatedDate,'date');
            var time = convertDateTime(caseInvolvements[i].CreatedDate,'time');
            involvementContainer += '<div class="thread">'
            involvementContainer += '<div class="top"> <span class="datetime">'+date+'<i> '+time+'</i> </span> </div>'
            involvementContainer += '<div class="text">'+caseInvolvements[i].RolePerson+'</div> </div>'
            //involvementContainer += '<div class="text">'+caseInvolvements[i].RolePerson+': '+caseInvolvements[i].Remarks+'</div> </div>'
          }
          $('#taskThread .threadTask').html(involvementContainer);
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
};

function chargeToPackage(caseID){
  var packageID,ManHours;
  packageID = $('#chargeForm #packageID').val();
  ManHours= $('#chargeForm #actualManHours').val();
  if (packageID == ''){
    alert('Please select package to charge!');
    return false;
  }

  if (ManHours == ''){
    alert('Please fill in all mandatory fields!');
    return false;
  }

    ManHours = parseInt(ManHours);

    if (isNaN(ManHours)) {
      alert('Invalid Actual Man-hour(s)!');
      return false;
    }
    else if (ManHours<=0) {
      alert('Actual Man-hour(s) should greater than 0!');
       return false;
   }

  var data = {'FLID':caseID, 'packageID':packageID,'ManHours':ManHours};
  if (confirm("Confirming charging to package?")){
    $.ajax({
      url: apiSrc+"BCMain/FL1.ChargeToPackageID.json",
      method: "POST",
      dataType: "json",
      xhrFields: {withCredentials: true},
      data: { 'data':JSON.stringify(data),
              'WebPartKey':WebPartVal,
              'ReqGUID': getGUID() },
      success: function(data){
        if ((data) && (data.d.RetVal === -1)) {
          if (data.d.RetData.Tbl.Rows.length > 0) {
            if (data.d.RetData.Tbl.Rows[0].Success == true) {
              $.when(GetAvailablePackage(caseID)).then(function () {
                $('#chargeForm #packageID').val('');
                $('#chargeForm #actualManHours').val('');
                $('#chargeForm').foundation('close');
                GetCaseDetails(caseID);
                GetCaseHistory(caseID);
            	});
            } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
          }
        }
        else {
          alert(data.d.RetMsg);
        }
      },
      error: function(data){
        alert("Error: " + data.responseJSON.d.RetMsg);
      }
    });
  }else{
    return false;
  }
};

function getStaffList(){
  $('#involvementForm #person').html('<option value="">-- Please Select --</option>');
  var html = '';
  var data = {};
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.GetStaffList.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data':JSON.stringify(data),
            'WebPartKey':WebPartVal,
            'ReqGUID': getGUID() },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var staffList = data.d.RetData.Tbl.Rows;
          for (var i=0; i<staffList.length; i++ ){
            html+=('<option value="'+staffList[i].RoleID+'">'+staffList[i].StaffDetails+'</option>');
          }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
      $('#involvementForm #person').append(html);
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
    }
  });
}

function IsValidDate(inputDate) {
  var re = /^(([0-9])|([0-2][0-9])|([3][0-1]))( )(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)( )\d{4}$/;
  return re.test(inputDate);
}

function IsValidManDay(ManDay) {
	var re = /^\d*(\.[05])?$/;
	return re.test(ManDay);
}

//convert date to dd/mm/yyyy
function convertDateTime(inputFormat, type) {
  if (inputFormat == null){
    return '-';
  };
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  if (type == 'date'){
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
  }else if (type == 'datetime'){
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }else if (type == 'time'){
    return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }
};

function getGUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

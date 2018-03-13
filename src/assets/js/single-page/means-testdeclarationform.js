
var pageresult=0;
$(function(){
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
      loginID = appCookie.loginID;
      $('#submit').click(function(){
        SaveDeclaretion();
      });
    $('#DeclaretionFrom').on('formvalid.zf.abide',function(){pageresult=1;});
    $('#DeclaretionFrom').on('forminvalid.zf.abide',function(){pageresult=0;});
});

//Submit data
function SaveDeclaretion(){
  $('#DeclaretionFrom').foundation('validateForm');
  if (pageresult==0){return false;}
  var data={};
  $('#DeclaretionFrom :input,select').each(function(){
    var type=$(this).attr('type'), name= $(this).attr('name'),val=$(this).val();
    if (type=="radio") { val=$(':input[type="'+type+'"][name="'+name+'"]:checked').val()||'';}
    if (type=="checkbox") {
      var tempVal='';
      $(':input[type="'+type+'"][name="'+name+'"]:checked').each(function(index,item){
        if ($(item).prop('checked')==true) {
          tempVal+=$(item).val()+',';
        }
      });
      val=(tempVal.length>0?tempVal.substr(0,tempVal.length-1):'');
    }
    if ((!data.hasOwnProperty(data[name]))&&name) {
        data[name]=val;
      }
  });
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.SaveDeclaretion.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        alert('Successfully updated!');
            location.reload();
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  });
}


//convert date to dd/mm/yyyy
function convertDateTime(inputFormat, type) {
  if (inputFormat == null){
    return '-';
  }
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  if (type == 'date'){
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
  }else if (type == 'datetime'){
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }else if (type == 'time'){
    return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }
}

function GetDeclarationInfo(DeclarationID){
  var data = {'DeclarationID':DeclarationID};
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.GetDeclarationInfo.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var DeclarationInfo = data.d.RetData.Tbl.Rows[0];

          $('#sectionA_ordinaryMembership').val(DeclarationInfo.POCContact);$('#sectionA_FamilyName').val(DeclarationInfo.POCContact);
          $('#sectionA_GivenName').val(DeclarationInfo.POCContact);$('#sectionA_DisplayName').val(DeclarationInfo.POCContact);
          $('#sectionA_nric').val(DeclarationInfo.POCContact);$('#sectionA_Birth').val(DeclarationInfo.POCContact);
          $('#sectionA_PostalCode').val(DeclarationInfo.POCContact);$('#sectionA_BlockNo').val(DeclarationInfo.POCContact);
          $('#sectionA_Level').val(DeclarationInfo.POCContact);$('#sectionA_PostalCode').val(DeclarationInfo.POCContact);
          $('#sectionA_StreetName').val(DeclarationInfo.POCContact);$('#sectionA_Telhome').val(DeclarationInfo.POCContact);
          $('#sectionA_Teloffice').val(DeclarationInfo.POCContact);$('#sectionA_Handphone').val(DeclarationInfo.POCContact);
          $('#sectionA_Occupation').val(DeclarationInfo.POCContact);$('#sectionA_Email').val(DeclarationInfo.POCContact);
          $('#sectionB_FamilyName').val(DeclarationInfo.POCContact);$('#sectionB_GivenName').val(DeclarationInfo.POCContact);
          $('#sectionB_DisplayName').val(DeclarationInfo.POCContact);$('#sectionB_nric').val(DeclarationInfo.POCContact);
          $('#sectionB_Birth').val(DeclarationInfo.POCContact);$('#sectionB_PostalCode').val(DeclarationInfo.POCContact);
          $('#sectionB_BlockNo').val(DeclarationInfo.POCContact);$('#sectionB_Level').val(DeclarationInfo.POCContact);
          $('#sectionB_BuildingName').val(DeclarationInfo.POCContact);$('#sectionB_StreetName').val(DeclarationInfo.POCContact);
          $('#sectionB_mobile').val(DeclarationInfo.POCContact);$('#sectionB_home').val(DeclarationInfo.POCContact);
          $('#sectionB_office').val(DeclarationInfo.POCContact);$('#sectionB_email').val(DeclarationInfo.POCContact);
          $('#sectionB_Occupation').val(DeclarationInfo.POCContact);$('#sectionB_relationship').val(DeclarationInfo.POCContact);
          $('#sectionC_FamilyNameMain').val(DeclarationInfo.POCContact);$('#sectionC_GivenNameMain').val(DeclarationInfo.POCContact);
          $('#sectionC_DisplayNameMain').val(DeclarationInfo.POCContact);$('#sectionC_AgeMain').val(DeclarationInfo.POCContact);
          $('#sectionC_OccupationMain').val(DeclarationInfo.POCContact);$('#sectionC_NettMain').val(DeclarationInfo.POCContact);
          $('#sectionC_GrossMain').val(DeclarationInfo.POCContact);$('#sectionC_FamilyName1').val(DeclarationInfo.POCContact);
          $('#sectionC_GivenName1').val(DeclarationInfo.POCContact);$('#sectionC_DisplayName1').val(DeclarationInfo.POCContact);
          $('#sectionC_Age1').val(DeclarationInfo.POCContact);$('#sectionC_Occupation1').val(DeclarationInfo.POCContact);
          $('#sectionC_Relationship1').val(DeclarationInfo.POCContact);$('#sectionC_Nett1').val(DeclarationInfo.POCContact);
          $('#sectionC_Gross1').val(DeclarationInfo.POCContact);$('#sectionC_FamilyName2').val(DeclarationInfo.POCContact);
          $('#sectionC_GivenName2').val(DeclarationInfo.POCContact);$('#sectionC_DisplayName2').val(DeclarationInfo.POCContact);
          $('#sectionC_Age2').val(DeclarationInfo.POCContact);$('#sectionC_Occupation2').val(DeclarationInfo.POCContact);
          $('#sectionC_Relationship2').val(DeclarationInfo.POCContact);$('#sectionC_Nett2').val(DeclarationInfo.POCContact);
          $('#sectionC_Gross2').val(DeclarationInfo.POCContact);$('#sectionC_FamilyName3').val(DeclarationInfo.POCContact);
          $('#sectionC_GivenName3').val(DeclarationInfo.POCContact);$('#sectionC_DisplayName3').val(DeclarationInfo.POCContact);
          $('#sectionC_Age3').val(DeclarationInfo.POCContact);$('#sectionC_Occupation3').val(DeclarationInfo.POCContact);
          $('#sectionC_Relationship3').val(DeclarationInfo.POCContact);$('#sectionC_Nett3').val(DeclarationInfo.POCContact);
          $('#sectionC_Gross3').val(DeclarationInfo.POCContact);$('#sectionC_FamilyName4').val(DeclarationInfo.POCContact);
          $('#sectionC_GivenName4').val(DeclarationInfo.POCContact);$('#sectionC_DisplayName4').val(DeclarationInfo.POCContact);
          $('#sectionC_Age4').val(DeclarationInfo.POCContact);$('#sectionC_Occupation4').val(DeclarationInfo.POCContact);
          $('#sectionC_Relationship4').val(DeclarationInfo.POCContact);$('#sectionC_Nett4').val(DeclarationInfo.POCContact);
          $('#sectionC_Gross4').val(DeclarationInfo.POCContact);$('#sectionC_FamilyName5').val(DeclarationInfo.POCContact);
          $('#sectionC_GivenName5').val(DeclarationInfo.POCContact);$('#sectionC_DisplayName5').val(DeclarationInfo.POCContact);
          $('#sectionC_Age5').val(DeclarationInfo.POCContact);$('#sectionC_Occupation5').val(DeclarationInfo.POCContact);
          $('#sectionC_Relationship5').val(DeclarationInfo.POCContact);$('#sectionC_Nett5').val(DeclarationInfo.POCContact);
          $('#sectionC_Gross5').val(DeclarationInfo.POCContact);$('#sectionD_familysupport').val(DeclarationInfo.POCContact);
          $('#sectionD_Frequency1').val(DeclarationInfo.POCContact);$('#sectionD_Period1').val(DeclarationInfo.POCContact);
          $('#sectionD_Amount1').val(DeclarationInfo.POCContact);$('#sectionD_Frequency2').val(DeclarationInfo.POCContact);
          $('#sectionD_Period2').val(DeclarationInfo.POCContact);$('#sectionD_Amount2').val(DeclarationInfo.POCContact);
          $('#sectionD_Frequency3').val(DeclarationInfo.POCContact);$('#sectionD_Period3').val(DeclarationInfo.POCContact);
          $('#sectionD_Amount3').val(DeclarationInfo.POCContact);$('#sectionD_Frequency4').val(DeclarationInfo.POCContact);
          $('#sectionD_Period4').val(DeclarationInfo.POCContact);$('#sectionD_Amount4').val(DeclarationInfo.POCContact);
          $('#sectionE_Check').val(DeclarationInfo.POCContact);

        }
      }
    }
  });
}
//geneare drop down optioms
function GetDropdownList(id, category) {
  alert();
  var data = {'LookupCat': category};
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.Lookup_Get.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: { 'data': JSON.stringify(data),
            'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
            'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277' },
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var lookup = data.d.RetData.Tbl.Rows;
          for (var i=0; i<lookup.length; i++ ){
            $(id).append('<option value="'+lookup[i].LookupKey+'">'+lookup[i].Description+'</option>');
          }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    }
  });
}

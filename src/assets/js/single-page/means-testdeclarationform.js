$(function(){
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
      loginID = appCookie.loginID;
      $('#submit').click(function(){
        SaveDeclaretion();
      });
})
//Submit data
function SaveDeclaretion(){
  var sectionA_DeclarationofDate='',sectionA_ordinaryMembership='', sectionA_FamilyName='', sectionA_GivenName='', sectionA_DisplayName='', sectionA_nric='',
   sectionA_Birth='',sectionA_PostalCode='', sectionA_BlockNo='', sectionA_Level='', sectionA_PostalCode='', sectionA_StreetName='',
   sectionA_Telhome='', sectionA_Teloffice='', sectionA_Handphone='', sectionA_Occupation='', sectionA_Email='',
   sectionB_FamilyName='', sectionB_GivenName='', sectionB_DisplayName='', sectionB_nric='', sectionB_Birth='',
   sectionB_PostalCode='', sectionB_BlockNo='', sectionB_Level='', sectionB_BuildingName='', sectionB_StreetName='',
   sectionB_mobile='', sectionB_home='', sectionB_office='', sectionB_email='', sectionB_Occupation='',
   sectionB_relationship='',sectionC_FamilyNameMain='', sectionC_GivenNameMain='', sectionC_DisplayNameMain='',
   sectionC_AgeMain='',sectionC_OccupationMain='', sectionC_NettMain='', sectionC_GrossMain='', sectionC_FamilyName1='',
   sectionC_GivenName1='', sectionC_DisplayName1='', sectionC_Age1='', sectionC_Occupation1='',sectionC_Relationship1='',
   sectionC_Nett1='', sectionC_Gross1='', sectionC_FamilyName2='',sectionC_GivenName2='', sectionC_DisplayName2='',
   sectionC_Age2='', sectionC_Occupation2='',sectionC_Relationship2='',sectionC_Nett2='', sectionC_Gross2='',
   sectionC_FamilyName3='',sectionC_GivenName3='', sectionC_DisplayName3='', sectionC_Age3='', sectionC_Occupation3='',
   sectionC_Relationship3='',sectionC_Nett3='', sectionC_Gross3='', sectionC_FamilyName4='',sectionC_GivenName4='',
   sectionC_DisplayName4='', sectionC_Age4='', sectionC_Occupation4='',sectionC_Relationship4='',sectionC_Nett4='',
   sectionC_Gross4='',sectionC_FamilyName5='',sectionC_GivenName5='', sectionC_DisplayName5='', sectionC_Age5='',
   sectionC_Occupation5='',sectionC_Relationship5='',sectionC_Nett5='', sectionC_Gross5='',sectionD_familysupport='',
   sectionD_Frequency1='',sectionD_Period1='', sectionD_Amount1='',sectionD_Frequency2='',sectionD_Period2='',
   sectionD_Amount2='',sectionD_Frequency3='',sectionD_Period3='', sectionD_Amount3='',sectionD_Frequency4='',
   sectionD_Period4='', sectionD_Amount4='',sectionE_Check='';
  sectionA_DeclarationofDate=$('#sectionA_DeclarationofDate').val();
  sectionA_ordinaryMembership=$('#DeclaretionFrom input[name="sectionA_ordinaryMembership"]:checked').val()||'';
  sectionA_FamilyName=$('#sectionA_FamilyName').val();
  sectionA_GivenName=$('#sectionA_GivenName').val();
  sectionA_DisplayName = $('#sectionA_DisplayName').val();
  sectionA_nric = $('#sectionA_nric').val();
  sectionA_Birth=$('#sectionA_Birth').val();
  sectionA_PostalCode = $('#sectionA_PostalCode').val();
  sectionA_BlockNo = $('#sectionA_BlockNo').val();
  sectionA_Level = $('#sectionA_Level').val();
  sectionA_PostalCode = $('#sectionA_PostalCode').val();
  sectionA_StreetName = $('#sectionA_StreetName').val();
  sectionA_Telhome = $('#sectionA_Telhome').val();
  sectionA_Teloffice = $('#sectionA_Teloffice').val();
  sectionA_Handphone = $('#sectionA_Handphone').val();
  sectionA_Occupation = $('#sectionA_Occupation').val();
  sectionA_Email = $('#sectionA_Email').val();
  sectionB_FamilyName=$('#sectionB_FamilyName').val();
  sectionB_GivenName=$('#sectionB_GivenName').val();
  sectionB_DisplayName = $('#sectionB_DisplayName').val();
  sectionB_nric = $('#sectionB_nric').val();
  sectionB_Birth=$('#sectionB_dateOfBirthYear').val()+'-'+$('#sectionB_dateOfBirthMonth').val()+'-'+$('#sectionB_dateOfBirthDay').val();
  sectionB_PostalCode=$('#sectionB_PostalCode').val();
  sectionB_BlockNo = $('#sectionB_BlockNo').val();
  sectionB_Level = $('#sectionB_Level').val();
  sectionB_BuildingName=$('#sectionB_BuildingName').val();
  sectionB_StreetName = $('#sectionB_StreetName').val();
  sectionB_mobile = $('#sectionB_mobile').val();
  sectionB_home = $('#sectionB_home').val();
  sectionB_office=$('#sectionB_office').val();
  sectionB_email = $('#sectionB_email').val();
  sectionB_Occupation = $('#sectionB_Occupation').val();
  sectionB_relationship=$('#sectionB_relationship').val();
  sectionC_FamilyNameMain=$('#sectionC_FamilyNameMain').val();
  sectionC_GivenNameMain=$('#sectionC_GivenNameMain').val();
  sectionC_DisplayNameMain = $('#sectionC_DisplayNameMain').val();
  sectionC_AgeMain = $('#sectionC_AgeMain').val();
  sectionC_OccupationMain=$('#sectionC_OccupationMain').val();
  sectionC_NettMain=$('#sectionC_NettMain').val();
  sectionC_GrossMain = $('#sectionC_GrossMain').val();
  sectionC_FamilyName1 = $('#sectionC_FamilyName1').val();
  sectionC_GivenName1=$('#sectionC_GivenName1').val();
  sectionC_DisplayName1=$('#sectionC_DisplayName1').val();
  sectionC_Age1 = $('#sectionC_Age1').val();
  sectionC_Occupation1 = $('#sectionC_Occupation1').val();
  sectionC_Relationship1=$('#sectionC_Relationship1').val();
  sectionC_Nett1 = $('#sectionC_Nett1').val();
  sectionC_Gross1 = $('#sectionC_Gross1').val();
  sectionC_FamilyName2 = $('#sectionC_FamilyName2').val();
  sectionC_GivenName2=$('#sectionC_GivenName2').val();
  sectionC_DisplayName2=$('#sectionC_DisplayName2').val();
  sectionC_Age2 = $('#sectionC_Age2').val();
  sectionC_Occupation2 = $('#sectionC_Occupation2').val();
  sectionC_Relationship2=$('#sectionC_Relationship2').val();
  sectionC_Nett2 = $('#sectionC_Nett2').val();
  sectionC_Gross2 = $('#sectionC_Gross2').val();
  sectionC_FamilyName3 = $('#sectionC_FamilyName3').val();
  sectionC_GivenName3=$('#sectionC_GivenName3').val();
  sectionC_DisplayName3=$('#sectionC_DisplayName3').val();
  sectionC_Age3 = $('#sectionC_Age3').val();
  sectionC_Occupation3 = $('#sectionC_Occupation3').val();
  sectionC_Relationship3=$('#sectionC_Relationship3').val();
  sectionC_Nett3 = $('#sectionC_Nett3').val();
  sectionC_Gross3 = $('#sectionC_Gross3').val();
  sectionC_FamilyName4 = $('#sectionC_FamilyName4').val();
  sectionC_GivenName4=$('#sectionC_GivenName4').val();
  sectionC_DisplayName4=$('#sectionC_DisplayName4').val();
  sectionC_Age4 = $('#sectionC_Age4').val();
  sectionC_Occupation4 = $('#sectionC_Occupation4').val();
  sectionC_Relationship4=$('#sectionC_Relationship4').val();
  sectionC_Nett4 = $('#sectionC_Nett4').val();
  sectionC_Gross4 = $('#sectionC_Gross4').val();
  sectionC_FamilyName5 = $('#sectionC_FamilyName5').val();
  sectionC_GivenName5=$('#sectionC_GivenName5').val();
  sectionC_DisplayName5=$('#sectionC_DisplayName5').val();
  sectionC_Age5 = $('#sectionC_Age5').val();
  sectionC_Occupation5 = $('#sectionC_Occupation5').val();
  sectionC_Relationship5=$('#sectionC_Relationship5').val();
  sectionC_Nett5 = $('#sectionC_Nett5').val();
  sectionC_Gross5 = $('#sectionC_Gross5').val();
  $('#DeclaretionFrom input[name="sectionD_familysupport"]').each(function () {
          if ($(this).is(':checked')) {
                    sectionD_familysupport = $(this).val();
          }
  });
  sectionD_Frequency1 = $('#sectionD_Frequency1').val();
  sectionD_Period1 = $('#sectionD_Period1').val();
  sectionD_Amount1 = $('#sectionD_Amount1').val();
  sectionD_Frequency2 = $('#sectionD_Frequency2').val();
  sectionD_Period2 = $('#sectionD_Period2').val();
  sectionD_Amount2 = $('#sectionD_Amount2').val();
  sectionD_Frequency3 = $('#sectionD_Frequency3').val();
  sectionD_Period3 = $('#sectionD_Period3').val();
  sectionD_Amount3 = $('#sectionD_Amount3').val();
  sectionD_Frequency4 = $('#sectionD_Frequency4').val();
  sectionD_Period4 = $('#sectionD_Period4').val();
  sectionD_Amount4 = $('#sectionD_Amount4').val();
  $(":input[name=sectionE_Check]").each(function () {
            if ($(this).is(':checked')) {
                sectionE_Check += $(this).val() + ',';
            }
  });

  var data = {"sectionA_DeclarationofDate":sectionA_DeclarationofDate, "sectionA_ordinaryMembership": sectionA_ordinaryMembership, "sectionA_FamilyName": sectionA_FamilyName,
  "sectionA_GivenName": sectionA_GivenName, "sectionA_DisplayName": sectionA_DisplayName, "sectionA_nric": sectionA_nric,
  "sectionA_Birth": sectionA_Birth, "sectionA_PostalCode": sectionA_PostalCode, "sectionA_BlockNo": sectionA_BlockNo,
  "sectionA_Level": sectionA_Level, "sectionA_PostalCode": sectionA_PostalCode,"sectionA_StreetName": sectionA_StreetName,
  "sectionA_Telhome": sectionA_Telhome,"sectionA_Teloffice": sectionA_Teloffice,"sectionA_Handphone": sectionA_Handphone,
  "sectionA_Occupation": sectionA_Occupation,"sectionA_Email": sectionA_Email,"sectionB_FamilyName": sectionB_FamilyName,
  "sectionB_GivenName": sectionB_GivenName,"sectionB_DisplayName": sectionB_DisplayName,"sectionB_nric": sectionB_nric,
  "sectionB_Birth": sectionB_Birth,"sectionB_PostalCode": sectionB_PostalCode,"sectionB_BlockNo": sectionB_BlockNo,
  "sectionB_Level": sectionB_Level,"sectionB_BuildingName": sectionB_BuildingName,"sectionB_StreetName": sectionB_StreetName,
  "sectionB_mobile": sectionB_mobile,"sectionB_home": sectionB_home,"sectionB_office": sectionB_office,"sectionB_email":sectionB_email,
  "sectionB_Occupation": sectionB_Occupation,"sectionB_relationship": sectionB_relationship,"sectionC_FamilyNameMain": sectionC_FamilyNameMain,
  "sectionC_GivenNameMain": sectionC_GivenNameMain,"sectionC_DisplayNameMain": sectionC_DisplayNameMain,"sectionC_AgeMain": sectionC_AgeMain,
  "sectionC_OccupationMain": sectionC_OccupationMain,"sectionC_NettMain": sectionC_NettMain,"sectionC_GrossMain": sectionC_GrossMain,
  "sectionC_FamilyName1": sectionC_FamilyName1, "sectionC_GivenName1": sectionC_GivenName1, "sectionC_DisplayName1": sectionC_DisplayName1,
  "sectionC_Age1": sectionC_Age1, "sectionC_Occupation1": sectionC_Occupation1, "sectionC_Relationship1": sectionC_Relationship1,
  "sectionC_Nett1": sectionC_Nett1, "sectionC_Gross1": sectionC_Gross1, "sectionC_FamilyName2": sectionC_FamilyName2,
  "sectionC_GivenName2": sectionC_GivenName2, "sectionC_DisplayName2": sectionC_DisplayName2, "sectionC_Age2": sectionC_Age2,
  "sectionC_Occupation2": sectionC_Occupation2, "sectionC_Relationship2": sectionC_Relationship2, "sectionC_Nett2": sectionC_Nett2,
  "sectionC_Gross2": sectionC_Gross2, "sectionC_FamilyName3": sectionC_FamilyName3, "sectionC_GivenName3": sectionC_GivenName3,
  "sectionC_DisplayName3": sectionC_DisplayName3, "sectionC_Age3": sectionC_Age3, "sectionC_Occupation3": sectionC_Occupation3,
  "sectionC_Relationship3": sectionC_Relationship3, "sectionC_Nett3": sectionC_Nett3, "sectionC_Gross3": sectionC_Gross3,
  "sectionC_FamilyName4": sectionC_FamilyName4, "sectionC_GivenName4": sectionC_GivenName4, "sectionC_DisplayName4": sectionC_DisplayName4,
  "sectionC_Age4": sectionC_Age4, "sectionC_Occupation4": sectionC_Occupation4, "sectionC_Relationship4": sectionC_Relationship4,
  "sectionC_Nett4": sectionC_Nett4, "sectionC_Gross4": sectionC_Gross4, "sectionC_FamilyName5": sectionC_FamilyName5,
  "sectionC_GivenName5": sectionC_GivenName5, "sectionC_DisplayName5": sectionC_DisplayName5, "sectionC_Age5": sectionC_Age5,
  "sectionC_Relationship5": sectionC_Relationship5, "sectionC_Nett5": sectionC_Nett5, "sectionC_Gross5": sectionC_Gross5,
  "sectionD_familysupport": sectionD_familysupport, "sectionD_Frequency1": sectionD_Frequency1, "sectionD_Period1": sectionD_Period1,
  "sectionD_Amount1": sectionD_Amount1, "sectionD_Frequency2": sectionD_Frequency2, "sectionD_Period2": sectionD_Period2,
  "sectionD_Amount2": sectionD_Amount2, "sectionD_Frequency3": sectionD_Frequency3, "sectionD_Period3": sectionD_Period3,
  "sectionD_Amount3": sectionD_Amount3, "sectionD_Frequency4": sectionD_Frequency4, "sectionD_Period4": sectionD_Period4,
  "sectionD_Amount4": sectionD_Amount4, "sectionE_Check": sectionE_Check

};
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
        if (data.d.RetData.Tbl.Rows.length > 0) {
          if (data.d.RetData.Tbl.Rows[0].Success == true) {
            location.reload();
          } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
        }
      }
      else {
        alert(data.d.RetMsg);
      }
    },
    error: function(XMLHttpRequest, data, errorThrown){
      alert("Error: " + errorThrown);
    }
  })
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
};
//geneare drop down optioms
function GetDropdownList(id, category) {
  var data = {'LookupCat': category}
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
};

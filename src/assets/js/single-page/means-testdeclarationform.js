Foundation.Abide.defaults.patterns['NRIC'] = /^[A-Z]{1}[0-9]{7}[A-Z]{1}$/;
Foundation.Abide.defaults.patterns['Mobile'] =/^\+{0,1}\d{8,}$/;
$(document).foundation();

var moveToSectionC=0;
$(function() {
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
    loginID = appCookie.loginID;

  $('#submit').click(function() {
    SaveDeclaretion();
  });

  $.when(formSectionsInit(),GetDropdownList('.selOccupation', 'Jobs Category'),GetRelationship('.selRelationship')).then(function(){
    var ID= '';
    ID=GetQueryString('ID');
    if (ID.length>0) {
      GetMeanDeclaretion(ID)
    }
  });

});

//get url param
function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
}
//get data
function GetMeanDeclaretion(ID) {
      var data = { 'ID': ID };
      $.ajax({
          url: apiSrc + "BCMain/iCtc1.GetMeanDeclaretionForm.json",
          method: "POST",
          dataType: "json",
          xhrFields: { withCredentials: true },
          data: {
              'data': JSON.stringify(data),
              'WebPartKey': '021cb7cca70748ff89795e3ad544d5eb',
              'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'
          },
          success: function (data) {
              if ((data) && (data.d.RetVal === -1)) {
                  if (data.d.RetData.Tbl.Rows.length > 0) {
                      var MeansDeclare = data.d.RetData.Tbl.Rows[0];
                      $('#sectionA_DeclarationofDate').val(MeansDeclare.DateofDeclaration ||'');
                      if (MeansDeclare.SectionAMDASMembership == true) {
                        $('#sectionA_ordinaryMembershipYes').prop('checked', true)
                      }else if(MeansDeclare.SectionAMDASMembership == false){
                          $('#sectionA_ordinaryMembershipNo').prop('checked', true)
                      }else {

                      }
                      $('#sectionA_FamilyName').val(MeansDeclare.SectionAFamilyName || '')
                      $('#sectionA_GivenName').val(MeansDeclare.SectionAGivenName|| '')
                      $('#sectionA_DisplayName').val(MeansDeclare.SectionADisplayName|| '')
                      $('#sectionA_nric').val(MeansDeclare.SectionANRIC|| '')
                      $('#sectionA_Birth').text(MeansDeclare.SectionABirth|| '')
                      $('#sectionA_PostalCode').val(MeansDeclare.SectionAPostalCode|| '')
                      $('#sectionA_BlockNo').val(MeansDeclare.SectionABlockNo|| '')
                      $('#sectionA_Level').val(MeansDeclare.SectionALevelUnit|| '')
                      $('#sectionA_BuildingName').val(MeansDeclare.SectionABuildingName|| '')
                      $('#sectionA_StreetName').val(MeansDeclare.SectionAStreetName|| '')
                      $('#sectionA_Telhome').val(MeansDeclare.SectionATelNoHome|| '')
                      $('#sectionA_Teloffice').val(MeansDeclare.SectionATelNoOffice|| '')
                      $('#sectionA_Handphone').val(MeansDeclare.SectionAHandphone|| '')
                      $('#sectionA_Occupation').val(MeansDeclare.SectionAOccupation|| '')
                      $('#sectionA_email').val(MeansDeclare.SectionAEmail|| '')
                     //
                      $('#sectionB_FamilyName').val(MeansDeclare.SectionBFamilyName)
                      $('#sectionB_GivenName').val(MeansDeclare.SectionBGivenName)
                      $('#sectionB_DisplayName').val(MeansDeclare.SectionBDisplayName)
                      $('#sectionB_nric').val(MeansDeclare.SectionBNRIC)
                      $('#sectionB_Birth').val(MeansDeclare.SectionBBirth)
                      $('#sectionB_PostalCode').val(MeansDeclare.SectionBPostalCode)
                      $('#sectionB_BlockNo').val(MeansDeclare.SectionBBlockNo)
                      $('#sectionB_Level').val(MeansDeclare.SectionBLevelUnit)
                      $('#sectionB_BuildingName').val(MeansDeclare.SectionBBuildingName)
                      $('#sectionB_StreetName').val(MeansDeclare.SectionBStreetName)
                      $('#sectionB_mobile').val(MeansDeclare.SectionBHandphone)
                      $('#sectionB_home').val(MeansDeclare.SectionBTelNoHome)
                      $('#sectionB_office').val(MeansDeclare.SectionBTelNoOffice)
                      $('#sectionB_email').val(MeansDeclare.SectionBEmail)
                      $('#sectiotB_Occupation').val(MeansDeclare.SectionBOccupation)
                      $('#sectionB_relationship').val(MeansDeclare.SectionBRelationship)

                      var MainApplicant=MeansDeclare.MainApplicant||'';
                      var MainApplicantArr=MainApplicant.split('•');
                      $('#sectionC_FamilyNameMain').val(MainApplicantArr[0])
                      $('#sectionC_GivenNameMain').val(MainApplicantArr[1])
                      $('#sectionC_DisplayNameMain').val(MainApplicantArr[2])
                      $('#sectionC_AgeMain').val(MainApplicantArr[3])
                      $('#sectionC_OccupationMain').val(MainApplicantArr[4])
                      $('#sectionC_NettMain').val(MainApplicantArr[5])
                      $('#sectionC_GrossMain').val(MainApplicantArr[6])

                      var FamilyMember1=MeansDeclare.FamilyMember1||'';
                      var FamilyMember1Arr=FamilyMember1.split('•');
                      $('#sectionC_FamilyName1').val(FamilyMember1Arr[0])
                      $('#sectionC_GivenName1').val(FamilyMember1Arr[1])
                      $('#sectionC_DisplayName1').val(FamilyMember1Arr[2])
                      $('#sectionC_Age1').val(FamilyMember1Arr[3])
                      $('#sectionC_Occupation1').val(FamilyMember1Arr[4])
                      $('#sectionC_Relationship1').val(FamilyMember1Arr[5])
                      $('#sectionC_Nett1').val(FamilyMember1Arr[6])
                      $('#sectionC_Gross1').val(FamilyMember1Arr[7])

                      var FamilyMember2=MeansDeclare.FamilyMember2||'';
                      var FamilyMember2Arr=FamilyMember2.split('•');
                      $('#sectionC_FamilyName2').val(FamilyMember2Arr[0])
                      $('#sectionC_GivenName2').val(FamilyMember2Arr[1])
                      $('#sectionC_DisplayName2').val(FamilyMember2Arr[2])
                      $('#sectionC_Age2').val(FamilyMember2Arr[3])
                      $('#sectionC_Occupation2').val(FamilyMember2Arr[4])
                      $('#sectionC_Relationship2').val(FamilyMember2Arr[5])
                      $('#sectionC_Nett2').val(FamilyMember2Arr[6])
                      $('#sectionC_Gross2').val(FamilyMember2Arr[7])

                      var FamilyMember3=MeansDeclare.FamilyMember3||'';
                      var FamilyMember3Arr=FamilyMember3.split('•');
                      $('#sectionC_FamilyName3').val(FamilyMember3Arr[0])
                      $('#sectionC_GivenName3').val(FamilyMember3Arr[1])
                      $('#sectionC_DisplayName3').val(FamilyMember3Arr[2])
                      $('#sectionC_Age3').val(FamilyMember3Arr[3])
                      $('#sectionC_Occupation3').val(FamilyMember3Arr[4])
                      $('#sectionC_Relationship3').val(FamilyMember3Arr[5])
                      $('#sectionC_Nett3').val(FamilyMember3Arr[6])
                      $('#sectionC_Gross3').val(FamilyMember3Arr[7])

                      var FamilyMember4=MeansDeclare.FamilyMember4||'';
                      var FamilyMember4Arr=FamilyMember4.split('•');
                      $('#sectionC_FamilyName4').val(FamilyMember4Arr[0])
                      $('#sectionC_GivenName4').val(FamilyMember4Arr[1])
                      $('#sectionC_DisplayName4').val(FamilyMember4Arr[2])
                      $('#sectionC_Age4').val(FamilyMember4Arr[3])
                      $('#sectionC_Occupation4').val(FamilyMember4Arr[4])
                      $('#sectionC_Relationship4').val(FamilyMember4Arr[5])
                      $('#sectionC_Nett4').val(FamilyMember4Arr[6])
                      $('#sectionC_Gross4').val(FamilyMember4Arr[7])
                      var FamilyMember5=MeansDeclare.FamilyMember5||'';
                      var FamilyMember5Arr=FamilyMember5.split('•');
                      $('#sectionC_FamilyName5').val(FamilyMember5Arr[0])
                      $('#sectionC_GivenName5').val(FamilyMember5Arr[1])
                      $('#sectionC_DisplayName5').val(FamilyMember5Arr[2])
                      $('#sectionC_Age5').val(FamilyMember5Arr[3])
                      $('#sectionC_Occupation5').val(FamilyMember5Arr[4])
                      $('#sectionC_Relationship5').val(FamilyMember5Arr[5])
                      $('#sectionC_Nett5').val(FamilyMember5Arr[6])
                      $('#sectionC_Gross5').val(FamilyMember5Arr[7])

                      if (MeansDeclare.OtherSource == true) {
                      $('#sectionD_familysupportYes').prop('checked', true); $('#sectionD_familysupportNo').prop('checked', false);
                  } else if (MeansDeclare.OtherSource == false) {
                      $('#sectionD_familysupportYes').prop('checked', false); $('#sectionD_familysupportNo').prop('checked', true);
                  }
                  var Source1=MeansDeclare.Source1||'';
                  var Source1Arr=Source1.split('•');
                  $('#sectionD_Frequency1').val(Source1Arr[0])
                  $('#sectionD_Period1').val(Source1Arr[1])
                  $('#sectionD_Amount1').val(Source1Arr[2])
                  var Source2=MeansDeclare.Source2||'';
                  var Source2Arr=Source2.split('•');
                  $('#sectionD_Frequency2').val(Source2Arr[0])
                  $('#sectionD_Period2').val(Source2Arr[1])
                  $('#sectionD_Amount2').val(Source2Arr[2])
                  var Source3=MeansDeclare.Source3||'';
                  var Source3Arr=Source3.split('•');
                  $('#sectionD_Frequency3').val(Source3Arr[0])
                  $('#sectionD_Period3').val(Source3Arr[1])
                  $('#sectionD_Amount3').val(Source3Arr[2])
                  var Source4=MeansDeclare.Source4||'';
                  var Source4Arr=Source4.split('•');
                  $('#sectionD_Frequency4').val(Source4Arr[0])
                  $('#sectionD_Period4').val(Source4Arr[1])
                  $('#sectionD_Amount4').val(Source4Arr[2])


                  var Declaration1 = MeansDeclare.Declaration1 || '';
        	            if (Declaration1.length > 0) {
        	                var DeclarationsArr = Declaration1.split(',');
        	                for (var i = 0; i < DeclarationsArr.length; i++) {
        	                    $('#' + DeclarationsArr[i] + '').attr('checked', true);
        	                }
        	        }
                  var MainApplicantDeatils=MeansDeclare.MainApplicantDeatils||'';
                  var MainApplicantDeatilsArr=MainApplicantDeatils.split('•');

                  $('#sectionE_MainName').val(MainApplicantDeatilsArr[0])
                  $('#sectionE_MainSignature').val(MainApplicantDeatilsArr[1])
                  $('#sectionE_MainDate').val(MainApplicantDeatilsArr[2])
                  var OrdinaryMembershipDeatils=MeansDeclare.OrdinaryMembershipDeatils||'';
                   var OrdinaryMembershipDeatilsArr=OrdinaryMembershipDeatils.split('•');
                  $('#sectionE_MemberName').val(OrdinaryMembershipDeatilsArr[0])
                  $('#sectionE_MemberSignature').val(OrdinaryMembershipDeatilsArr[1])
                  $('#sectionE_MemberDate').val(OrdinaryMembershipDeatilsArr[2])

                  }
              }
          }
      });
  }
//Submit data
function SaveDeclaretion() {

  if (!formSectionValidate($('#pageContentWrapper'),1)) {
    return false;
  }
  var data = {};
  $('#pageContentWrapper :input,select').each(function() {
    var type = $(this).attr('type'),
      name = $(this).attr('name'),
      val = $(this).val();
    if (type == "radio") {
      val = $(':input[type="' + type + '"][name="' + name + '"]:checked').val() || '';
    }
    if (type == "checkbox") {
      var tempVal = '';
      $(':input[type="' + type + '"][name="' + name + '"]:checked').each(function(index, item) {
        if ($(item).prop('checked') == true) {
          tempVal += $(item).val() + ',';
        }
      });
      val = (tempVal.length > 0? tempVal.substr(0, tempVal.length - 1): '');
    }
    if ((!data.hasOwnProperty(data[name])) && name) {
      data[name] = val;
    }
  });
  $.ajax({
    url: apiSrc + "BCMain/iCtc1.SaveDeclaretion.json",
    method: "POST",
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    data: {
      'data': JSON.stringify(data),
      'WebPartKey': '021cb7cca70748ff89795e3ad544d5eb',
      'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'
    },
    success: function(data) {
      if ((data) && (data.d.RetVal === -1)) {
        alert('Successfully updated!');
        location.reload();
      } else {
        alert(data.d.RetMsg);
      }
    },
    error: function(XMLHttpRequest, data, errorThrown) {
      alert("Error: " + errorThrown);
    }
  });
}

//geneare drop down optioms
function GetDropdownList(id, category) {
  var data = {
    'LookupCat': category
  };
  $.ajax({
    url: apiSrc + "BCMain/iCtc1.Lookup_Get.json",
    method: "POST",
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    data: {
      'data': JSON.stringify(data),
      'WebPartKey': '021cb7cca70748ff89795e3ad544d5eb',
      'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'
    },
    success: function(data) {
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var lookup = data.d.RetData.Tbl.Rows;
          for (var i = 0; i < lookup.length; i++) {
            $(id).append('<option value="' + lookup[i].LookupKey + '">' + lookup[i].Description + '</option>');
          }
        }
      } else {
        alert(data.d.RetMsg);
      }
    }
  });
}

function GetRelationship(sel) {
  $.ajax({
    url: apiSrc + "BCMain/iCtc1.SearchRelationshipType.json",
    method: "POST",
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    data: {
      'data': JSON.stringify({}),
      'WebPartKey': '021cb7cca70748ff89795e3ad544d5eb',
      'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'
    },
    success: function(data) {
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var lookup = data.d.RetData.Tbl.Rows;
          for (var i = 0; i < lookup.length; i++) {
            $(sel).append('<option value="' + lookup[i].RelationshipAB + '">' + lookup[i].RelationshipAB  + '</option>');
          }
        }
      } else {
        alert(data.d.RetMsg);
      }
    }
  });
}


function formSectionsInit() {

  $('form.formSection').each(function() {
    var form = $(this);
    var fieldsets = form.find('fieldset');
    var breadcrumbs = form.find('.breadcrumbs');
    var footer = form.find('footer.buttonsGroup');

    form.data('current-form-index',0);

    breadcrumbs.html('');

    fieldsets.each(function(index) {
      var fieldset = $(this);
      fieldset.data('fieldset-index',index);
      breadcrumbs.append('<li><a href="#'+fieldset.prop('id')+'" data-fieldset-index="'+index+'">'+fieldset.find('h2').html()+'</a>').find('li:eq(0) a').addClass('active');

      if(index>0) {
        fieldset.hide();
      }
    });

    breadcrumbs.find('a').click(function() {
      var thisObj = $(this);
      var currentIndex = parseInt(form.data('current-form-index'));

      if (formSectionValidate(form,0) ) {
        loadFormSection(thisObj.data('fieldset-index'),3);
      }
      return false;
    });

    //set buttons
    footer.find('#previous').hide();
    footer.find('[class*=submit]').hide();

    footer.find('#previous').click(function() {

      var currentIndex = parseInt(form.data('current-form-index'));
      var targetIndex = currentIndex-1;

      if (targetIndex <0) targetIndex=0;

      if (formSectionValidate(form,0) ) {
        loadFormSection(targetIndex,0);
      }
      return false;
    });
    footer.find('#next').click(function() {

        if (formSectionValidate(form,0)) {
          var targetIndex = parseInt(form.data('current-form-index')) + 1;
          if (targetIndex >= fieldsets.length) targetIndex=fieldsets.length-1;
          loadFormSection(targetIndex,1);
        }
        return false;
    });

    function loadFormSection(index,isNext) {
      //set index
      if (index==1) {
        if (moveToSectionC==1&&isNext==1) {
          index++;
        }
        else if(moveToSectionC==1&&isNext==0) {
          index--;
        }
      }
      form.data('current-form-index', index);
      var targetIndex = index;

      breadcrumbs.find('a').removeClass('active').filter(function() {
        return ($(this).data('fieldset-index') == targetIndex);
      }).addClass('active');

      //set fieldset`
      fieldsets.hide().filter(function() {
        return ($(this).data('fieldset-index') == targetIndex);
      }).show();

      if (index == 0) {
        footer.find('#previous').hide();
        footer.find('#next').show();
        footer.find('[class*=submit]').hide();
      }
      else if (index == fieldsets.length-1) {
        footer.find('#previous').show();
        footer.find('#next').hide();
        footer.find('[class*=submit]').show();
      }
      else {
        footer.find('#previous').show();
        footer.find('#next').show();
        footer.find('[class*=submit]').hide();
      }
    }
  });
}

function formSectionValidate(form,isAll) {

  var result=0;
  moveToSectionC=$('[name=sectionA_ordinaryMembership]:checked').val();
  if (!isAll) {
      $(form).find('fieldset:hidden :input,select').attr('disabled','disabled');
  }
  if (moveToSectionC==1) {
    $(form).find('fieldset:eq(1) :input,select').attr('disabled','disabled');
  }
  $(form).on('formvalid.zf.abide',function(){result=1;});

  $(form).foundation('validateForm');

  if (moveToSectionC==1) {
     $(form).find('fieldset:not(:eq(1)) :input,select').removeAttr('disabled');
  }
  else {
     $(form).find('fieldset :input,select').removeAttr('disabled');
  }

  return result;
}

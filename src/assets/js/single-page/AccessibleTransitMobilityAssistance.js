Foundation.Abide.defaults.patterns['NRIC'] = /^[A-Z]{1}[0-9]{7}[A-Z]{1}$/;
Foundation.Abide.defaults.patterns['Mobile'] =/^\+{0,1}\d{8,}$/;
$(document).foundation();
$(function(){
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
      loginID = appCookie.loginID;
    formSectionsInit();formOthersInit();
    GetRelationship('.sectionB_relationship');
    // save data
    $('#submit').click(function(){
      SaveMuscularDystrophyAssociation();
    });
});

function formSectionValidate(form,isAll) {
  var result=0;
  if (!isAll) {
      $(form).find('fieldset:hidden :input,select').attr('disabled','disabled');
  }
  $(form).on('formvalid.zf.abide',function(){result=1;});
  $(form).foundation('validateForm');
  $(form).find('fieldset :input').removeAttr('disabled');
  return result;
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
function formOthersInit() {
  $('[data-form-other-text=true]').prop('readonly','readonly');
  $('[data-form-other]').each(function(){
    var thisObj = $(this);
    var targetVal = thisObj.data('form-other');
    var targetObj = $('#' + targetVal);
    var target = $('#' + targetVal);


    if (thisObj.prop('type')=='checkbox') {
      //console.log('checkbox');
      thisObj.click(function() {
        if (thisObj.is(':checked')) {
          targetObj.prop('readonly','');
        }
        else {
          targetObj.val('');
          targetObj.prop('readonly','readonly');
        }
      });
    }
    else if (thisObj.prop('type') == 'radio') {
      var radioName = thisObj.prop('name');
      var thisVal = thisObj.val();
      var radioGroup = $('[name='+radioName+']');

      radioGroup.click(function() {

        if ($('[name='+radioName+']:checked').val() == thisVal) {
          targetObj.prop('readonly','');
        }
        else {
          targetObj.val('');
          targetObj.prop('readonly','readonly');
        }
      });
    }
    else if (thisObj.is('select')) {
      thisObj.change(function() {
        var thisVal = thisObj.val();
        //console.log('select');
        if (thisVal.toLowerCase()=='other' || thisVal.toLowerCase()=='others') {
          targetObj.prop('readonly','');
        }
        else {
          targetObj.val('');
          targetObj.prop('readonly','readonly');
        }
      });
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
        loadFormSection(thisObj.data('fieldset-index'));
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
        loadFormSection(targetIndex);
      }
      return false;
    });
    footer.find('#next').click(function() {
        if (formSectionValidate(form,0)) {
          var targetIndex = parseInt(form.data('current-form-index')) + 1;
          if (targetIndex >= fieldsets.length) targetIndex=fieldsets.length-1;
          loadFormSection(targetIndex);
        }
        return false;
    });
    function loadFormSection(index) {
      //set index
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


// save initial-assesment-form
function SaveMuscularDystrophyAssociation(){
  if (!formSectionValidate($('#pageContentWrapper'),1)) {
  return false;
}
  var data={};
  $('#pageContentWrapper :input,select').each(function(){
    var type=$(this).attr('type'), name= $(this).attr('name'),val=$(this).val();
    if (type=="radio") { val=$(':input[type="'+type+'"][name="'+name+'"]:checked').val()||'';};
    if (type=="checkbox") {
      var tempVal='';
      $(':input[type="'+type+'"][name="'+name+'"]').each(function(index,item){
        if ($(item).prop('checked')==true) {
          tempVal+=$(item).val()+',';
        }
      });
      val=(tempVal.length>0?tempVal.substr(0,tempVal.length-1):'');
    };
    if ((!data.hasOwnProperty(data[name]))&&name) {
      data[name]=val;
    }
  });

  $.ajax({
    url: apiSrc+"BCMain/iCtc1.SaveMuscularDystrophyAssociation.json",
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
            alert('Successfully updated!');
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

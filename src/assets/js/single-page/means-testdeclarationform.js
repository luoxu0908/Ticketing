
$(function() {
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
    loginID = appCookie.loginID;
formSectionsInit();
  $('#submit').click(function() {
    SaveDeclaretion();
  });
  GetDropdownList('.selOccupation', 'Jobs Category');
  GetRelationship('.selRelationship');
});

//Submit data
function SaveDeclaretion() {
  if (!formSectionValidate(form,1)) {
    return false;
  }
  var data = {};
  $('#DeclaretionFrom :input,select').each(function() {
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

//convert date to dd/mm/yyyy
function convertDateTime(inputFormat, type) {
  if (inputFormat == null) {
    return '-';
  }
  function pad(s) {
    return (s < 10)? '0' + s: s;
  }
  var d = new Date(inputFormat);
  if (type == 'date') {
    return [
      pad(d.getDate()),
      pad(d.getMonth() + 1),
      d.getFullYear()
    ].join('/');
  } else if (type == 'datetime') {
    return [
      pad(d.getDate()),
      pad(d.getMonth() + 1),
      d.getFullYear()
    ].join('/') + ' ' + [
      pad(d.getHours()),
      pad(d.getMinutes()),
      pad(d.getSeconds())
    ].join(':');
  } else if (type == 'time') {
    return [
      pad(d.getHours()),
      pad(d.getMinutes()),
      pad(d.getSeconds())
    ].join(':');
  }
}

function GetDeclarationInfo(DeclarationID) {
  var data = {
    'DeclarationID': DeclarationID
  };
  $.ajax({
    url: apiSrc + "BCMain/iCtc1.GetDeclarationInfo.json",
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
          var DeclarationInfo = data.d.RetData.Tbl.Rows[0];
        }
      }
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
    url: apiSrc + "BCMain/iCtc1.Relationship_Get.json",
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
            $(sel).append('<option value="' + lookup[i].RelKeyAB + '">' + lookup[i].RelKeyAB  + '</option>');
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
      if (formSectionValidate(form) ) {
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
  });
}

function formSectionValidate(form,isAll) {
  var result=0;
  if (!isAll) {
      $(form).find('fieldset:hidden :input').attr('disabled','disabled');
  }
  $(form).foundation('validateForm');
  $(form).on('formvalid.zf.abide',function(){result=1;});
  $(form).find('fieldset :input').removeAttr('disabled');
  return result;
}

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

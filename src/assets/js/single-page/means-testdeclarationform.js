var pageresult = 0;
$(function() {
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
    loginID = appCookie.loginID;
  $('#submit').click(function() {
    SaveDeclaretion();
  });
  $('#DeclaretionFrom').on('formvalid.zf.abide', function() {
    pageresult = 1;
  });
  $('#DeclaretionFrom').on('forminvalid.zf.abide', function() {
    pageresult = 0;
  });
  GetDropdownList('.selOccupation', 'Jobs Category');
  GetRelationship('.selRelationship');
});

//Submit data
function SaveDeclaretion() {
  $('#DeclaretionFrom').foundation('validateForm');
  if (pageresult == 0) {
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
            $(id).append('<option value="' + lookup[i].RelKeyAB + '">' + lookup[i].RelKeyAB + '</option>');
          }
        }
      } else {
        alert(data.d.RetMsg);
      }
    }
  });
}

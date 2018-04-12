var access = false;
$(function () {
        //get cookie & loginID
        $('#submit').click(function () {
            var  RKey=GetQueryString('RKey');
            Submit(RKey);
        });

});

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

function Submit(RKey) {
      var NewPassword = $('#NewPassword').val()||'', ConfirmPassword = $('#ConfirmPassword').val()||'';

      if (NewPassword.length<=0) {
          alert('New Password is required.');
          return false;
      }
      if (ConfirmPassword.length<=0) {
          alert('Confirm Password is required.');
          return false;
      }
      if (NewPassword!=ConfirmPassword) {
          alert('New Password must be equals Confirm Password.')
          return false;
      }

      var data = {'NewPassword': NewPassword, 'RKey': RKey };
      $.ajax({
          url: apiSrc + "BCMain/iCtc1.UserModifyPassword.json",
          method: "POST",
          dataType: "json",
          xhrFields: { withCredentials: true },
          data: {
              'data': JSON.stringify(data),
              'WebPartKey': WebPartVal,
              'ReqGUID': getGUID()
          },
          success: function (data) {
              if ((data) && (data.d.RetVal === -1)) {
                  if (data.d.RetData.Tbl.Rows.length > 0) {
                      if (data.d.RetData.Tbl.Rows[0].Success == true) {
                            alert("Password Updated.")
                      } else {
                          alert(data.d.RetData.Tbl.Rows[0].ReturnMsg);
                      }
                  }
              }
              else {
                  alert(data.d.RetMsg);
              }
          },
          error: function (XMLHttpRequest, data, errorThrown) {
              alert("Error: " + errorThrown);
          }
      });
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

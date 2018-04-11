var access = false;
$(function () {
        //get cookie & loginID
        $('#submit').click(function () {
            Submit();
        });
    });

    function Submit() {
          var UserNameCheck = '', PasswordCheck = '', EmailAddressOrNric = $('#EmailAddressOrNric').val() || '';
          if ($('#RememberUsernameCheckBox').prop('checked') == true) {
              UserNameCheck = $('#RememberUsernameCheckBox').val();
          }
          if ($('#RememberPasswordCheckBox').prop('checked') == true) {
              PasswordCheck = $('#RememberPasswordCheckBox').val();
          }
          if (UserNameCheck.length <= 0 && PasswordCheck <= 0) {
              alert('Please tick either one of the above fields.');
              return false;
          }
          if (EmailAddressOrNric.length < 5) {
              alert('No matching record found.');
              return false;
          }

          var data = { 'UserNameCheck': UserNameCheck, 'PasswordCheck': PasswordCheck, 'EmailAddressOrNric': EmailAddressOrNric };
          $.ajax({
              url: apiSrc + "BCMain/iCtc1.SendUserNameAndPassword.json",
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
                              alert("Your request has been successfully sent to your email"+data.d.RetData.Tbl.Rows[0].EmailAddrStr)
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

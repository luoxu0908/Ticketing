var pageresult=0;
$(function(){
  //get cookie & loginID
  var appCookie = Cookies.getJSON('appCookie'),
      loginID = appCookie.loginID;

    //calculater total score
    CalculaterItemTotal();
    // save data
    $('#submit').click(function(){
      SaveInitialAssesment();
    });
    $('#InitialAssessmentForm').on('formvalid.zf.abide',function(){pageresult=1;});
    $('#InitialAssessmentForm').on('forminvalid.zf.abide',function(){pageresult=0;});
});

function CalculaterItemTotal() {
        $('input[name="sectionE_moibilityIndoors"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreMobility').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreMobility').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreMobility').html(parseInt($('#sectionE_ScoreMobility').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_Transfers"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreTransfers').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreTransfers').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreTransfers').html(parseInt($('#sectionE_ScoreTransfers').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_Stairs"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreStairs').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreStairs').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreStairs').html(parseInt($('#sectionE_ScoreStairs').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_ToiletUse"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreToilet').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreToilet').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreToilet').html(parseInt($('#sectionE_ScoreToilet').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_Bladder"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreBladder').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreBladder').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreBladder').html(parseInt($('#sectionE_ScoreBladder').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_Bowels"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreBowels').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreBowels').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreBowels').html(parseInt($('#sectionE_ScoreBowels').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_BathingShowering"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreBathing').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreBathing').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreBathing').html(parseInt($('#sectionE_ScoreBathing').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })



        $('input[name="sectionE_Grooming"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreGrooming').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreGrooming').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreGrooming').html(parseInt($('#sectionE_ScoreGrooming').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_Dressing"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreDressing').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreDressing').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreDressing').html(parseInt($('#sectionE_ScoreDressing').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })
        $('input[name="sectionE_Feeding"]').click(function () {
            if ($(this).is(':checked')) {
                $('#sectionE_ScoreFeeding').html(parseInt($(this).val()) + parseInt($('#sectionE_ScoreFeeding').html()));
                CalculaterTotalScore();
            } else {
                $('#sectionE_ScoreFeeding').html(parseInt($('#sectionE_ScoreFeeding').html()) - parseInt($(this).val()));
                CalculaterTotalScore();
            }
        })

    }
    function CalculaterTotalScore() {
        var TotalScore = 0;
        $('.score').each(function (index, item) {
            TotalScore += parseInt($(item).html());
        });
        $('#sectionE_totalScore').val(TotalScore);
    }
// save initial-assesment-form
function SaveInitialAssesment(){
  $('#InitialAssessmentForm').foundation('validateForm');
  if (pageresult==0){return false;}
  var data={};
  $('#InitialAssessmentForm :input,select').each(function(){
    var type=$(this).attr('type'), name= $(this).attr('name'),val=$(this).val();
    if (type=="radio") { val=$(':input[type="'+type+'"][name="'+name+'"]:checked').val()||'';};
    if (type=="checkbox") {
      var tempVal='';
      $(':input[type="'+type+'"][name="'+name+'"]:checked').each(function(index,item){
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
  console.log(data)
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.SaveInitialAssesment.json",
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
            alert("success")
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

function GetInitialAssesmentInfo(InitialAssesmentID){
  var data = {'InitialAssesmentID':InitialAssesmentID};
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.GetInitialAssesmentInfo.json",
    method: "POST",
    dataType: "json",
    xhrFields: { withCredentials: true },
    data: {'data':JSON.stringify(data),
          'WebPartKey':'021cb7cca70748ff89795e3ad544d5eb',
          'ReqGUID': 'b4bbedbf-e591-4b7a-ad20-101f8f656277'},
    success: function(data){
      if ((data) && (data.d.RetVal === -1)) {
        if (data.d.RetData.Tbl.Rows.length > 0) {
          var InitialAssesment = data.d.RetData.Tbl.Rows[0];
          if (InitialAssesment.POCContact=='yes') {
            $('#sectionA_ordinaryMembershipYes').prop('checked', true);
          }
          $('#sectionA_FamilyName').val(InitialAssesment.POCContact);$('#sectionA_GivenName').val(InitialAssesment.POCContact);$('#sectionA_DisplayName').val(InitialAssesment.POCContact);
          $('#sectionA_nric').val(InitialAssesment.POCContact);$('#sectionA_Birth').val(InitialAssesment.POCContact);
          if (InitialAssesment.POCContact='male') {
            $('#sectionA_genderMale').prop('checked', true);
          }else if(InitialAssesment.POCContact='female'){
              $('#sectionA_genderFemale').prop('checked', true);
          }

          $('#sectionA_race').val(InitialAssesment.POCContact);
          if (InitialAssesment.POCContact=='Other'){
            $('#sectionA_raceOthersText').attr("disabled",false);
            $('#sectionA_raceOthersText').val(InitialAssesment.POCContact);
          }

        }
      }
    }
  });
};
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

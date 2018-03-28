var SGH;

$(document).ready(function () {
	//$('button').button(); //??
	window.GridImgFolder = '../../styles/images';
	var Top = $("#myGrid").position().top;

	//$("#myGrid").height($(window).height() - Top - 10);

	SGH = new SlickGridHelper(
		"#myGrid",
		"PJT.Listing",
		{
			enableCellNavigation: true,
			enableColumnReorder: true,
			autoHeight: false,
			autoEdit: false,
			editable: true,
			enableAddRow: false,
			asyncEditorLoading: false,
			forceFitColumns: false,
			multiColumnSort: true,
			rowHeight: 60
		},
		{
			AddSelColumn: false,
			GetDataURL: "https://enterprise.travelplanner.com.sg/QuotientStg/Pjt1.GetProjectList.json",
			AddRowURL: "",
			DelRowURL: "",
			UpdRowURL: "",
			UpdRowFldURL: "https://enterprise.travelplanner.com.sg/QuotientStg/Pjt1.Project_UpdRowFld.json",
			CustomURL: ""
		}
	);

	var pageInit = $.JSONPost("https://enterprise.travelplanner.com.sg/QuotientStg/Pjt1.GetProjectOverview.json", {});

	pageInit.fail(function (jqXHR, textStatus, errorThrown) { alert(textStatus); });

	pageInit.done(function (data, textStatus, jqXHR) {
		if ((data) && (data.d.RetVal == -1)) {

			var Itms = data.d.RetData.PjtStatus.Rows, Sel = $("#StatusFilter");
			for (var i = 0; i < Itms.length; i++) {
				Sel.append($('<option>', { value: Itms[i].Val }).text(Itms[i].Txt));
			}
			$('#StatusFilter :nth-child(2)').attr('selected', 'selected');

			Itms = data.d.RetData.PjtTypes.Rows, Sel = $("#ProjectType");
			for (var i = 0; i < Itms.length; i++) {
				Sel.append($('<option>', { value: Itms[i].Val }).text(Itms[i].Txt));
			}
			$('#ProjectType :nth-child(1)').attr('selected', 'selected');

			Itms = data.d.RetData.ViewTypes, Sel = $("#Scope");
			for (var i = 0; i < Itms.length; i++) {
				Sel.append($('<option>', { value: Itms[i].Val }).text(Itms[i].Txt));
			}
			RefreshGrid();
		} else {
			alert(data.d.RetMsg);
		}
	});

	$("#GenericFilter").keypress(function (e) { if (e.which == 13) { RefreshGrid(); } });
});//onready

function RefreshGrid() {
	SGH.GridLoadData({
		Scope: $("#Scope").val(),
		PjtType: $("#ProjectType").val(),
		PjtStatus: $("#StatusFilter").val(),
		PjtFilter: $("#GenericFilter").val()
	});
} //RefreshGrid

function ResizeMe() {
	SGH.resize();
};

var resizeTimer;

$(window).resize(function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(ResizeMe, 100);
});

function AddNewProject() {
  var option = "";

	$.JSONPost("https://enterprise.travelplanner.com.sg/QuotientStg/Pjt1.GetProjectLookup.json", { "LookupCat": "ProjectType" }, "")
  .then(function (data) {
    if (data.d.RetVal == -1) {
      option += "<div><select id='Type'>";
      var Tbl = data.d.RetData.Tbl;
      var RowCnt = Tbl.Rows.length;
      for (var i = 0; i < RowCnt; i++) {
        option += "<option value=" + Tbl.Rows[i].LookupKey + ">" + Tbl.Rows[i].Description + "</option>";
      }
      option += "</select></div>";
    }

		option += "<div><label for='ProjectTitle'>Title</label><input id='ProjectTitle' type='text'></div>";

		var newprojectdiv = $("<div style='display:none;'/>").attr("id", "newprojectdiv").html(option).appendTo(document.body);

		newprojectdiv.dialog({
			title: "Add new project",
			modal: true,
			position: {
				my: "top",
				at: "bottom",
				of: "#addnewproject"
			},
			buttons: {
				"Save": function () {
      		var projecttype = $("#Type option:selected").val();
      		$.JSONPost("https://enterprise.travelplanner.com.sg/QuotientStg/Pjt1.CreateNewProject.json", { "ProjectID": "", "ProjectType": projecttype, "ProjectTitle": $("#ProjectTitle").val(), "Client": "", "CRoleID": "0" })
    			.then(function (data) {
      			var projectid = data.d.RetData.Tbl.Rows[0].ProjectID
            if (projectid.length > 0) {
              newprojectdiv.dialog("close");
              window.open("../../BCMain/tabs.htm?Prefix=PJ&Type=iProjectSum&title=" + $("#ProjectTitle").val() + "&subtitle=" + projectid + "&PID=" + projectid, "", "width=700,height=600");
            }
    			});
    		},
				"Cancel": function () {
					newprojectdiv.dialog("close");
				}
    	}
  	}); //newprojectdiv.dialog
	}); //JSONPost then
} //AddNewProject

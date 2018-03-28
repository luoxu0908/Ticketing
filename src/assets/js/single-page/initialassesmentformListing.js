var SGH;

$(document).ready(function () {
	//$('button').button(); //??
	window.GridImgFolder = '../../styles/images';
	var Top = $("#myGrid").position().top;

	//$("#myGrid").height($(window).height() - Top - 10);

	SGH = new SlickGridHelper(
		"#myGrid",
		"FL.InitialAssessmentFormListing",
		{
			enableCellNavigation: true,
			enableColumnReorder: true,
			autoHeight: false,
			autoEdit: false,
			editable: true,
			enableAddRow: false,
			asyncEditorLoading: false,
			forceFitColumns: false,
			multiColumnSort: true
		},
		{
			AddSelColumn: false,
			GetDataURL: apiSrc+"/FL1.InitialAssessmentFormListing_Get.json",
			AddRowURL: "",
			DelRowURL: "",
			UpdRowURL: "",
			UpdRowFldURL: "",
			CustomURL: ""
		}
	);

	var pageInit = $.JSONPost(apiSrc+"/FL1.InitialAssessmentFormListing_Get.json", {});

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
		// Scope: $("#Scope").val(),
		// PjtType: $("#ProjectType").val(),
		// PjtStatus: $("#StatusFilter").val(),
		// PjtFilter: $("#GenericFilter").val()
	});
} //RefreshGrid

function ResizeMe() {
	SGH.resize();
};

var resizeTimer;

$(window).resize(function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(ResizeMe, 10000);
});

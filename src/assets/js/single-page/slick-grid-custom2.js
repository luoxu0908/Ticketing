$MyGrid = $("#myGrid");

window.SGH = false;
window.SGHInitMaxTries = 40;

window.SGHInitTries = window.SGHInitMaxTries; //countdown, set to -1 if successful, 0 if failed

$('#refreshGrid').click(refreshData());
function refreshData() { jQuery.event.trigger({ type: "refreshSG" }); }

function DoSlickGridInit() {
	window.SGHInitTries -= 1;

	if ((QS.SGModKey || '').length == 0) window.SGHInitTries = 0; //fail

	if (window.SGHInitTries > 0) {
		//if (DoGridInit) { //do init here
			window.SGHInitTries = 0; //assume failure
			window.GridImgFolder = '../styles/images';
			var MinGridHeight = parseFloat(QS.MinGridHeight || 200);
			var GridHeightOffset = parseFloat(QS.GridHeightOffset || -14);
			var GridHeight = parseFloat($(window).height()) - parseFloat($MyGrid.position().top) + GridHeightOffset;

			if (GridHeight < MinGridHeight) GridHeight = MinGridHeight; //min grid height

			$MyGrid.height(GridHeight);
			//if width during init is > ForceFitColsMinWidth && MinWidth>0 then we force fit, else we don't

			var FFMin = (QS.ForceFitColsMinWidth || 0);
			var _rowHeight = (QS.rowHeight || 60);
			console.log('_rowHeight: ' +_rowHeight);
			var _headerRowHeight = (QS.headerRowHeight || ((_rowHeight / 25) * 16));


console.log('_headerRowHeight:'+ _headerRowHeight);
			//note that if CustomEditCmdHandler is a function, it will override the default SGH editCommandHandler

			window.SGH = new SlickGridHelper(
				"#myGrid",
				QS.SGModKey,
				{
					enableCellNavigation: true,
					enableColumnReorder: true,
					autoHeight: false,
					autoEdit: (QS.autoEdit || false),
					rowHeight: _rowHeight,
					headerRowHeight: _headerRowHeight,
					editable: true,
					enableAddRow: false,
					asyncEditorLoading: false,
					forceFitColumns: ( (FFMin > 0) && ( $(window).width() >= FFMin ) ),
					multiColumnSort: true,
					editCommandHandler: ( (typeof (CustomEditCmdHandler) === "function") ? CustomEditCmdHandler : false )
				},
				{
					AddSelColumn: (QS.AddSelCol || false),
					GetDataURL: (QS.GetDataURL || ''),
					AddRowURL: (QS.AddRowURL || ''),
					DelRowURL: (QS.DelRowURL || ''),
					UpdRowURL: (QS.UpdRowURL || ''),
					UpdRowFldURL: (QS.UpdRowFldURL || ''),
					CustomURL: (QS.CustomURL || ''),
					ExportURL: (QS.ExportURL || ''),
					AutoResize: false,
					GridHeightOffset: GridHeightOffset,
					ReqTimeoutMS: (QS.ReqTimeoutMS || 30000)
				},
				function () { //function called after grid init
					if ((typeof (CustomGridFilter) === "function") && (typeof (GetCustomGridFilterData) === "function")) {
						SGH.DataView.beginUpdate();
						SGH.DataView.setFilterArgs(GetCustomGridFilterData());
						SGH.DataView.setFilter(CustomGridFilter);
						SGH.DataView.endUpdate();
					}
					//Listen to this custom event to refresh data, if there is a function called GetFilterData we use that
					$(document).on("refreshSG", function (e) {
						var Opt = (e.JSONOpt || {});
						if (typeof (GetFilterData) === "function") {
							SGH.GridLoadData(GetFilterData(), '', Opt);
						} else {
							SGH.GridLoadData((QS || {}), '', Opt);
						}
					});
					//Listen to this custom event to export data, if there is a function called GetFilterData we use that
					$(document).on("exportSG", function (e) {
						if (typeof (GetFilterData) === "function") { SGH.GridExport(GetFilterData()); } else { SGH.GridExport((QS || {})); }
					});


					jQuery.event.trigger({ type: "afterinitSG" });

					var R = 1;
					if (QS.hasOwnProperty('RefreshOnLoad')) { R = QS.RefreshOnLoad }
					else if (QS.hasOwnProperty('refreshonload')) { R = QS.refreshonload };

					var Opt = $.extend(true, { RefreshOnLoad: R, RefreshOnLoad_JSONOpt: { } }, window.DefaultGridOptions);

					if (Opt.RefreshOnLoad != 0) { jQuery.event.trigger({ type: "refreshSG", JSONOpt: Opt.RefreshOnLoad_JSONOpt }); }
				},
				function () {
					jQuery.event.trigger({ type: "refreshedSG" });
				},
				function (Cols, RowKeyField, OthDS, OthSettings) {
					if (typeof (PreInitGrid) === "function") PreInitGrid(Cols, RowKeyField, OthDS, OthSettings);
				}
			); //slickgridheler
			//$(document).on("RecalcUI", function (e) { window.SGH.resize(MinGridHeight); });
			$(document).on("EndEdit", function (e) { window.SGH.endEditTrySave(); });
			window.SGHInitTries = -1; //success
		//}//DoGridInit
	}//window.SGHInitTries

	//check here if we should warn or retry
	if (window.SGHInitTries > 0) { //wait awhile and try to init later when window.DoGridInit exists
		setTimeout(function () { DoSlickGridInit(); }, 250);
	}
	else if (window.SGHInitTries == 0) {
		alert(
			'Grid failed to initialize - please try again and notify your admin if this recurs. (Dev note: set window.DoGridInit=true when you want grid to start init routines; check that SGModKey querystring is defined'
		);
	}
};
$(document).ready(function () {
	window.QS = $.parseQS(); window.DoGridInit = false;
	setTimeout(function () { DoSlickGridInit(); }, 25); //Give other widgets some time to init
});

var $MTool = $('#MTool'), $filters = $('#Filters');
	window.QS = $.parseQS();
	$(document).on("togShowHide", function (e) {
	    if (e.Show) { $filters.show(); $MTool.show(); } else { $filters.hide(); $MTool.hide(); }
	});
	$(document).ready(function () {

	});
	function OpenMeans() {
	}
	window.open(apiSrc+"mdas/initial-assesment-form.html")
	function ViewEdit(ID) {
	    var url = apiSrc+'mdas/initial-assesment-form.html?ID=' + ID;
	    window.open(url)
	}

	function refreshData() { jQuery.event.trigger({ type: "refreshSG" }); }
	function GetFilterData() {
	    var FilterData = { 'DisplayName': $('#DisplayName').val() || "", 'QueryNRIC': $('#QueryNRIC').val() || "" };
	    return FilterData;
	}
	window.DoGridInit = true; //ready for SG to init

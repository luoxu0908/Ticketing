$MyGrid = $("#myGrid");

window.SGH = false;
window.SGHInitMaxTries = 40;

window.SGHInitTries = window.SGHInitMaxTries; //countdown, set to -1 if successful, 0 if failed

$('#refreshGrid, #BtnRefresh').on('click',refreshData());
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

			var _headerRowHeight = (QS.headerRowHeight || ((_rowHeight / 25) * 16));

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

					//create form using json
					let formJson = [
							{
								eq: 0,
								id:'displayName',
								name:'displayName',
								label: 'Display Name',
								type: 'select',
								width: '200',
								style: {
									background: 'red'
								}
							},
							{
								eq: 1,
								id:'createDate',
								name:'createDate',
								label: 'Create Date',
								type: 'text',
								placeholder: 'hello',
								value: ''
							}
					];
					/*
					[{"eq":0,"id":"displayName","name":"displayName","label":"Display Name","type":"select","width":"200","style":{"background":"red"}},{"eq":1,"id":"createDate","name":"createDate","type":"text","placeholder":"hello","value":""}]

					%5B%7B%22eq%22%3A0%2C%22id%22%3A%22displayName%22%2C%22name%22%3A%22displayName%22%2C%22label%22%3A%22Display%20Name%22%2C%22type%22%3A%22select%22%2C%22width%22%3A%22200%22%2C%22style%22%3A%7B%22background%22%3A%22red%22%7D%7D%2C%7B%22eq%22%3A1%2C%22id%22%3A%22createDate%22%2C%22name%22%3A%22createDate%22%2C%22type%22%3A%22text%22%2C%22placeholder%22%3A%22hello%22%2C%22value%22%3A%22%22%7D%5D
					*/
					//createForm
					if (typeof formJson != 'undefined' && formJson.length > 0) {
						createFilterForm(formJson);
					}

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

	function OpenMeans() {
	}

	function ViewEdit(ID) {
	    var url = apiSrc+'mdas/initial-assesment-form.html?ID=' + ID;
	    window.open(url)
	}

	function refreshData() { jQuery.event.trigger({ type: "refreshSG" }); }

	function createFilterForm(formJson) {


		let formContainer = $('#slickGridFormContainer');
		formContainer.html('');
		formContainer.append('<div class="row"></div><footer></footer>');
		let formRow = formContainer.find('.row');
		let formFooter = formContainer.find('footer');

		for (let i = 0; i < formJson.length; i++) {
			let formObj = null;
			let formLabel = null;
			let formObjDiv = $('<div></div>');

			switch (formJson[i].type.toLowerCase()) {
				case 'select':
					formObj = $('<select></select>');
				break;
				case 'text':
					formObj = $('<input type="text"/>');
				default:
				break;
			}
			//formLabel

			formObjDiv.data('form-obj-id',formJson[i].id);
			formObj.prop('id', formJson[i].id);
			formObj.prop('name', formJson[i].name);
			if (typeof formJson[i].placeholder != 'undefined' && formJson[i].placeholder != '')
				formObj.prop('placeholder', formJson[i].placeholder);
			if (typeof formJson[i].value != 'undefined' && formJson[i].value != '')
				formObj.val(formJson[i].value);
			if (typeof formJson[i].style != 'undefined' && formJson[i].style != '')
				formObj.css(formJson[i].style);

			formObjDiv.append('<label for="'+formJson[i].id+'">'+formJson[i].label+'</label>')
			formObj.appendTo(formObjDiv);
			formObjDiv.appendTo(formRow);
		};   //for

		formFooter.append('<button id="BtnRefresh">Refresh</button>');
	} //createFilterForm

	function GetFilterData() {
		//dynamic get filter data
		let formRow = $('#slickGridFormContainer').find('.row');
		let formJson = {};

		formRow.find('div').each(function() {
			let thisObj = $(this);
			var formObjID = thisObj.data('form-obj-id');
			formJson[formObjID] = $('#'+formObjID).val();
		});

	  return formJson;
	}
	window.DoGridInit = true; //ready for SG to init

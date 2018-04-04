//BizSense slickgrid helper by Paul Yeo
var resizeTimer;
var SlickGridHelper = function SlickGridHelper(GridID, ModKey, GridOptions, HelperOptions, AftGridInitCallback, AftGridLoadDataCallback, PreInitCallback) {
	var _SGH = this;
	var _Delim = String.fromCharCode(8226);
	_SGH.Options = $.extend({
			AddSelColumn: false,
			GetDataURL: '',
			AddRowURL: '',
			DelRowURL: '',
			UpdRowURL: '',
			UpdRowFldURL: '',
			UpdRowFld_DisableOth: '',
			CustomURL: '',
			ExportURL: '',
			GridWidth: 0.0,
			GridHeight: 0.0,
			GridWidthOffset: 0.0,
			GridHeightOffset: -14.0,
			AutoResize: true,
			ReqTimeoutMS: 30000
		},
		HelperOptions
	); //_SGH.Options
	_SGH.Grid = false;
	_SGH.GridID = GridID;
	_SGH.ModKey = ModKey;
	_SGH.GridOptions = GridOptions || {};
	_SGH.GridOptions.explicitInitialization = true;
	_SGH.GridOptions.rowHeight = _SGH.GridOptions.rowHeight || 25;
	_SGH.GridOptions.headerRowHeight = _SGH.GridOptions.headerRowHeight || ((_SGH.GridOptions.rowHeight / 25) * 16);
	_SGH.Columns = [];
	_SGH.Rows = [];
	_SGH.RowKeyField = '';
	_SGH.GroupItemMetadataProvider = false;
	_SGH.defaultGrpBy = [];
	_SGH.Aggregators = [];
	_SGH.Menu = false;
	_SGH.AftGridLoadDataCallback = AftGridLoadDataCallback;
	_SGH.AftGridInitCallback = AftGridInitCallback;
	_SGH.PreInitCallback = PreInitCallback;
	_SGH.GroupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
	_SGH.DataView = new Slick.Data.DataView({
		groupItemMetadataProvider: _SGH.GroupItemMetadataProvider,
		inlineFilters: true
	});
	_SGH.getGrid = function () { return _SGH.Grid; };
	_SGH.getMenu = function () { return _SGH.Menu; };
	_SGH.getDataView = function () { return _SGH.DataView; };
	_SGH.getAggregators = function () { return _SGH.Aggregators; };
	_SGH.getColumns = function () { return _SGH.Columns; };
	_SGH.getRows = function () { return _SGH.Rows; };
	_SGH.setRows = function (RowData) {
		if (_SGH._ProcessTbl(RowData) > 0) { _SGH.refreshUI() }
	};
	_SGH.refreshUI = function () {
		if (_SGH.Grid) {
			_SGH.DataView.beginUpdate();
			_SGH.DataView.setItems(_SGH.Rows, _SGH.RowKeyField);
			_SGH.DataView.endUpdate();
			_SGH.Grid.invalidate(); _SGH.Grid.render();
		}
	};
	_SGH.endEditTrySave = function () {
		return Slick.GlobalEditorLock.commitCurrentEdit();
	}
	_SGH.setFilterFn = function (filterFn) {
		return _SGH.DataView.setFilter(filterFn);
	}
	_SGH.resize = function (minheight, minwidth) {
		minheight = (minheight || 80);
		minwidth = (minwidth || 100);
		var G = $(_SGH.GridID),
				h = 0.0,
				w = 0.0;
		var gHOfst = parseFloat(_SGH.Options.GridHeightOffset);
		var gWOfst = parseFloat(_SGH.Options.GridWidthOffset);

		if (_SGH.Options.GridHeight > 0) {
			h = parseFloat(_SGH.Options.GridHeight) + gHOfst;
		}
		else {
			h = parseFloat($(window).height()) - parseFloat(G.offset().top) + gHOfst;
		}

		if (_SGH.Options.GridWidth > 0) {
			w = parseFloat(_SGH.Options.GridWidth) + gWOfst;
		}
		else { w = parseFloat(G.parent().width()) + gWOfst; }
		if ($(window).width() < w) { w = $(window).width(); }
		if (w < minwidth) { w = minwidth };
		if (h < minheight) { h = minheight };
		G.width(w).height(h).css({ 'height': h + 'px', 'width': w + 'px' }).show();
		if (_SGH.Grid) _SGH.Grid.resizeCanvas();
	}
	_SGH.clearGroupByFields = function () { _SGH.DataView.setGrouping([]); };
	_SGH.addGroupByFields = function (fields, names) {
		if (fields) {
			fields = (fields instanceof Array) ? fields : [fields];
			names = names || fields;
			names = (names instanceof Array) ? names : [names];
			var GI = _SGH.DataView.getGrouping() || [];

			for (var i = 0; i < fields.length; i++) {
				var NotSet = true;
				inrloop:
				for (var j = 0; j < GI.length; j++) { //check if already set
					if (GI[j].getter == fields[i]) { NotSet = false; break inrloop; }
				};
				if (NotSet) {
					GI.push({
						getter: fields[i], fldName: names[i],
						formatter: function (g) { return this.fldName + ":  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>"; },
						aggregators: _SGH.Aggregators
					});
				}
			}
			_SGH.DataView.setGrouping(GI);
		}
	};
	_SGH.getSelectedRowsCount = function () {
		return ((_SGH.Grid.getSelectedRows() || []).length || 0);
	};
	_SGH.getSelectedRows = function () {
		return _SGH.Grid.getSelectedRows();
	};
	_SGH.setSelectedRows = function (SelRows) {
		return _SGH.Grid.setSelectedRows(SelRows);
	};

	_SGH.getSelectedRowIDsArr = function () {
		return _SGH.DataView.mapRowsToIds(_SGH.Grid.getSelectedRows());
	};
	_SGH.setSelectedRowIDsArr = function (IDArr) {
		return _SGH.setSelectedRows(_SGH.DataView.mapIdsToRows(IDArr));
	};
	_SGH.addSelectedRowIDsArr = function (IDArr) {
		return _SGH.setSelectedRowIDsArr(_SGH.MergeArrays(_SGH.getSelectedRowIDsArr(), IDArr));
	};
	_SGH.removeSelectedRowIDsArr = function (IDArr) {
		return _SGH.setSelectedRowIDsArr(_SGH.FilterArray(_SGH.getSelectedRowIDsArr(), IDArr))
	};

	_SGH.getSelectedRowIDsStr = function (Delimiter) {
		var __D = (Delimiter || _Delim);
		var r = _SGH.getSelectedRowIDsArr();
		var retVal = '';
		for (var i = 0; i < r.length; i++) {
			if (typeof r[i] != 'undefined') {
				if (i > 0) { retVal += __D }
				retVal += r[i];
			}
		}
		return retVal;
	};
	_SGH.setSelectedRowIDsStr = function (IDStr, Delimiter) { return _SGH.setSelectedRowIDsArr((IDStr || '').split((Delimiter || _Delim))); };
	_SGH.addSelectedRowIDsStr = function (IDStr, Delimiter) { return _SGH.addSelectedRowIDsArr((IDStr || '').split((Delimiter || _Delim))); };
	_SGH.removeSelectedRowIDsStr = function (IDStr, Delimiter) { return _SGH.removeSelectedRowIDsArr((IDStr || '').split((Delimiter || _Delim))); };

	_SGH.MergeArrays = function (arr1, arr2) {
		var hash = {};
		for (var i = 0; i < arr1.length; i++) {
			hash[arr1[i]] = 1;
		}
		for (var i = 0; i < arr2.length; i++) {
			hash[arr2[i]] = 1;
		}
		return Object.keys(hash)
	};
	_SGH.FilterArray = function (src, filt) {
		var temp = {}, i, result = [];
		// load contents of filt into object keys for faster lookup
		for (i = 0; i < filt.length; i++) { temp[filt[i]] = true; }
		// go through src
		for (i = 0; i < src.length; i++) {
			if (!(src[i] in temp)) { result.push(src[i]); }
		}
		return (result);
	}
	_SGH.getModKey = function () { return _SGH.ModKey; };
	_SGH.getRowKeyField = function () { return _SGH.RowKeyField; };
	_SGH._SvrJSON = function (URL, SvrData, EditCmd, JSONOpt) {
		//Post to backend with SvrData then binds return result to grid
		var Opt = $.extend({ "Timeout": (_SGH.Options.ReqTimeoutMS || 30000) }, JSONOpt);
		SvrData = SvrData || {};
		SvrData.ModKey = _SGH.ModKey;
		var jqxhr = $.JSONPost(apiSrc+URL, SvrData, Opt);
		jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
			if (EditCmd) {
				if (Slick.GlobalEditorLock.cancelCurrentEdit()) { EditCmd.undo(); _SGH.Grid.gotoCell(EditCmd.row, EditCmd.cell, false); }
			}
		});
		jqxhr.done(function (data, textStatus, jqXHR) {
			if ((data) && (data.d.RetVal == -1)) {
				data.d.RetMsg = data.d.RetMsg || '';
				if ((_SGH._ProcessTbl(data.d.RetData.Tbl) + _SGH._ProcessDel(data.d.RetData.Del) + _SGH._ProcessUpdIns(data.d.RetData.UpdIns)) > 0) {
					_SGH.refreshUI();
				}
				if (data.d.RetMsg.length > 0) { alert(data.d.RetMsg); }
			} else {
				if (EditCmd) {
					if (Slick.GlobalEditorLock.cancelCurrentEdit()) { EditCmd.undo(); _SGH.Grid.gotoCell(EditCmd.row, EditCmd.cell, false); }
				}
			}
		});
		jqxhr.always(function () { if (_SGH.AftGridLoadDataCallback) { _SGH.AftGridLoadDataCallback(); } });
		return jqxhr;
	};
	//Posts to backend with SvrData then binds return result to grid
	_SGH.GridLoadData = function (SvrData, URL, JSONOpt) { URL = URL || _SGH.Options.GetDataURL; return _SGH._SvrJSON(URL, SvrData, false, JSONOpt); };
	_SGH.GridRowAdd = function (SvrData, URL, JSONOpt) { URL = URL || _SGH.Options.AddRowURL; return _SGH._SvrJSON(URL, SvrData, false, JSONOpt); };
	_SGH.GridRowDel = function (SvrData, URL, JSONOpt) { URL = URL || _SGH.Options.DelRowURL; return _SGH._SvrJSON(URL, SvrData, false, JSONOpt); };
	_SGH.GridRowUpd = function (SvrData, URL, JSONOpt) { URL = URL || _SGH.Options.UpdRowURL; return _SGH._SvrJSON(URL, SvrData, false, JSONOpt); };
	_SGH.GridCustom = function (SvrData, URL, JSONOpt) { URL = URL || _SGH.Options.CustomURL; return _SGH._SvrJSON(URL, SvrData, false, JSONOpt); };
	_SGH.GridExport = function (SvrData, URL) {
		URL = URL || _SGH.Options.ExportURL; SvrData = SvrData || {}; SvrData.ModKey = _SGH.ModKey;
		$.JSONPostNewWindow(URL, SvrData);
	};
	_SGH._ProcessTbl = function (TblRowData) {
		if (TblRowData) { _SGH.Rows = TblRowData.Rows; return 1; }
		return 0;
	};
	_SGH._ProcessDel = function (DelRowData) {
		var DelCnt = 0;
		DelRowData = DelRowData || []; //Remove all matching IDs from _SGH.Rows
		for (var Idx = 0; Idx < DelRowData.length; Idx++) {
			var RowIndex = _SGH._FindRowIdx(DelRowData[Idx]);
			if (RowIndex >= 0) { _SGH.Rows.splice(RowIndex, 1); DelCnt++; }
		}
		return DelCnt;
	};
	_SGH._ProcessUpdIns = function (UpdInsRowData) {
		var UpdInsCnt = 0;
		if (UpdInsRowData) {
			var RowData = UpdInsRowData.Rows || []; //Add or Upd matching IDs into _SGH.Rows
			if (RowData.length > 0) {
				for (var Idx = 0; Idx < RowData.length; Idx++) {
					var RowIndex = _SGH._FindRowIdx(RowData[Idx][_SGH.RowKeyField]);
					if (RowIndex >= 0) { //remove old row and add new row data
						_SGH.Rows.splice(RowIndex, 1, RowData[Idx]);
					} else {
						_SGH.Rows.push(RowData[Idx]);
					}
					UpdInsCnt++;
				}
			}
		}
		return UpdInsCnt;
	};
	_SGH._FindRowIdx = function (RowID) { //Locates row index based on RowID
		if (_SGH.Rows.length > 0) {
			for (var Idx = 0; Idx < _SGH.Rows.length; Idx++) {
				if (_SGH.Rows[Idx][_SGH.RowKeyField] == RowID) { return Idx; }
			}
		}
		return -1;
	};

	_SGH._BindGrid = function () {
		if ((_SGH.Columns.length > 0) && (!_SGH.Grid)) {
			_SGH.Grid = new Slick.Grid(_SGH.GridID, _SGH.DataView, _SGH.Columns, _SGH.GridOptions);
			_SGH.Grid.registerPlugin(_SGH.GroupItemMetadataProvider);
			if (_SGH.defaultGrpBy.length > 0) {
				var flds = [], nms = [];
				for (var i = 0; i < _SGH.defaultGrpBy.length; i++) { flds.push(_SGH.defaultGrpBy[i].field); nms.push(_SGH.defaultGrpBy[i].name); }
				_SGH.addGroupByFields(flds, nms);
			}
			_SGH.Menu = new Slick.Plugins.HeaderMenu({});
			_SGH.Menu.onCommand.subscribe(function (e, args) {
				switch (args.command) {
					case "GrpBy":
						if (args.column.field) { _SGH.addGroupByFields(args.column.field, args.column.name); }
						break;
					case "ClearGrp":
						_SGH.clearGroupByFields();
						break;
				}
			});
			_SGH.Grid.registerPlugin(_SGH.Menu);
			_SGH.Grid.init();
			_SGH.DataView.beginUpdate();
			_SGH.DataView.setItems(_SGH.Rows, _SGH.RowKeyField);
			_SGH.DataView.endUpdate();

			if (_SGH.checkboxSelector) {
				_SGH.Grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
				_SGH.Grid.registerPlugin(_SGH.checkboxSelector);
				_SGH.DataView.syncGridSelection(_SGH.Grid, true);
			}
			if (_SGH.Grid.getOptions().multiColumnSort) {
				_SGH.Grid.onSort.subscribe(function (e, args) {
					var cols = args.sortCols;
					_SGH.DataView.sort(function (dataRow1, dataRow2) {
						for (var i = 0, l = cols.length; i < l; i++) {
							var field = cols[i].sortCol.field, sign = cols[i].sortAsc ? 1 : -1;
							var result = _CompareCols(dataRow1[field], dataRow2[field], cols[i].sortCol, sign);
							if (result != 0) { return result; }
						}
						return 0;
					});
				});
			} else {
				_SGH.Grid.onSort.subscribe(function (e, args) {
					_SGH.DataView.sort(function (dataRow1, dataRow2) {
						var field = args.sortCol.field, sign = args.sortAsc ? 1 : -1;
						return _CompareCols(dataRow1[field], dataRow2[field], args.sortCol, sign);
					});
				});
			}
			//Refresh grid when dataview changes
			_SGH.DataView.onRowCountChanged.subscribe(function (e, args) { _SGH.Grid.updateRowCount(); _SGH.Grid.render(); });
			_SGH.DataView.onRowsChanged.subscribe(function (e, args) { _SGH.Grid.invalidateRows(args.rows); _SGH.Grid.render(); });
			_SGH.Grid.invalidate(); _SGH.Grid.render(); _SGH.resize();
			if (_SGH.AftGridInitCallback) { _SGH.AftGridInitCallback(); }
		}
	};
	function _CompareCols(val1, val2, col, sign) {
		var ST = col.sorttype || "";
		switch (col.sorttype || "") {
			case "date":
				if (col.parsefmt) {
					val1 = moment(val1, col.parsefmt); val2 = moment(val2, col.parsefmt);
				} else {
					val1 = moment(val1); val2 = moment(val2);
				}
				if (val1 && val2) {
					return (val1.isSame(val2) ? 0 : (val1.isAfter(val2) ? 1 : -1)) * sign;
				} else if (!val1 && !val2) {
					return 0;
				} else {
					return ((val1) ? 1 : -1) * sign;
				}
				break;
			case "float":
				val1 = parseFloat(val1); val2 = parseFloat(val2);
				return (val1 == val2 ? 0 : (val1 > val2 ? 1 : -1)) * sign;
				break;
			case "int":
				val1 = parseInt(val1, 10); val2 = parseInt(val2, 10);
				return (val1 == val2 ? 0 : (val1 > val2 ? 1 : -1)) * sign;
				break;
			default:
				return (val1 == val2 ? 0 : (val1 > val2 ? 1 : -1)) * sign;
		}
		return 0;
	};

	//Init grid
	function __Init(Cols, RowKeyField, OthDS, OthSettings) {
		OthSettings = OthSettings || {};
		if (_SGH.PreInitCallback) { _SGH.PreInitCallback(Cols, RowKeyField, OthDS, OthSettings); }
		$.each(OthSettings, function (key, value) {
			key = (key || '').toString().toLowerCase();
			switch (key) {
				case 'addselcolumn':
					_SGH.Options.AddSelColumn = (value != 0); break;
				case 'autoedit':
					_SGH.GridOptions.autoEdit = (value != 0); break;
				case 'rowheight':
					if (value && value > 0) _SGH.GridOptions.rowHeight = value; break;
				case 'headerrowheight':
					if (value && value > 0) _SGH.GridOptions.headerRowHeight = value; break;
				case 'forcefitcolumns':
					_SGH.GridOptions.forceFitColumns = (value != 0); break;
				case 'getdataurl':
					if (value.length > 0) _SGH.Options.GetDataURL = value; break;
				case 'addrowurl':
					if (value.length > 0) _SGH.Options.AddRowURL = value; break;
				case 'delrowurl':
					if (value.length > 0) _SGH.Options.DelRowURL = value; break;
				case 'updrowurl':
					if (value.length > 0) _SGH.Options.UpdRowURL = value; break;
				case 'updrowfldurl':
					if (value.length > 0) _SGH.Options.UpdRowFldURL = value; break;
				case 'customurl':
					if (value.length > 0) _SGH.Options.CustomURL = value; break;
				case 'exporturl':
					if (value.length > 0) _SGH.Options.ExportURL = value; break;
				case 'reqtimeoutms':
					if (value && value > 0) _SGH.Options.ReqTimeoutMS = value; break;
				default:
					console.log("unhandled key:" + key + " value:" + value);
			}
		});
		_SGH.Columns = Cols;
		_SGH.RowKeyField = RowKeyField;
		_SGH.GridOptions.__OthDS = OthDS || {};
		var iOS = Utils.iOS();
		for (var i = 0; i < _SGH.Columns.length; i++) {
			if (iOS) { //iOS Hack, Set maxWidth to width
				var _w = parseFloat(_SGH.Columns[i].width);
				if (_SGH.Columns[i].hasOwnProperty('minWidth')) {
					var _mw = parseFloat(_SGH.Columns[i].minWidth);
					if ((_mw > 0) && ($(window).width() <= 500)) _w = (_w + _mw) / 2;
					_SGH.Columns[i].minWidth = _w;
				}
				if (_SGH.Columns[i].hasOwnProperty('maxWidth')) {
					_SGH.Columns[i].maxWidth = _w;
				}
			}
			//We can use typeof as the string will never be defined as new String();
			//If formatter / editor / validator is defined, we convert from a string to a function pointer.
			if (typeof _SGH.Columns[i].formatter === 'string') {
				_SGH.Columns[i].formatter = eval(_SGH.Columns[i].formatter);
			};
			if (typeof _SGH.Columns[i].editor === 'string') {
				_SGH.Columns[i].editor = eval(_SGH.Columns[i].editor);
			};
			if (typeof _SGH.Columns[i].validator === 'string') {
				_SGH.Columns[i].validator = eval(_SGH.Columns[i].validator);
			};
			if (typeof _SGH.Columns[i].groupTotalsFormatter === 'string') {
				_SGH.Columns[i].groupTotalsFormatter = eval(_SGH.Columns[i].groupTotalsFormatter);
			};

			switch (_SGH.Columns[i].Aggregate || "") {
				case "Sum":
					_SGH.Aggregators.push(new Slick.Data.Aggregators.Sum(_SGH.Columns[i].field));
					_SGH.Columns[i].groupTotalsFormatter = _SGH.Columns[i].groupTotalsFormatter || _SGH.Columns[i].formatter || Slick.Formatters.Number;
					break;
				case "Avg":
					_SGH.Aggregators.push(new Slick.Data.Aggregators.Avg(_SGH.Columns[i].field));
					_SGH.Columns[i].groupTotalsFormatter = _SGH.Columns[i].groupTotalsFormatter || _SGH.Columns[i].formatter || Slick.Formatters.Number;
					break;
				case "Min":
					_SGH.Aggregators.push(new Slick.Data.Aggregators.Min(_SGH.Columns[i].field));
					_SGH.Columns[i].groupTotalsFormatter = _SGH.Columns[i].groupTotalsFormatter || _SGH.Columns[i].formatter || Slick.Formatters.Number;
					break;
				case "Max":
					_SGH.Aggregators.push(new Slick.Data.Aggregators.Max(_SGH.Columns[i].field));
					_SGH.Columns[i].groupTotalsFormatter = _SGH.Columns[i].groupTotalsFormatter || _SGH.Columns[i].formatter || Slick.Formatters.Number;
					break;
				default: //nothing
			}

			//build group by menu
			if (_SGH.Columns[i].groupable) {
				_SGH.Columns[i].header = {
					menu: {
						items: [{ title: "Group By", command: "GrpBy", tooltip: "Group table data by this column" },
							{ title: "Clear Group By", command: "ClearGrp", tooltip: "Clear all groupings"}]
					}
				};
			} else {
				_SGH.Columns[i].header = {
					menu: {
						items: [{ title: "Clear Group By", command: "ClearGrp", tooltip: "Clear all groupings"}]
					}
				};
			}
			//default Grouping Order
			if (_SGH.Columns[i].defaultGrpOrder) {
				_SGH.defaultGrpBy.push({ Ord: _SGH.Columns[i].defaultGrpOrder, name: _SGH.Columns[i].name, field: _SGH.Columns[i].field })
			}
			if (_SGH.defaultGrpBy && (_SGH.defaultGrpBy.length > 0)) {
				_SGH.defaultGrpBy.sort(function (a, b) {
					return ((a.Ord > b.Ord) ? 1 : -1);
				});
			}
		}
		if (_SGH.Options.AddSelColumn) _SGH.checkboxSelector = new Slick.CheckboxSelectColumn({ cssClass: "slick-cell-checkboxsel" });
		if (_SGH.checkboxSelector) { _SGH.Columns.unshift(_SGH.checkboxSelector.getColumnDefinition()); }
		//auto-bind to field update if _SGH.UpdRowFldURL is provided
		if (_SGH.Options.UpdRowFldURL.length > 0) {
			_SGH._GridRowUpdFld = function (item, column, editCommand) {
				var EC = editCommand; EC.execute();
				var Data = { "RowID": item[_SGH.RowKeyField], "ColID": column.id, "FldName": column.field, "FldVal": editCommand.serializedValue || "" };
				if (column.updrowfldsendall) Data = $.extend(item, Data); //add in all row items
				_SGH._SvrJSON(_SGH.Options.UpdRowFldURL, Data, EC, { DisableOth: _SGH.UpdRowFld_DisableOth }); //in general we don't disable anything on update
			};
			_SGH.GridOptions.editCommandHandler = _SGH.GridOptions.editCommandHandler || _SGH._GridRowUpdFld;
		}
		_SGH._BindGrid();
	}

	if ((_SGH.Options.Columns) && (_SGH.Options.RowKeyField)) {
		__Init(_SGH.Options.Columns, _SGH.Options.RowKeyField, _SGH.Options.OthDS, _SGH.Options.OthSettings);
	} else {
		var jqxhrInit = $.JSONPost(apiSrc+"Main1.GetSlickGridConfig.json", { "ModKey": _SGH.ModKey });
		jqxhrInit.fail(function (jqXHR, textStatus, errorThrown) { alert(textStatus); });
		jqxhrInit.done(function (data, textStatus, jqXHR) {
			if ((data) && (data.d.RetVal == -1)) {
				__Init(data.d.RetData.columns, data.d.RetData.RowKeyField, data.d.RetData.OthDS, data.d.RetData.OthSettings);
			} else {
				alert(data.d.RetMsg);
			}
		});
	}

	if (_SGH.Options.AutoResize) {
		var SGHResizeTimer;
		$(window).resize(function () {
			clearTimeout(SGHResizeTimer); SGHResizeTimer = setTimeout(function () { _SGH.resize(); }, 150);
		});
	}
};

var access = false;
var RoleName = '', CurrentPackageID = 0;

$(function () {

    $("#newUserForm #role").change(function () {
        if ($("#newUserForm #role option:selected").text() == 'Clients') {
            $("#newUserForm #contactPoint").show();
        } else {
            $("#newUserForm #contactPoint").hide();
        }
    });
    $("#packageAddForm #type").change(function () {
        var val = $("#packageAddForm #type option:selected").val(),Product=$('#packageAddForm #product').val();
        var data = { 'RoleID': $('#packageAddForm #organisation').val() ,'Product':Product}
        return $.ajax({
            url: apiSrc + "BCMain/FL1.GetPackageExpiryDate.json",
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
                    if (!data.d.RetData.Tbl.Rows[0] && val == 'AssurancePlus') {
                        alert('You must have valid product license before purchasing Assurance Plus.'); return;
                    }
                    else {
                        if (val == 'AssurancePlus' && data.d.RetData.Tbl.Rows[0].ExpiryDate) {
                            $('#packageAddForm #packageExpiryDate').val(data.d.RetData.Tbl.Rows[0].ExpiryDate);
                            $('#packageAddForm #packageExpiryDate').attr('disabled', 'disabled');
                        }
                        else if (data.d.RetData.Tbl.Rows[0].ExpiryDate && val != 'AssurancePlus') {
                            $('#packageAddForm #packageExpiryDate').val(data.d.RetData.Tbl.Rows[0].ExpiryDate);
                            $('#packageAddForm #packageExpiryDate').removeAttr('disabled');
                        }
                    }
                }
                else {
                    alert(data.d.RetMsg);
                }
            },
            error: function (data) {
                alert("Error: " + data.responseJSON.d.RetMsg);
            }
        });
        // if ($("#newUserForm #type option:selected").val()=='AssurancePlus'){
        //
        // }else{
        //
        // }
    });
    $("#newUserForm #postalCode").blur(function () {
        var postalCode = $("#newUserForm #postalCode").val();
        if (postalCode.length > 0) {
            GetAddressFromPostalCode(postalCode);
        }
    });
    $("#packageAddForm #assurancePlus").change(function () {
        if ($("#packageAddForm #assurancePlus").is(':checked')) {
            $("#packageAddForm #assurancePlusNo").show();
        } else {
            $("#packageAddForm #assurancePlusNo").val("");
            $("#packageAddForm #assurancePlusNo").hide();
        }
    });

    getOrgnaisationList();
    getStaffList();

    var getRoleTags =
    $.ajax({
        url: apiSrc + "BCMain/iCtc1.getRoleTags.json",
        method: "POST",
        dataType: "json",
        xhrFields: { withCredentials: true },
        data: {
            'data': JSON.stringify({}),
            'WebPartKey': WebPartVal,
            'ReqGUID': getGUID()
        },
        success: function (data) {
            if ((data) && (data.d.RetVal === -1)) {
                if (data.d.RetData.Tbl.Rows.length > 0) {
                    $('#newUserForm #role,#newPersonForm #role').append('<option value="">-- Please Select --</option>');
                    var roleTagList = data.d.RetData.Tbl.Rows;
                    for (var i = 0; i < roleTagList.length; i++) {
                        $('#newUserForm #role,#newPersonForm #role').append('<option value="' + roleTagList[i].TagName + '">' + roleTagList[i].RoleName + '</option>');
                    }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });



    var checkRoleAccess =
      $.ajax({
          url: apiSrc + "BCMain/iCtc1.CheckRoleAccess.json",
          method: "POST",
          dataType: "json",
          xhrFields: { withCredentials: true },
          data: {
              'data': JSON.stringify({}),
              'WebPartKey': WebPartVal,
              'ReqGUID': getGUID()
          },
          success: function (data) {
              if ((data) && (data.d.RetVal === -1)) {
                  if (data.d.RetData.Tbl.Rows.length > 0) {
                      RoleName = data.d.RetData.Tbl.Rows[0].RoleName;
                  }
              }
              else {
                  alert(data.d.RetMsg);
              }
          },
          error: function (data) {
              alert("Error: " + data.responseJSON.d.RetMsg);
          }
      });

    GetCountry();
    $.when(checkRoleAccess, getOrgnaisationList()).then(function (x) {
        GetCaseFilter();
        if (RoleName == 'Admin' || RoleName == 'Security Admin') {
            $('.adminView').show();
            $('.clientView').show();
            $('#caseContainer').hide();
            getUsersList();
            getPersonUsersList();
            getProductOwn();
        } else if (RoleName == 'Clients') {
            $('.clientView').show();
            $('#CreatCasecategory').hide();
            getProductOwn();
            getCasesList();
        } else if (RoleName == 'Support Developer') {
            $('.developerView').show();
            $('#packageContainer').show();
            getCasesList();
        } else if (RoleName == 'Support Team Lead') {
            $('.teamLeadView').show();
            $('#packageContainer').show();
            getCasesList();
        } else if (RoleName == 'Sales') {
            $('.salesView').show();
            getCasesList();
        } else {
            $('.clientView, .teamLeadView, .developerView, .salesView, .adminView').show();
        }
        getOrgProductList($('#caseAddForm #organisation').val());
    });

    $("#caseAddForm #organisation").change(function () {
        getOrgProductList($('#caseAddForm #organisation').val());
    });
    //Add New Case
    $('#caseAddForm #submit').click(function () {
        createNewCase();
    });
    $('#caseFilter .tabBoxButtonSubmit').click(function () {
        Cookies.set('Organization_cookie', $('#caseFilter #organisation').val() || '');
        Cookies.set('Status_cookie', $('#caseFilter #status').val() || '');
        Cookies.set('Subject_cookie', $('#caseFilter #subject').val() || '');
        Cookies.set('Category_cookie', $('#caseFilter #category').val() || '');
        Cookies.set('Product_cookie', $('#caseFilter #product').val() || '');
        Cookies.set('Involvement_cookie', $('#caseFilter #person').val() || '');
        Cookies.set('DateFrom_cookie', $('#caseFilter #dateCreatedFrom').val() || '');
        Cookies.set('DateTo_cookie', $('#caseFilter #dateCreatedTo').val() || '');
        getCasesList();
    });

    $('#caseFilter #ResetToDefault').click(function () {
        ClearCaseFilter();
    });
    $('#exportCase').click(function () {
        exportCase();
    });
    $('#exportpackage').click(function () {
        exportpackage();
    });
    $('#exportOrganisation').click(function () {
        exportPersonuser('O');
    });
    $('#exportPersonuser').click(function () {
        exportPersonuser('I');
    });
    $('#PersonuserFilter .tabBoxButtonSubmit').click(function () {
        getPersonUsersList();
    });

    $('#userFilter .tabBoxButtonSubmit').click(function () {
        getUsersList();
    });

    $('#packageFilter .tabBoxButtonSubmit').click(function () {
        getProductOwn();
    });
    $('#packageAddForm #submit').click(function () {
        addNewPackage();
    });
    $('#newUserForm #submit').click(function () {
        addNewUser('O');
    });
    $('#newPersonForm #submit').click(function () {
        addNewPerson('I');
    });

    $('#packageUpdateForm #submit').click(function () {
        SaveEditPackage();
    });
});
function ClearCaseFilter() {
    $('#caseFilter #organisation').val('');
    $('#caseFilter #status').val('Open');
    $('#caseFilter #subject').val('');
    $('#caseFilter #category').val('');
    $('#caseFilter #product').val('');
    $('#caseFilter #person').val('');
    $('#caseFilter #dateCreatedFrom').val('');
    $('#caseFilter #dateCreatedTo').val('');
}

function GetCaseFilter() {
    var Organization_cookie = Cookies.getJSON('Organization_cookie'), Status_cookie = Cookies.getJSON('Status_cookie'),
        Subject_cookie = Cookies.getJSON('Subject_cookie'), Category_cookie = Cookies.getJSON('Category_cookie'),
        Product_cookie = Cookies.getJSON('Product_cookie'), Involvement_cookie = Cookies.getJSON('Involvement_cookie'),
        DateFrom_cookie = Cookies.getJSON('DateFrom_cookie'),
        DateTo_cookie = Cookies.getJSON('DateTo_cookie');

        if (Organization_cookie != 'undefined') {
            $('#caseFilterForm #organisation').val(Organization_cookie);
        }
        if (Status_cookie == '') {
            $('#caseFilterForm #status').val('');
        } else {
            $('#caseFilterForm #status').val(Status_cookie || 'Open');
        }
        if (Subject_cookie != 'undefined') {
            $('#caseFilterForm #subject').val(Subject_cookie);
        }
        if (Category_cookie != 'undefined') {
            $('#caseFilterForm #category').val(Category_cookie);
        }
        if (Product_cookie != 'undefined') {
            $('#caseFilterForm #product').val(Product_cookie);
        }
        if (Involvement_cookie != 'undefined') {
            $('#caseFilterForm #person').val(Involvement_cookie);
        }
        if (DateFrom_cookie != 'undefined') {
            $('#caseFilterForm #dateCreatedFrom').val(DateFrom_cookie);
        }
        if (DateTo_cookie != 'undefined') {
            $('#caseFilterForm #dateCreatedTo').val(DateTo_cookie);
        }

}
//get case list
function getCasesList() {
    var caseContainerTable = $('#caseContainer').find('table'),
        caseThead = caseContainerTable.find('thead'),
        caseTbody = caseContainerTable.find('tbody');

    var Organization, Status, Subject, Category, DateFrom, DateTo, product, person;
    Organization = $('#caseFilter #organisation').val();
    Status = $('#caseFilter #status').val();
    Subject = $('#caseFilter #subject').val();
    Category = $('#caseFilter #category').val();
    DateFrom = $('#caseFilter #dateCreatedFrom').val();
    DateTo = $('#caseFilter #dateCreatedTo').val();
    product = $('#caseFilter #product').val();
    person = $('#caseFilter #person').val();
    var data = { 'Organization': Organization, 'Status': Status, 'Subject': Subject, 'Category': Category, 'DateFrom': DateFrom, 'DateTo': DateTo, 'Product': product, 'Person': person };
    //if (RoleName=='Clients'){
    //caseThead.html('<tr><th colspan="2">Subject</th><th>Type</th><th>Created Date</th><th>Status</th></tr>');
    //}
    caseTbody.html('');
    $.ajax({
        url: apiSrc + "BCMain/FL1.GetCasesList.json",
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
                    var cases = data.d.RetData.Tbl.Rows;
                    var htmlString = '';
                    for (var i = 0; i < cases.length; i++) {
                        var createdDate = convertDateTime(cases[i].CreatedDate, 'date');
                        htmlString += '<tr id="' + cases[i].FLID + '" onclick=window.location.href="./case.html?caseID=' + cases[i].FLID + '&FileID=' + cases[i].FileID + '">';
                        //color code
                        var status = cases[i].Status;
                        var re = /\bOpen\b/;
                        if (re.test(status) == true) {
                            htmlString += '<td class="colorCodeActive"></td>';
                        } else {
                            htmlString += '<td class="colorCodeNonActive"></td>';
                        }

                        var StartDate = convertDateTime(cases[i].StartDate, 'date');
                        var ExpiryDate = convertDateTime(cases[i].ExpiryDate, 'date');
                        htmlString += '<td>' + cases[i].FLID + '</td>';
                        htmlString += '<td>' + cases[i].Subject + '</td>';

                        htmlString += '<td>' + cases[i].Product + '</td>';
                        htmlString += '<td>' + cases[i].Category + '</td>';
                        htmlString += '<td>' + cases[i].PriorityLevel + '</td>';
                        htmlString += '<td>' + cases[i].DisplayName + '</td>';
                        htmlString += '<td>' + createdDate + '</td>';
                        htmlString += '<td>' + StartDate + '</td>';
                        htmlString += '<td>' + ExpiryDate + '</td>';
                        htmlString += '<td><span class="statusNew">' + cases[i].Status + '</span></td> ';
                        htmlString += '<td>' + cases[i].Involvement + '</td></tr>';

                    }
                    caseTbody.html(htmlString);
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
};

function exportCase() {
    var Organization, Status, Subject, Category, DateFrom, DateTo;
    Organization = $('#caseFilter #organisation').val();
    Status = $('#caseFilter #status').val();
    Subject = $('#caseFilter #subject').val();
    Category = $('#caseFilter #category').val();
    DateFrom = $('#caseFilter #dateCreatedFrom').val();
    DateTo = $('#caseFilter #dateCreatedTo').val();

    var data = { 'Organization': Organization, 'Status': Status, 'Subject': Subject, 'Category': Category, 'DateFrom': DateFrom, 'DateTo': DateTo };
    var Opt = $.extend({ Target: '_blank' }, '');
    var $d = $("<input type='hidden' name='data'/>").val(JSON.stringify(data));
    var $wpk = $("<input type='hidden' name='WebPartKey'/>").val(WebPartVal);
    var $form = $("<form method='POST' style='display:none;'/>").appendTo(document.body);
    $form.html("").attr("action", apiSrc + "BCMain/FL1.ExportCasesList.part").attr("target", Opt.Target).append($d).append($wpk).submit().remove();
};

function exportpackage() {
    var organization = $('#packageFilter #organisation').val();
    var data = { 'Organization': organization };
    var Opt = $.extend({ Target: '_blank' }, '');
    var $d = $("<input type='hidden' name='data'/>").val(JSON.stringify(data));
    var $wpk = $("<input type='hidden' name='WebPartKey'/>").val(WebPartVal);
    var $form = $("<form method='POST' style='display:none;'/>").appendTo(document.body);
    $form.html("").attr("action", apiSrc + "BCMain/FL1.ExportPackageList.part").attr("target", Opt.Target).append($d).append($wpk).submit().remove();
};
function exportPersonuser(EntityType) {
    var name, entityKey, contactNo, email, Organization;
    name = $('#userFilter #name').val();
    entityKey = $('#userFilter #entityKey').val();
    contactNo = $('#userFilter #contactNo').val();
    email = $('#userFilter #email').val();
    Organization = $('#caseFilter #organisation').val();
    var data = { 'Organization': Organization, 'name': name, 'entityKey': entityKey, 'contactNo': contactNo, 'email': email, 'EntityType': EntityType };
    var Opt = $.extend({ Target: '_blank' }, '');
    var $d = $("<input type='hidden' name='data'/>").val(JSON.stringify(data));
    var $wpk = $("<input type='hidden' name='WebPartKey'/>").val(WebPartVal);
    var $form = $("<form method='POST' style='display:none;'/>").appendTo(document.body);
    $form.html("").attr("action", apiSrc + "BCMain/FL1.ExportPersonUserList.part").attr("target", Opt.Target).append($d).append($wpk).submit().remove();
};

function getUsersList() {
    var userContainerTable = $('#userContainer').find('table'),
        userThead = userContainerTable.find('thead'),
        userTbody = userContainerTable.find('tbody');

    var name, entityKey, contactNo, email;
    name = $('#userFilter #name').val();
    entityKey = $('#userFilter #entityKey').val();
    contactNo = $('#userFilter #contactNo').val();
    email = $('#userFilter #email').val();

    var data = { 'name': name, 'entityKey': entityKey, 'contactNo': contactNo, 'email': email, 'EntityType': 'O' };
    userTbody.html('');
    $.ajax({
        url: apiSrc + "BCMain/Ctc1.GetUsersList.json",
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
                    var users = data.d.RetData.Tbl.Rows;
                    var htmlString = '';
                    for (var i = 0; i < users.length; i++) {
                        htmlString += '<tr id="' + users[i].PersonID + '">';
                        htmlString += '<td>' + users[i].DisplayName + '</td>';
                        htmlString += '<td>' + users[i].EntityKey + '</td>';
                        htmlString += '<td>' + users[i].ContactNo + '</td>';
                        htmlString += '<td>' + users[i].Email1 + '</td>';
                        htmlString += '<td>' + users[i].FullAddress + '</td> </tr>';
                    }
                    userTbody.html(htmlString);
                    $('.userTable tbody tr').click(function () {
                        var personID = $(this).attr('id'),
                            profileUrl = './profile.html?personID=' + personID
                        window.location.href = profileUrl;
                    });
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
};


function getPersonUsersList() {
    var PersonUserContainerTable = $('#PersonuserContainer').find('table'),
        PersonUserThead = PersonUserContainerTable.find('thead'),
        PersonUserTbody = PersonUserContainerTable.find('tbody');

    var name, entityKey, contactNo, email;
    name = $('#PersonuserFilter #name').val();
    entityKey = $('#PersonuserFilter #entityKey').val();
    contactNo = $('#PersonuserFilter #contactNo').val();
    email = $('#PersonuserFilter #email').val();

    var data = { 'name': name, 'entityKey': entityKey, 'contactNo': contactNo, 'email': email, 'EntityType': 'I' };
    PersonUserTbody.html('');
    $.ajax({
        url: apiSrc + "BCMain/Ctc1.GetUsersList.json",
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
                    var users = data.d.RetData.Tbl.Rows;
                    var htmlString = '';
                    for (var i = 0; i < users.length; i++) {
                        htmlString += '<tr id="' + users[i].PersonID + '">';
                        htmlString += '<td>' + users[i].DisplayName + '</td>';
                        htmlString += '<td>' + users[i].EntityKey + '</td>';
                        htmlString += '<td>' + users[i].ContactNo + '</td>';
                        htmlString += '<td>' + users[i].Email1 + '</td>';
                        htmlString += '<td>' + users[i].FullAddress + '</td> </tr>';
                    }
                    PersonUserTbody.html(htmlString);
                    $('.PersonuserTable tbody tr').click(function () {
                        var personID = $(this).attr('id'),
                            profileUrl = './profile.html?personID=' + personID
                        window.location.href = profileUrl;
                    });
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
};
//Create new case
function createNewCase() {
    var Organization, ContactPerson, Email, Contact, Subject, Product, Category, Details, PriorityLevel;
    Organization = $('#caseAddForm #organisation').val();
    ContactPerson = $('#caseAddForm #name').val();
    Email = $('#caseAddForm #email').val();
    Contact = $('#caseAddForm #contact').val();
    Subject = $('#caseAddForm #title').val();
    Product = $('#caseAddForm #product').val();
    Category = $('#caseAddForm #category').val();
    PriorityLevel = $('#caseAddForm #PriorityLevel').val();
    Details = $('#caseAddForm #description').val();
    if (Organization.length == 0 || ContactPerson.length == 0 || Email.length == 0 || Contact.length == 0 || Subject.length == 0 || Details.length == 0 || Product.length == 0 || PriorityLevel.length == 0) {
        alert('Please fill in all mandatory fields!');
        return false;
    }
    if (IsValidEmail(Email) == false) {
        alert('Invalid email!');
        return false;
    }
    if (IsValidContact(Contact) == false) {
        alert('Invalid contact!');
        return false;
    }

    var data = { 'Organization': Organization, 'ContactPerson': ContactPerson, 'Email': Email, 'ContactNo': Contact, 'Subject': Subject, 'Category': Category, 'Details': Details, 'Product': Product, 'PriorityLevel': PriorityLevel };
    $.ajax({
        url: apiSrc + "BCMain/FL1.AddNewCase.json",
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
                        $('#caseAddForm #organisation').val('');
                        $('#caseAddForm #name').val('');
                        $('#caseAddForm #email').val('');
                        $('#caseAddForm #contact').val('');
                        $('#caseAddForm #title').val('');
                        $('#caseAddForm #product').val('');
                        $('#caseAddForm #category').val('');
                        $('#caseAddForm #PriorityLevel').val('');
                        $('#caseAddForm #description').val('');
                        $('#caseAddForm').foundation('close');
                        getCasesList();
                    } else {
                        alert(data.d.RetData.Tbl.Rows[0].ReturnMsg);
                    }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
};

function getProductOwn() {
    var productContainerTable = $('#packageContainer').find('table'),
        productThead = productContainerTable.find('thead'),
        productTbody = productContainerTable.find('tbody');
    var organization = $('#packageFilter #organisation').val();
    var data = { 'organization': organization };
    productTbody.html('');

    $.ajax({
        url: apiSrc + "BCMain/Ctc1.GetProductOwn.json",
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
                    var products = data.d.RetData.Tbl.Rows;
                    var htmlString = '';
                    var hmtlHref = ''
                    for (var i = 0; i < products.length; i++) {
                        var expiryDate = convertDateTime(products[i].ExpiryDate, 'date');
                        //  if (RoleName == 'Clients' || RoleName == 'Admin' || RoleName == 'Security Admin') {
                        htmlString += '<tr id="' + products[i].Product + '">';
                        //  } else {
                        //  htmlString += '<tr id="' + products[i].Product + '" data-open="caseAddForm">';
                        //}
                        if (products[i].PackageType == 'Maintenance') {
                            htmlString += "<td><a href='#' onclick=EditPackageItem(" + products[i].PackageID + ") >Edit</a></td>";
                            hmtlHref = 'https://portal.bizcube.com.sg/BizCubeSoftwareMaintenance_Support.pdf';
                        } else if (products[i].PackageType == 'Assurance') {
                            htmlString += "<td><a href='#' onclick=EditPackageItem(" + products[i].PackageID + ") >Edit</a></td>";
                            hmtlHref = 'https://portal.bizcube.com.sg/BizCubeSoftwareAssurance.pdf';
                        } else if (products[i].PackageType == 'AssurancePlus') {
                            htmlString += "<td></td>";
                            hmtlHref = 'https://portal.bizcube.com.sg/BizCubeAssurancePlus.pdf';
                        } else {
                            htmlString += "<td></td>";
                        }

                        htmlString += '<td>' + products[i].Product + '</td>';
                        htmlString += "<td><a href=" + hmtlHref + " target='_blank'>" + products[i].PackageDesc + "</a></td>";
                        htmlString += '<td>' + expiryDate + '</td>';
                        htmlString += '<td>' + products[i].AssuranceNo + '</td>';
                        htmlString += '<td>' + products[i].ManHoursBought + '</td>';
                        htmlString += '<td>' + products[i].ManHoursUsed + '</td>';
                        htmlString += '<td>' + products[i].ManHoursLeft + '</td>';
                        htmlString += '</tr>';
                    }
                }
                productTbody.html(htmlString);
                if (RoleName == 'Admin' || RoleName == 'Security Admin' || RoleName == 'Support Developer' || RoleName == 'Support Team Lead') {
                    $('.packageTable tr').find('th:eq(0)').show(); $('.packageTable tr').find('td:eq(0)').show();
                } else {
                    $('.packageTable tr').find('th:eq(0)').hide(); $('.packageTable tr').find('td:eq(0)').hide();
                }

                $('.packageTable tbody tr').click(function () {
                    var Product = $(this).attr('id');
                    $('#caseAddForm #product').val(Product);
                });

            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
};

function getOrgProductList(Organization) {
    $('#caseAddForm #product').html('');
    $('#caseAddForm #product').append('<option value="">-- Please Select --</option>');
    var data = { 'Organization': Organization };
    $.ajax({
        url: apiSrc + "BCMain/iCtc1.getOrgProductList.json",
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
                    var productList = data.d.RetData.Tbl.Rows;
                    for (var i = 0; i < productList.length; i++) {
                        $('#caseAddForm #product').append('<option value="' + productList[i].Product + '">' + productList[i].Product + '</option>');
                    }
                    if (productList.length == 1) {
                        $('#caseAddForm #product').val(productList[0].Product);
                    }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}


function addNewPackage() {
    var RoleID, PackageType, Product, StartDate, ExpiryDate, AssurancePlus, NoAssPlus, Quantity, Remarks;
    RoleID = $('#packageAddForm #organisation').val();
    Product = $('#packageAddForm #product').val();
    PackageType = $('#packageAddForm #type').val();
    StartDate = $('#packageAddForm #packageStartDate').val();
    ExpiryDate = $('#packageAddForm #packageExpiryDate').val();
    Quantity = $('#packageAddForm #quantity').val();
    if ($("#packageAddForm #assurancePlus").is(':checked')) {
        AssurancePlus = 1;
    } else {
        AssurancePlus = 0;
    }
    Remarks = $('#packageAddForm #remarks').val();
    Quantity = parseInt(Quantity);

    if (RoleID.length == 0 || PackageType.length == 0 || Product.length == 0 || StartDate.length == 0 || ExpiryDate.length == 0) {
        alert('Please fill in all mandatory fields!');
        return false;
    }
    if (isNaN(Quantity)) {
        alert('Please fill in Quantity fields!');
        return false;
    }
    //NoAssPlus = $('#packageAddForm #assurancePlusNo').val() * 5 * 8;
    NoAssPlus = Quantity * 5 * 8;
    var data = { 'RoleID': RoleID, 'PackageType': PackageType, 'Product': Product, 'StartDate': StartDate, 'ExpiryDate': ExpiryDate, 'Remarks': Remarks, 'AssurancePlus': AssurancePlus, 'NoAssPlus': NoAssPlus, 'Quantity': Quantity };
    $.ajax({
        url: apiSrc + "BCMain/Ctc1.AddNewPackage.json",
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
                        clearPackageForm();
                        alert('Package added successfully!');
                        getProductOwn();
                        $('#packageAddForm').foundation('close');
                    } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function addNewUser(NRICType) {
    var displayName, entityKey, mobile, email, country, postalCode, city, state, block, street, unit, building, role = '', poc1Name,
    poc1Contact, poc1Email, poc1Designation, poc1Department, poc2Name, poc2Contact, poc2Email, poc2Designation, poc2Department, Username = '', Password = '';
    displayName = $('#newUserForm #displayName').val();
    entityKey = $('#newUserForm #entityKey').val();
    mobile = $('#newUserForm #contact').val();
    email = $('#newUserForm #email').val();
    country = $('#newUserForm #country').val();
    postalCode = $('#newUserForm #postalCode').val();
    city = $('#newUserForm #city').val();
    state = $('#newUserForm #state').val();
    block = $('#newUserForm #blockNo').val();
    street = $('#newUserForm #street').val();
    unit = $('#newUserForm #unitNo').val();
    building = $('#newUserForm #building').val();
    //role = $('#newUserForm #role').val();
    role = 'Group.2 (Clients)';
    poc1Name = $('#newUserForm #poc1Name').val();
    poc1Contact = $('#newUserForm #poc1Contact').val();
    poc1Email = $('#newUserForm #poc1Email').val();
    poc1Designation = $('#newUserForm #poc1Designation').val();
    poc1Department = $('#newUserForm #poc1Department').val();
    poc2Name = $('#newUserForm #poc2Name').val();
    poc2Contact = $('#newUserForm #poc2Contact').val();
    poc2Email = $('#newUserForm #poc2Email').val();
    poc2Designation = $('#newUserForm #poc2Designation').val();
    poc2Department = $('#newUserForm #poc2Department').val();
    Username = $('#newUserForm #Username').val();
    Password = $('#newUserForm #Password').val();

    if (displayName == '' || entityKey == '' || mobile == '' || email == '' || Username == '' || Password == '') {
        alert('Please fill in all mandatory fields!');
        return false;
    }
    if (!IsValidContact(mobile)) {
        alert('Contact No is not in correct format, please check!');
        return false;
    } if (!IsValidEmail(email)) {
        alert('Email is not in correct format, please check!');
        return false;
    }

    var data = { 'NRICType':NRICType,'displayName': displayName, 'entityKey': entityKey, 'mobile': mobile, 'email': email, 'country': country, 'postalCode': postalCode, 'city': city, 'state': state, 'block': block, 'street': street, 'unit': unit, 'building': building, 'role': role, 'poc1Name': poc1Name, 'poc1Contact': poc1Contact, 'poc1Email': poc1Email, 'poc1Designation': poc1Designation, 'poc1Department': poc1Department, 'poc2Name': poc2Name, 'poc2Contact': poc2Contact, 'poc2Email': poc2Email, 'poc2Designation': poc2Designation, 'poc2Department': poc2Department, 'Username': Username, 'UserPassword': Password };

    $.ajax({
        url: apiSrc + "BCMain/iCtc1.AddNewUser1.json",
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
                        clearUserForm();
                        alert('New Origanisation added successfully!');
                        $('#newUserForm').foundation('close');
                        getUsersList();
                        getOrgnaisationList();
                    } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function addNewPerson(NRICType) {
    var displayName = '', entityKey = '', mobile = '', email = '', country = '', postalCode = '', city = '', state = '', block = '', street = '', unit = '',
    building = '', role = '0', poc1Name = '', poc1Contact = '', poc1Email = '', poc1Designation = '', poc1Department = '', poc2Name = '', poc2Contact = '',
    poc2Email = '', poc2Designation = '', poc2Department = '', Username = '', Password = '';
    displayName = $('#newPersonForm #displayName').val();
    entityKey = $('#newPersonForm #entityKey').val();
    mobile = $('#newPersonForm #contact').val();
    email = $('#newPersonForm #email').val();
    Username = $('#newPersonForm #Username').val();
    Password = $('#newPersonForm #Password').val();
    if (displayName == '' || entityKey == '' || mobile == '' || email == '' || role == '' || Username == '' || Password == '') {
        alert('Please fill in all mandatory fields!');
        return false;
    }
    if (!IsValidContact(mobile)) {
        alert('Contact No is not in correct format, please check!');
        return false;
    } if (!IsValidEmail(email)) {
        alert('Email is not in correct format, please check!');
        return false;
    }

    var data = { 'NRICType':NRICType,'displayName': displayName, 'entityKey': entityKey, 'mobile': mobile, 'email': email, 'country': country, 'postalCode': postalCode, 'city': city, 'state': state, 'block': block, 'street': street, 'unit': unit, 'building': building, 'role': role, 'poc1Name': poc1Name, 'poc1Contact': poc1Contact, 'poc1Email': poc1Email, 'poc1Designation': poc1Designation, 'poc1Department': poc1Department, 'poc2Name': poc2Name, 'poc2Contact': poc2Contact, 'poc2Email': poc2Email, 'poc2Designation': poc2Designation, 'poc2Department': poc2Department, 'Username': Username, 'UserPassword': Password };

    $.ajax({
        url: apiSrc + "BCMain/iCtc1.AddNewUser1.json",
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
                        clearPersonUserForm();
                        alert('New Person added successfully!');
                        $('#newPersonForm').foundation('close');
                        getPersonUsersList();
                    } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}
function IsValidContact(contactno) {
    var re = /^[6389]\d{7}$/;
    return re.test(contactno);
}

function IsValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//convert date to dd/mm/yyyy
function convertDateTime(inputFormat, type) {
    if (inputFormat == null) {
        return '-';
    };
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    if (type == 'date') {
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    } else if (type == 'datetime') {
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    } else if (type == 'time') {
        return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    }
};

function clearPackageForm() {
    RoleID = $('#packageAddForm #organisation').val('');
    Product = $('#packageAddForm #product').val('');
    PackageType = $('#packageAddForm #type').val('');
    StartDate = $('#packageAddForm #packageStartDate').val('');
    ExpiryDate = $('#packageAddForm #packageExpiryDate').val('');
    NoAssPlus = $('#packageAddForm #assurancePlusNo').val('');
    Remarks = $('#packageAddForm #remarks').val('');
}

function clearUserForm() {
    firstName = $('#newUserForm #firstName').val('');
    displayName = $('#newUserForm #displayName').val('');
    lastName = $('#newUserForm #lastName').val('');
    entityKey = $('#newUserForm #entityKey').val('');
    mobile = $('#newUserForm #contact').val('');
    email = $('#newUserForm #email').val('');
    country = $('#newUserForm #country').val('');
    postalCode = $('#newUserForm #postalCode').val('');
    city = $('#newUserForm #city').val('');
    state = $('#newUserForm #state').val('');
    block = $('#newUserForm #blockNo').val('');
    street = $('#newUserForm #street').val('');
    unit = $('#newUserForm #unitNo').val('');
    building = $('#newUserForm #building').val('');
    role = $('#newUserForm #role').val('');
    poc1Name = $('#newUserForm #poc1Name').val('');
    poc1Contact = $('#newUserForm #poc1Contact').val('');
    poc1Email = $('#newUserForm #poc1Email').val('');
    poc1Designation = $('#newUserForm #poc1Designation').val('');
    poc1Department = $('#newUserForm #poc1Department').val('');
    poc2Name = $('#newUserForm #poc2Name').val('');
    poc2Contact = $('#newUserForm #poc2Contact').val('');
    poc2Email = $('#newUserForm #poc2Email').val('');
    poc2Designation = $('#newUserForm #poc2Designation').val('');
    poc2Department = $('#newUserForm #poc2Department').val('');

    poc2Designation = $('#newUserForm #Username').val('');
    poc2Department = $('#newUserForm #Password').val('');
}
function clearPersonUserForm() {
    displayName = $('#newPersonForm #displayName').val('');
    entityKey = $('#newPersonForm #entityKey').val('');
    mobile = $('#newPersonForm #contact').val('');
    email = $('#newPersonForm #email').val('');
    Username = $('#newPersonForm #Username').val('');
    Password = $('#newPersonForm #Password').val('');
    role = $('#newPersonForm #role').val('');
}
function clearCaseForm() {
    var length = $('#caseAddForm #organisation > option').length;
    if (length > 1) {
        Organization = $('#caseAddForm #organisation').val('');
    }
    ContactPerson = $('#caseAddForm #name').val('');
    Email = $('#caseAddForm #email').val('');
    Contact = $('#caseAddForm #contact').val('');
    Subject = $('#caseAddForm #title').val('');
    Product = $('#caseAddForm #product').val('');
    Category = $('#caseAddForm #category').val('');
    Details = $('#caseAddForm #description').val('');
}

function getGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

function GetCountry() {
    $('#newUserForm #country').html('');
    $('#newUserForm #country').append('<option value="">-- Please Select --</option>');
    var data = { 'LookupCat': 'Countries' };
    return $.ajax({
        url: apiSrc + "BCMain/iCtc1.GetLookupVal.json",
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
                    var productList = data.d.RetData.Tbl.Rows;
                    for (var i = 0; i < productList.length; i++) {
                        $('#newUserForm #country').append('<option value="' + productList[i].Description + '">' + productList[i].Description + '</option>');
                    }
                    if (productList.length > 0) {
                        $('#newUserForm #country').val('Singapore');

                    }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function GetAddressFromPostalCode(PostalCode) {

    var data = { 'Country': 'Singapore', 'PostalCode': PostalCode };
    $.ajax({
        url: apiSrc + "BCMain/iCtc1.GetAddressFromPostalCode.json",
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

                var obj = new Object();
                obj = $.parseJSON(data.d.RetData);
                $('#newUserForm #blockNo').val(obj.AddrP1 || '');
                $('#newUserForm #unitNo').val(obj.AddrP2 || '')
                ; $('#newUserForm #building').val(obj.AddrP4 || '');
                $('#newUserForm #street').val(obj.AddrP3 || '');

            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function getOrgnaisationList() {
    $.ajax({
        url: apiSrc + "BCMain/iCtc1.getOrgnaisationList.json",
        method: "POST",
        dataType: "json",
        xhrFields: { withCredentials: true },
        data: {
            'data': JSON.stringify({}),
            'WebPartKey': WebPartVal,
            'ReqGUID': getGUID()
        },
        success: function (data) {
            if ((data) && (data.d.RetVal === -1)) {
                $('#caseAddForm #organisation, #caseFilter #organisation, #packageAddForm #organisation,#packageFilter #organisation,#packageUpdateForm #EditOrganisation').html('');
                $('#caseFilter #organisation').html('');
                if (data.d.RetData.Tbl.Rows.length == 1) {
                    var org = data.d.RetData.Tbl.Rows[0];
                    $('#caseAddForm #organisation, #caseFilter #organisation, #packageAddForm #organisation,#packageFilter #organisation,#packageUpdateForm #EditOrganisation').append('<option value="' + org.DefaultRoleID + '" selected>' + org.DisplayName + '</option>');
                } else if (data.d.RetData.Tbl.Rows.length > 0) {
                    $('#caseAddForm #organisation, #packageAddForm #organisation,#packageFilter #organisation,#packageUpdateForm #EditOrganisation').append('<option value="">-- Please Select --</option>');
                    $('#caseFilter #organisation').append('<option value="">-- All --</option>');
                    var orgList = data.d.RetData.Tbl.Rows;
                    for (var i = 0; i < orgList.length; i++) {
                        $('#caseAddForm #organisation, #caseFilter #organisation, #packageAddForm #organisation,#packageFilter #organisation,#packageUpdateForm #EditOrganisation').append('<option value="' + orgList[i].DefaultRoleID + '">' + orgList[i].DisplayName + '</option>');
                    }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function getStaffList() {
    $('#caseFilterForm #person').html('<option value="">-- Please Select --</option>');
    var html = '';
    var data = {};
    $.ajax({
        url: apiSrc + "BCMain/iCtc1.GetStaffList.json",
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
                    var staffList = data.d.RetData.Tbl.Rows;
                    for (var i = 0; i < staffList.length; i++) {
                        html += ('<option value="' + staffList[i].RoleID + '">' + staffList[i].StaffDetails + '</option>');
                    }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
            $('#caseFilterForm #person').append(html);
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function EditPackageItem(PackageID) {
    $('#packageUpdateForm').foundation('open');
    $.when(getOrgnaisationList()).then(function () {
        GetPackageEntity(PackageID);
    });
};

function GetPackageEntity(PackageID) {
    CurrentPackageID = PackageID;
    $('#packageUpdateForm #EditOrganisation').attr('disabled', 'disabled');
    $('#packageUpdateForm #EditQuantity').attr('readonly', 'readonly');
    return $.ajax({
        url: apiSrc + "BCMain/Ctc1.GetPackageEntity.json",
        method: "POST",
        dataType: "json",
        xhrFields: { withCredentials: true },
        data: {
            'data': JSON.stringify({ 'PackageID': PackageID }),
            'WebPartKey': WebPartVal,
            'ReqGUID': getGUID()
        },
        success: function (data) {
            if ((data) && (data.d.RetVal === -1)) {
                if (data.d.RetData.Tbl.Rows.length > 0) {
                    var PackageItem = data.d.RetData.Tbl.Rows[0];
                    $('#packageUpdateForm #EditOrganisation').val(PackageItem.RoleID);
                    $('#packageUpdateForm #EditProduct').val(PackageItem.Product);
                    $('#packageUpdateForm #EditType').val(PackageItem.PackageType);
                    $('#packageUpdateForm #EditQuantity').val(PackageItem.Quantity);
                    $('#packageUpdateForm #EditPackageStartDate').val(data.d.RetData.Tbl.Rows[0].StartDate);
                    $('#packageUpdateForm #EditPackageExpiryDate').val(data.d.RetData.Tbl.Rows[0].ExpiryDate);
                    $('#packageUpdateForm #EidtRemarks').val(PackageItem.Remarks);
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function SaveEditPackage() {
    var RoleID, PackageType, Product, StartDate, ExpiryDate, NoAssPlus, Quantity, Remarks;
    RoleID = $('#packageUpdateForm #EditOrganisation').val();
    Product = $('#packageUpdateForm #EditProduct').val();
    PackageType = $('#packageUpdateForm #EditType').val();
    StartDate = $('#packageUpdateForm #EditPackageStartDate').val();
    ExpiryDate = $('#packageUpdateForm #EditPackageExpiryDate').val();
    Quantity = $('#packageUpdateForm #EditQuantity').val();
    Remarks = $('#packageUpdateForm #EidtRemarks').val();
    Quantity = parseInt(Quantity);

    if (RoleID.length == 0 || PackageType.length == 0 || Product.length == 0 || StartDate.length == 0 || ExpiryDate.length == 0) {
        alert('Please fill in all mandatory fields!');
        return false;
    }
    if (isNaN(Quantity)) {
        alert('Please fill in Quantity fields!');
        return false;
    }

    NoAssPlus = Quantity * 5 * 8;
    var data = { 'PackageID': CurrentPackageID, 'RoleID': RoleID, 'PackageType': PackageType, 'Product': Product, 'StartDate': StartDate, 'ExpiryDate': ExpiryDate, 'Remarks': Remarks, 'NoAssPlus': NoAssPlus, 'Quantity': Quantity };
    return $.ajax({
        url: apiSrc + "BCMain/Ctc1.UpdatePackage.json",
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
                        getProductOwn();
                        alert('Package Updated successfully!');

                        $('#packageUpdateForm').foundation('close');
                        clearEditPackageForm();
                    } else { alert(data.d.RetData.Tbl.Rows[0].ReturnMsg); }
                }
            }
            else {
                alert(data.d.RetMsg);
            }
        },
        error: function (data) {
            alert("Error: " + data.responseJSON.d.RetMsg);
        }
    });
}

function clearEditPackageForm() {
    $('#packageUpdateForm #EditOrganisation').val('');
    $('#packageUpdateForm #EditProduct').val('');
    $('#packageUpdateForm #EditType').val('');
    $('#packageUpdateForm #EditPackageStartDate').val('');
    $('#packageUpdateForm #EditPackageExpiryDate').val('');
    $('#packageUpdateForm #EidtRemarks').val('');
}

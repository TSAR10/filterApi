let currentDate; // will be used to save the current Date
let ajaxData;
let dataTable; // Table that will display all the holidays
let isFiltered = false;

$(async function()
{
	currentDate = filterData(0); // setting the current date

	let data = await axios.get("https://www.gov.uk/bank-holidays.json"); // getting data from api

	let holidayData = data.data;
	let dataSet = new Array();

	for(let index in holidayData)
	{
		dataSet = [...dataSet, ...holidayData[index].events]; // all data is stored in array
	}

	ajaxData = dataSet;

	// Initilizing datatable
	dataTable = $("#dataTable").DataTable(
		{
			data: dataSet,
			columns:
			[
				{ data : "title" },
				{ data : "date" },
				{ data : "notes" },
				{ data : "bunting" }
			]
		}
	);
});

// on selecting different filter this dunction will be called
$(document).on("change", "#filterDropdown", function()
{
	let selectedVal = +$("#filterDropdown").val();

	switch(selectedVal)
	{
		// yesterday
		case 2:
			{
				let selectedDate = filterData(1);
				filterDataTable(selectedDate, currentDate);
				break;
			}
		// last week from now
		case 3:
			{
				let selectedDate = filterData(7);
				filterDataTable(selectedDate, currentDate);
				break;
			}
		// last month from now
		case 4:
			{
				let selectedDate = filterData(30);
				filterDataTable(selectedDate, currentDate);
				break;
			}
		// custom dates
		case 5:
			{
				$("#startDate").prop("disabled", false);
				$("#endDate").prop("disabled", false);
				$("#filterBtn").prop("disabled", false);
				break;
			}
		default:
			{
				$("#startDate").prop("disabled", true);
				$("#endDate").prop("disabled", true);
				$("#filterBtn").prop("disabled", true);
				break;
			}
	}
});

// getting filter dates
function filterData(days = null)
{
	let date = new Date();

	if(days !== null)
	{
		date = date.setDate(date.getDate() - days);
		date = new Date(date);
	}

	let month = '' + (date.getMonth() + 1);
	let day = '' + date.getDate();
	let year = date.getFullYear();

	let formattedDate = year + "-" + month + "-" + day;

	return formattedDate;
}

// filtering the datatable
filterDataTable = (startDate, endDate) =>
{
	$("#startDate").prop("disabled", true);
	$("#endDate").prop("disabled", true);
	$("#filterBtn").prop("disabled", true);

	if(isFiltered)
	{
		$.fn.dataTableExt.afnFiltering.pop();
	}

	let startDateObj = new Date(startDate);
	let endDateObj = new Date(endDate);

	$.fn.dataTableExt.afnFiltering.push
	(
        function (oSettings, aData, iDataIndex)
		{
            let value = aData[1];
			let dateValueObj = new Date(value);

			if(dateValueObj >= startDateObj && dateValueObj <= endDateObj)
			{
				return true;
			}
			else
			{
				return false;
			}
        }
    );

	isFiltered = true;

	dataTable.draw();
}

// for custom dates filter
$("#filterBtn").on("click", function(event)
{
	event.preventDefault();

	let customStartDate = $("#startDate").val();
	let customEndDate = $("#endDate").val();

	filterDataTable(customStartDate, customEndDate);
})
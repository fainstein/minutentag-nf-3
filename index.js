let completeList = []; // Raw list from API
let renderedList = []; // Mutating array, related to UI
let currentPage = 0; // 0 indexed

$(document).ready(() => {
  showLoading();
  fetchList();
});

const fetchList = () => {
  $.ajax({
    url: "https://api.wazirx.com/sapi/v1/tickers/24hr",
    error: () => {
      hideLoading();
      $("#table-container").replaceWith(
        `<p class="error-message">No results available. Please try again</p>`
      );
    },
    success: (response) => {
      completeList = response;
      renderedList = [...completeList];
      hideLoading();
      populateTable();
    },
  });
};

/**
 * Fills the table in the UI with requested data and enables/disables pagination
 */
const populateTable = () => {
  // Fill table rows with array data
  let html = "";
  for (let {
    symbol,
    baseAsset,
    openPrice,
    lowPrice,
    highPrice,
    lastPrice,
    volume,
  } of renderedList.slice(10 * currentPage, 10 * (currentPage + 1))) {
    html +=
      "<tr><th scope='row'>" +
      symbol.toUpperCase() +
      "</th><td>" +
      baseAsset.toUpperCase() +
      "</td><td>" +
      openPrice +
      "</td><td>" +
      lowPrice +
      "</td><td>" +
      highPrice +
      "</td><td>" +
      lastPrice +
      "</td><td>" +
      volume +
      "</td></tr>";
  }
  $("tbody").replaceWith(`<tbody>${html}</tbody>`);

  // Enable/Disable next button based on total pagination
  if (renderedList.length <= 10) {
    $("#next-nav").addClass("disabled-link");
  } else {
    $("#next-nav").removeClass("disabled-link");
  }

  // Enable/Disable Pagination buttons based on current page
  if (currentPage === Math.ceil(renderedList.length / 10) - 1) {
    $("#next-nav").addClass("disabled-link");
  } else if (currentPage === 0) {
    $("#prev-nav").addClass("disabled-link");
  }
};

/**
 * Change Event Handler for Search Text input
 */
$("#search").on("input", (event) => {
  currentPage = 0;
  $("#openPrice").val("none");
  $("#baseAsset").val("none");
  $("#prev-nav").addClass("disabled-link");
  renderedList = completeList.filter((token) =>
    token.baseAsset.includes(event.target.value.toLowerCase())
  );
  populateTable();
});

/**
 * Change Event Handler for Open Price Select Input
 */
$("#openPrice").change((event) => {
  currentPage = 0;
  renderedList = renderedList.sort((a, b) => {
    if (event.target.value === "asc") {
      return a.openPrice - b.openPrice; // low to high
    } else if (event.target.value === "desc") {
      return b.openPrice - a.openPrice; // high to low
    }
  });
  populateTable();
});

/**
 * Change Event Handler for Base Asset Select Input
 */
$("#baseAsset").change((event) => {
  currentPage = 0;
  renderedList = renderedList.sort((a, b) => {
    if (event.target.value === "asc") {
      return a.baseAsset.localeCompare(b.baseAsset); // A to Z
    } else if (event.target.value === "desc") {
      return b.baseAsset.localeCompare(a.baseAsset); // Z to A
    }
  });
  populateTable();
});

/**
 * Click Event Handler "Prev" button
 */
$("#prev-nav").click(() => {
  currentPage--;
  $("#next-nav").removeClass("disabled-link");
  populateTable();
});

/**
 * Click Event Handler "Next" button
 */
$("#next-nav").click(() => {
  currentPage++;
  $("#prev-nav").removeClass("disabled-link");
  populateTable();
});

const showLoading = () => {
  $("#table-container").hide();
  $("#loading-div").show();
};

const hideLoading = () => {
  $("#loading-div").hide();
  $("#table-container").show();
};

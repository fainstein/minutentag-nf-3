let completeListToRender = [];
let currentPage = 0; // 0 indexed

$(document).ready(() => {
  showLoading();
  fetchList();
});

const fetchList = () => {
  $.ajax({
    url: "https://api.wazirx.com/sapi/v1/tickers/24hr",
  }).done((response) => {
    completeListToRender = response;
    hideLoading();
    populateTable();
  });
};

const populateTable = () => {
  let html = "";
  for (let {
    symbol,
    baseAsset,
    openPrice,
    lowPrice,
    highPrice,
    lastPrice,
    volume,
  } of completeListToRender.slice(10 * currentPage, 10 * (currentPage + 1))) {
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
};

$("#prev-nav").click(() => {
  if (currentPage === 1) {
    $("#prev-nav").addClass("disabled-link");
  }
  $("#next-nav").removeClass("disabled-link");
  currentPage--;
  populateTable();
});

$("#next-nav").click(() => {
  if (currentPage === Math.ceil(completeListToRender.length / 10) - 2) {
    $("#next-nav").addClass("disabled-link");
  }
  $("#prev-nav").removeClass("disabled-link");
  currentPage++;
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

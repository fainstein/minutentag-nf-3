let completeList = [];
let renderedList = [];
let currentPage = 0; // 0 indexed

$(document).ready(() => {
  showLoading();
  fetchList();
});

const fetchList = () => {
  $.ajax({
    url: "https://api.wazirx.com/sapi/v1/tickers/24hr",
  }).done((response) => {
    completeList = response;
    renderedList = completeList;
    hideLoading();
    populateTable();
  });
};

const populateTable = (list = renderedList) => {
  let html = "";
  for (let {
    symbol,
    baseAsset,
    openPrice,
    lowPrice,
    highPrice,
    lastPrice,
    volume,
  } of list.slice(10 * currentPage, 10 * (currentPage + 1))) {
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

$("#search").on("input", (event) => {
  currentPage = 0;
  $("#openPrice").val("none");
  $("#baseAsset").val("none");
  $("#prev-nav").addClass("disabled-link");
  if (event.target.value === "") {
    renderedList = completeList;
    populateTable();
    return;
  }
  renderedList = completeList.filter((token) =>
    token.baseAsset.includes(event.target.value)
  );
  if (renderedList.length <= 10) {
    $("#next-nav").addClass("disabled-link");
  } else {
    $("#next-nav").removeClass("disabled-link");
  }
  populateTable();
});

$("#openPrice").change((event) => {
  currentPage = 0;
  $("#baseAsset").val("none");
  $("#search").val("");
  if (event.target.value === "asc") {
    renderedList = completeList.sort((a, b) => a.openPrice - b.openPrice);
  } else if (event.target.value === "desc") {
    renderedList = completeList.sort((a, b) => b.openPrice - a.openPrice);
  }
  populateTable();
});

$("#baseAsset").change((event) => {
  currentPage = 0;
  $("#openPrice").val("none");
  $("#search").val("");
  if (event.target.value === "asc") {
    renderedList = completeList.sort((a, b) =>
      a.baseAsset.localeCompare(b.baseAsset)
    );
  } else if (event.target.value === "desc") {
    renderedList = completeList.sort((a, b) =>
      b.baseAsset.localeCompare(a.baseAsset)
    );
  }
  populateTable();
});

$("#prev-nav").click(() => {
  if (currentPage === 1) {
    $("#prev-nav").addClass("disabled-link");
  }
  $("#next-nav").removeClass("disabled-link");
  currentPage--;
  populateTable();
});

$("#next-nav").click(() => {
  if (currentPage === Math.ceil(renderedList.length / 10) - 2) {
    console.log("HEY!");
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

$(document).ready(() => {
  showLoading();
  fetchRequestedData();
});

const fetchRequestedData = (
  isAlphabetic = null,
  isLowToHigh = null,
  searchQuery = null
) => {
  $.ajax({
    url: "https://api.wazirx.com/sapi/v1/tickers/24hr",
  }).done((response) => {
    const data = response.slice(0, 10);
    hideLoading();
    console.log(data);
    var html = "";
    for (let {
      symbol,
      baseAsset,
      openPrice,
      lowPrice,
      highPrice,
      lastPrice,
      volume,
    } of data) {
      html =
        "<tr><th scope='row'>" +
        symbol +
        "</th><td>" +
        baseAsset +
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
      $("tbody tr").first().after(html);
    }
  });
};

const showLoading = () => {
  $("table").hide();
  $("#loadingDiv").show();
};

const hideLoading = () => {
  $("#loadingDiv").hide();
  $("table").show();
};

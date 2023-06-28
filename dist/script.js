// API URLS
const kAPI =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const mAPI =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const vAPI =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

// GET API DATA THROUGH ASYNC FUNCTION
async function getAPIs(kAPI, mAPI, vAPI) {
  // STORE RESPONSES
  const kResponse = await fetch(kAPI);
  const mResponse = await fetch(mAPI);
  const vResponse = await fetch(vAPI);

  // STORE DATA IN THE FORM OF JSON
  var kData = await kResponse.json();
  var mData = await mResponse.json();
  var vData = await vResponse.json();

  renderData(kData, mData, vData);
}

function renderData(kJSON, mJSON, vJSON) {
  console.log("In renderData()...");

  const kDataset = kJSON;
  const mDataset = mJSON;
  const vDataset = vJSON;

  // SVG WIDTH, HEIGHT, AND PADDING
  const w = 1200;
  const h = 580;
  const padding = 20;

  // CREATE SVGS AND BUTTONS
  // SHOW AND HIDE SVGs ON CLICK
  function showK() {
    console.log("Showing kSVG.");

    d3.select("#kSVG").style("display", "block");
    d3.select("#mSVG").style("display", "none");
    d3.select("#vSVG").style("display", "none");
    d3.select("#kLegend").style("display", "block");
    d3.select("#mLegend").style("display", "none");
    d3.select("#vLegend").style("display", "none");
  }

  function showM() {
    console.log("Showing mSVG.");

    d3.select("#mSVG").style("display", "block");
    d3.select("#kSVG").style("display", "none");
    d3.select("#vSVG").style("display", "none");
    d3.select("#mLegend").style("display", "block");
    d3.select("#kLegend").style("display", "none");
    d3.select("#vLegend").style("display", "none");
  }

  function showV() {
    console.log("Showing vSVG.");

    d3.select("#vSVG").style("display", "block");
    d3.select("#kSVG").style("display", "none");
    d3.select("#mSVG").style("display", "none");
    d3.select("#vLegend").style("display", "block");
    d3.select("#kLegend").style("display", "none");
    d3.select("#mLegend").style("display", "none");
  }

  const kSVG = d3.
  select("#graphics-box").
  append("svg").
  attr("id", "kSVG").
  attr("width", w).
  attr("height", h).
  style("display", "block");

  const mSVG = d3.
  select("#graphics-box").
  append("svg").
  attr("id", "mSVG").
  attr("width", w).
  attr("height", h).
  style("display", "none");

  const vSVG = d3.
  select("#graphics-box").
  append("svg").
  attr("id", "vSVG").
  attr("width", w).
  attr("height", h).
  style("display", "none");

  // ADD TILES TO SVGs AND CREATE TOOLTIP
  // CREATE TOOLTIP
  d3.select("#overlay").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  style("visibility", "hidden").
  append("text").
  attr("id", "line1Line");
  d3.select("#tooltip").append("text").attr("id", "line2Line");
  d3.select("#tooltip").append("text").attr("id", "line3Line");

  // FOR CATEGORY COLORS
  function getCategories(someDataset) {
    const categoryList = [];
    someDataset.children.map(function (element) {
      if (!categoryList.includes(element)) {
        categoryList.push(element.children[0].category);
      }
    });
    return categoryList;
  }

  const colorList = [
  "#ff598f",
  "#fd8a5e",
  "#e0e300",
  "#01dddd",
  "#00bfaf",
  "#8fff59",
  "#5efd8a",
  "#00e0e3",
  "#dddd01",
  "#598fff",
  "#8a5efd",
  "#ff9bbb",
  "#fd9c77",
  "#ecee66",
  "#80eeee",
  "#7fdfd7",
  "#fdda5e",
  "#aee8fe",
  "#e0e300"];


  // PROVIDE DATA TO CLUSTER LAYOUT
  // K
  const kRoot = d3.hierarchy(kDataset).sum(function (d) {
    return d.value;
  });

  d3.treemap().size([w, h]).padding(2)(kRoot);

  // GET CATEGORY NAMES FOR COLORS
  const kCategories = getCategories(kDataset);

  // M
  const mRoot = d3.hierarchy(mDataset).sum(function (d) {
    return d.value;
  });

  d3.treemap().size([w, h]).padding(2)(mRoot);

  // GET CATEGORY NAMES FOR COLORS
  const mCategories = getCategories(mDataset);

  // V
  const vRoot = d3.hierarchy(vDataset).sum(function (d) {
    return d.value;
  });

  d3.treemap().size([w, h]).padding(2)(vRoot);

  // GET CATEGORY NAMES FOR COLORS
  const vCategories = getCategories(vDataset);

  // USE DATA TO ADD RECTANGLES TO THE SVGS
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = w - margin.left - margin.right;
  const height = h - margin.top - margin.bottom;

  // K
  kSVG.
  append("svg").
  attr("width", w + margin.left + margin.right).
  attr("height", h + margin.top + margin.bottom).
  append("g").
  attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  kSVG.
  selectAll("rect").
  data(kRoot.leaves()).
  join("rect").
  attr("class", "tile").
  attr("x", function (d) {
    return d.x0;
  }).
  attr("y", function (d) {
    return d.y0;
  }).
  attr("width", function (d) {
    return d.x1 - d.x0;
  }).
  attr("height", function (d) {
    return d.y1 - d.y0;
  }).
  style("fill", d => colorList[kCategories.indexOf(d.data.category)]).
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  on("mouseover", function (e, d) {
    let line1 = "Name: " + d3.select(this).attr("data-name");
    let line2 = "Category: " + d3.select(this).attr("data-category");
    let line3 = "Value: " + d3.select(this).attr("data-value");

    const [x, y] = d3.pointer(e);

    d3.select("#tooltip").
    style("visibility", "visible").
    style("left", e.pageX + 20 + "px").
    style("top", e.pageY - 20 + "px").
    attr("data-value", d3.select(this).attr("data-value"));

    d3.select("#line1Line").text(line1);
    d3.select("#tooltip").select("#line2Line").text(line2);
    d3.select("#tooltip").select("#line3Line").text(line3);
  }).
  on("mouseout", function () {
    d3.select("#tooltip").style("visibility", "hidden");
  });

  // https://stackoverflow.com/questions/44950589/d3-each-index-doesnt-begin-at-0

  kSVG.
  selectAll("g").
  select("null").
  data(kRoot.leaves()).
  enter().
  append("text").
  attr("class", "labelText").
  attr("x", d => d.x0 + 4).
  attr("y", d => d.y0 + 14).
  text(d => d.data.name.slice(0, 4).trim() + (d.data.name.length > 4 ? "..." : ""));

  // M
  mSVG.
  append("svg").
  attr("width", w + margin.left + margin.right).
  attr("height", h + margin.top + margin.bottom).
  append("g").
  attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  mSVG.
  selectAll("rect").
  data(mRoot.leaves()).
  join("rect").
  attr("class", "tile").
  attr("x", function (d) {
    return d.x0;
  }).
  attr("y", function (d) {
    return d.y0;
  }).
  attr("width", function (d) {
    return d.x1 - d.x0;
  }).
  attr("height", function (d) {
    return d.y1 - d.y0;
  }).
  style("fill", d => colorList[mCategories.indexOf(d.data.category)]).
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  on("mouseover", function (e, d) {
    let line1 = "Name: " + d3.select(this).attr("data-name");
    let line2 = "Category: " + d3.select(this).attr("data-category");
    let line3 = "Value: " + d3.select(this).attr("data-value");

    const [x, y] = d3.pointer(e);

    d3.select("#tooltip").
    style("visibility", "visible").
    style("left", e.pageX + 20 + "px").
    style("top", e.pageY - 20 + "px").
    attr("data-value", d3.select(this).attr("data-value"));
    d3.select("#line1Line").text(line1);
    d3.select("#tooltip").select("#line2Line").text(line2);
    d3.select("#tooltip").select("#line3Line").text(line3);
  }).
  on("mouseout", function () {
    d3.select("#tooltip").style("visibility", "hidden");
  });

  mSVG.
  selectAll("g").
  select("null").
  data(mRoot.leaves()).
  enter().
  append("text").
  attr("class", "labelText").
  attr("x", d => d.x0 + 4).
  attr("y", d => d.y0 + 14).
  text(d => d.data.name.slice(0, 4).trim() + (d.data.name.length > 4 ? "..." : ""));

  // V
  vSVG.
  append("svg").
  attr("width", w + margin.left + margin.right).
  attr("height", h + margin.top + margin.bottom).
  append("g").
  attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  vSVG.
  selectAll("rect").

  data(vRoot.leaves()).
  join("rect").
  attr("class", "tile").
  attr("x", function (d) {
    return d.x0;
  }).
  attr("y", function (d) {
    return d.y0;
  }).
  attr("width", function (d) {
    return d.x1 - d.x0;
  }).
  attr("height", function (d) {
    return d.y1 - d.y0;
  }).
  style("fill", d => colorList[vCategories.indexOf(d.data.category)]).
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  on("mouseover", function (e, d) {
    let line1 = "Name: " + d3.select(this).attr("data-name");
    let line2 = "Category: " + d3.select(this).attr("data-category");
    let line3 = "Value: " + d3.select(this).attr("data-value");

    const [x, y] = d3.pointer(e);

    d3.select("#tooltip").
    style("visibility", "visible").
    style("left", e.pageX + 20 + "px").
    style("top", e.pageY - 20 + "px").
    attr("data-value", d3.select(this).attr("data-value"));

    d3.select("#line1Line").text(line1);
    d3.select("#tooltip").select("#line2Line").text(line2);
    d3.select("#tooltip").select("#line3Line").text(line3);
  }).
  on("mouseout", function () {
    d3.select("#tooltip").style("visibility", "hidden");
  });

  vSVG.
  selectAll("g").
  select("null").
  data(vRoot.leaves()).
  enter().
  append("text").
  attr("class", "labelText").
  attr("x", d => d.x0 + 4).
  attr("y", d => d.y0 + 14).
  text(d => d.data.name.slice(0, 4).trim() + (d.data.name.length > 4 ? "..." : ""));

  // BUTTONS...

  const kButton = d3.
  select("#button-row").
  append("button").
  attr("id", "k-button").
  html("Kickstarter Pledges").
  on("click", showK);

  const mButton = d3.
  select("#button-row").
  append("button").
  attr("id", "m-button").
  html("Movie Sales").
  on("click", showM);

  const vButton = d3.
  select("#button-row").
  append("button").
  attr("id", "v-button").
  html("Video Game Sales").
  on("click", showV);

  // LEGEND...

  const legendWidth = 100;
  const legendPadding = 8;

  const legend = d3.
  select("#graphics-box").
  append("div").
  attr("id", "legend").
  attr("width", legendWidth);

  legend.html("<h2>Legend</h2>");

  const kCategoryColors = {};
  const mCategoryColors = {};
  const vCategoryColors = {};

  for (let i = 0; i < kCategories.length; i++) {
    let prop = kCategories[i];
    kCategoryColors[prop] = colorList[i];
  }

  for (let i = 0; i < mCategories.length; i++) {
    let prop = mCategories[i];
    mCategoryColors[prop] = colorList[i];
  }

  for (let i = 0; i < vCategories.length; i++) {
    let prop = vCategories[i];
    vCategoryColors[prop] = colorList[i];
  }

  // K LEGEND
  const kLegend = legend.
  append("svg").
  attr("id", "kLegend").
  attr("height", kCategories.length * 32 + padding).
  attr("width", 600).
  style("display", "none");

  kLegend.
  selectAll("rect").
  data(kCategories).
  enter().
  append("svg").
  append("rect").
  attr("height", 16).
  attr("width", 16).
  attr("x", function (d, i) {
    return legendWidth * 3 / 8 + legendPadding;
  }).
  attr("y", function (d, i) {
    return 6 + i * 32;
  }).
  style("fill", function (d) {
    return kCategoryColors[d];
  }).
  attr("class", "legend-item");

  kLegend.
  selectAll("g").
  data(kCategories).
  enter().
  append("text").
  attr("x", function (d, i) {
    return legendWidth * 2 / 5 + legendPadding + 18;
  }).
  attr("y", function (d, i) {
    return 18 + i * 32;
  }).
  text(d => d);

  // M LEGEND
  const mLegend = legend.
  append("svg").
  attr("id", "mLegend").
  attr("height", mCategories.length * 32 + padding).
  attr("width", 600).
  style("display", "none");

  mLegend.
  selectAll("rect").
  data(mCategories).
  enter().
  append("svg").
  append("rect").
  attr("height", 16).
  attr("width", 16).
  attr("x", function (d, i) {
    return legendWidth * 3 / 8 + legendPadding;
  }).
  attr("y", function (d, i) {
    return 6 + i * 32;
  }).
  style("fill", function (d) {
    return mCategoryColors[d];
  }).
  attr("class", "legend-item");

  mLegend.
  selectAll("g").
  data(mCategories).
  enter().
  append("text").
  attr("x", function (d, i) {
    return legendWidth * 2 / 5 + legendPadding + 18;
  }).
  attr("y", function (d, i) {
    return 18 + i * 32;
  }).
  text(d => d);

  // V LEGEND

  const vLegend = legend.
  append("svg").
  attr("id", "vLegend").
  attr("height", vCategories.length * 32 + padding).
  attr("width", 600).
  style("display", "none");

  vLegend.
  selectAll("rect").
  data(vCategories).
  enter().
  append("svg").
  append("rect").
  attr("height", 16).
  attr("width", 16).
  attr("x", function (d, i) {
    return legendWidth * 3 / 8 + legendPadding;
  }).
  attr("y", function (d, i) {
    return 6 + i * 32;
  }).
  style("fill", function (d) {
    return vCategoryColors[d];
  }).
  attr("class", "legend-item");

  vLegend.
  selectAll("g").
  data(vCategories).
  enter().
  append("text").
  attr("x", function (d, i) {
    return legendWidth * 2 / 5 + legendPadding + 18;
  }).
  attr("y", function (d, i) {
    return 18 + i * 32;
  }).
  text(d => d);

  // SHOW DEFAULT (K DATA)

  showK();
}

getAPIs(kAPI, mAPI, vAPI);
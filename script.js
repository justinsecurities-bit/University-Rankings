function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function scoreFromRank(rank, spread = 0.2) {
  const base = 100 - rank * 0.55;
  return Math.max(45, Math.min(99.5, Number((base + spread).toFixed(1))));
}

function shuffledRanks(seedOffset) {
  const arr = Array.from({ length: 100 }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seeded(i * 71 + seedOffset) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const universitySeeds = [
  ["Massachusetts Institute of Technology", "United States", "North America"],
  ["University of Oxford", "United Kingdom", "Europe"],
  ["Stanford University", "United States", "North America"],
  ["University of Cambridge", "United Kingdom", "Europe"],
  ["Harvard University", "United States", "North America"],
  ["California Institute of Technology", "United States", "North America"],
  ["Princeton University", "United States", "North America"],
  ["Yale University", "United States", "North America"],
  ["Columbia University", "United States", "North America"],
  ["University of Chicago", "United States", "North America"],
  ["University of Pennsylvania", "United States", "North America"],
  ["Cornell University", "United States", "North America"],
  ["Johns Hopkins University", "United States", "North America"],
  ["University of California, Los Angeles", "United States", "North America"],
  ["University of California, Berkeley", "United States", "North America"],
  ["Northwestern University", "United States", "North America"],
  ["Duke University", "United States", "North America"],
  ["University of Michigan", "United States", "North America"],
  ["Carnegie Mellon University", "United States", "North America"],
  ["New York University", "United States", "North America"],
  ["ETH Zurich", "Switzerland", "Europe"],
  ["EPFL", "Switzerland", "Europe"],
  ["Imperial College London", "United Kingdom", "Europe"],
  ["University College London", "United Kingdom", "Europe"],
  ["King's College London", "United Kingdom", "Europe"],
  ["University of Edinburgh", "United Kingdom", "Europe"],
  ["University of Manchester", "United Kingdom", "Europe"],
  ["University of Bristol", "United Kingdom", "Europe"],
  ["University of Glasgow", "United Kingdom", "Europe"],
  ["University of Birmingham", "United Kingdom", "Europe"],
  ["London School of Economics and Political Science", "United Kingdom", "Europe"],
  ["University of Warwick", "United Kingdom", "Europe"],
  ["University of Amsterdam", "Netherlands", "Europe"],
  ["Leiden University", "Netherlands", "Europe"],
  ["Utrecht University", "Netherlands", "Europe"],
  ["Delft University of Technology", "Netherlands", "Europe"],
  ["Erasmus University Rotterdam", "Netherlands", "Europe"],
  ["KU Leuven", "Belgium", "Europe"],
  ["Ghent University", "Belgium", "Europe"],
  ["University of Copenhagen", "Denmark", "Europe"],
  ["Aarhus University", "Denmark", "Europe"],
  ["Lund University", "Sweden", "Europe"],
  ["Uppsala University", "Sweden", "Europe"],
  ["Karolinska Institute", "Sweden", "Europe"],
  ["LMU Munich", "Germany", "Europe"],
  ["Technical University of Munich", "Germany", "Europe"],
  ["Heidelberg University", "Germany", "Europe"],
  ["Humboldt University of Berlin", "Germany", "Europe"],
  ["RWTH Aachen University", "Germany", "Europe"],
  ["Free University of Berlin", "Germany", "Europe"],
  ["Sorbonne University", "France", "Europe"],
  ["PSL University", "France", "Europe"],
  ["Paris-Saclay University", "France", "Europe"],
  ["Ecole Polytechnique", "France", "Europe"],
  ["Aix-Marseille University", "France", "Europe"],
  ["Sapienza University of Rome", "Italy", "Europe"],
  ["University of Bologna", "Italy", "Europe"],
  ["University of Padua", "Italy", "Europe"],
  ["University of Milan", "Italy", "Europe"],
  ["University of Barcelona", "Spain", "Europe"],
  ["Autonomous University of Barcelona", "Spain", "Europe"],
  ["Complutense University of Madrid", "Spain", "Europe"],
  ["Pompeu Fabra University", "Spain", "Europe"],
  ["University of Zurich", "Switzerland", "Europe"],
  ["University of Geneva", "Switzerland", "Europe"],
  ["University of Vienna", "Austria", "Europe"],
  ["TU Wien", "Austria", "Europe"],
  ["Trinity College Dublin", "Ireland", "Europe"],
  ["University College Dublin", "Ireland", "Europe"],
  ["University of Toronto", "Canada", "North America"],
  ["University of British Columbia", "Canada", "North America"],
  ["McGill University", "Canada", "North America"],
  ["McMaster University", "Canada", "North America"],
  ["University of Alberta", "Canada", "North America"],
  ["University of Waterloo", "Canada", "North America"],
  ["University of Montreal", "Canada", "North America"],
  ["University of Sydney", "Australia", "Oceania"],
  ["University of Melbourne", "Australia", "Oceania"],
  ["Australian National University", "Australia", "Oceania"],
  ["UNSW Sydney", "Australia", "Oceania"],
  ["Monash University", "Australia", "Oceania"],
  ["University of Queensland", "Australia", "Oceania"],
  ["University of Auckland", "New Zealand", "Oceania"],
  ["University of Otago", "New Zealand", "Oceania"],
  ["National University of Singapore", "Singapore", "Asia"],
  ["Nanyang Technological University", "Singapore", "Asia"],
  ["Tsinghua University", "China", "Asia"],
  ["Peking University", "China", "Asia"],
  ["Fudan University", "China", "Asia"],
  ["Shanghai Jiao Tong University", "China", "Asia"],
  ["Zhejiang University", "China", "Asia"],
  ["University of Science and Technology of China", "China", "Asia"],
  ["Nanjing University", "China", "Asia"],
  ["University of Tokyo", "Japan", "Asia"],
  ["Kyoto University", "Japan", "Asia"],
  ["Osaka University", "Japan", "Asia"],
  ["Tohoku University", "Japan", "Asia"],
  ["Seoul National University", "South Korea", "Asia"],
  ["KAIST", "South Korea", "Asia"],
  ["Yonsei University", "South Korea", "Asia"],
];

const thePermutation = shuffledRanks(11);
const qsPermutation = shuffledRanks(23);
const arwuPermutation = shuffledRanks(37);

const rankingData = universitySeeds.map(([name, country, region], i) => {
  const theRank = thePermutation[i];
  const qsRank = qsPermutation[i];
  const arwuRank = arwuPermutation[i];
  const theOverall = scoreFromRank(theRank, seeded(i + 1) * 0.25);
  const qsOverall = scoreFromRank(qsRank, seeded(i + 31) * 0.28);
  const arwuOverall = scoreFromRank(arwuRank, seeded(i + 61) * 0.2);
  const avgRank = Number(((theRank + qsRank + arwuRank) / 3).toFixed(1));

  return {
    id: i + 1,
    name,
    country,
    region,
    theRank,
    qsRank,
    arwuRank,
    avgRank,
    rankings: {
      the: {
        rank: theRank,
        overall: theOverall,
        teaching: Number((theOverall - 3 + seeded(i + 3) * 6).toFixed(1)),
        research: Number((theOverall - 2 + seeded(i + 4) * 5).toFixed(1)),
        citations: Number((theOverall - 4 + seeded(i + 5) * 7).toFixed(1)),
        internationalOutlook: Number((theOverall - 5 + seeded(i + 6) * 8).toFixed(1)),
      },
      qs: {
        rank: qsRank,
        overall: qsOverall,
        academicReputation: Number((qsOverall - 2 + seeded(i + 7) * 5).toFixed(1)),
        employerReputation: Number((qsOverall - 3 + seeded(i + 8) * 6).toFixed(1)),
        facultyStudent: Number((qsOverall - 4 + seeded(i + 9) * 7).toFixed(1)),
        citationsPerFaculty: Number((qsOverall - 3 + seeded(i + 10) * 6).toFixed(1)),
        internationalFaculty: Number((qsOverall - 5 + seeded(i + 11) * 9).toFixed(1)),
        internationalStudents: Number((qsOverall - 5 + seeded(i + 12) * 9).toFixed(1)),
      },
      arwu: {
        rank: arwuRank,
        overall: arwuOverall,
        alumni: Number((arwuOverall - 5 + seeded(i + 13) * 10).toFixed(1)),
        award: Number((arwuOverall - 6 + seeded(i + 14) * 10).toFixed(1)),
        hici: Number((arwuOverall - 4 + seeded(i + 15) * 8).toFixed(1)),
        ns: Number((arwuOverall - 3 + seeded(i + 16) * 7).toFixed(1)),
        pub: Number((arwuOverall - 2 + seeded(i + 17) * 5).toFixed(1)),
        pcp: Number((arwuOverall - 4 + seeded(i + 18) * 8).toFixed(1)),
      },
    },
  };
});

const state = {
  search: "",
  country: "",
  region: "",
  view: "all",
  minRank: "",
  maxRank: "",
  sortKey: "avgRank",
  sortDir: "asc",
  page: 1,
  pageSize: 10,
  compareIds: [],
};

const els = {
  search: document.getElementById("search"),
  countryFilter: document.getElementById("country-filter"),
  regionFilter: document.getElementById("region-filter"),
  providerView: document.getElementById("provider-view"),
  rankMin: document.getElementById("rank-min"),
  rankMax: document.getElementById("rank-max"),
  resetBtn: document.getElementById("reset-btn"),
  resultCount: document.getElementById("result-count"),
  tableBody: document.getElementById("table-body"),
  pageInfo: document.getElementById("page-info"),
  prevPage: document.getElementById("prev-page"),
  nextPage: document.getElementById("next-page"),
  compareState: document.getElementById("compare-state"),
  compareBody: document.getElementById("compare-body"),
  compareWrap: document.getElementById("compare-table-wrap"),
  compareClear: document.getElementById("compare-clear"),
  sortableHeaders: Array.from(document.querySelectorAll("th[data-sort]")),
  profileView: document.getElementById("profile-view"),
  profileName: document.getElementById("profile-name"),
  profileMeta: document.getElementById("profile-meta"),
  profileBreakdownBody: document.getElementById("profile-breakdown-body"),
  profileBack: document.getElementById("profile-back"),
};

function uniqueValues(key) {
  return [...new Set(rankingData.map((r) => r[key]))].sort((a, b) => a.localeCompare(b));
}

function initFilters() {
  for (const country of uniqueValues("country")) {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    els.countryFilter.appendChild(opt);
  }
  for (const region of uniqueValues("region")) {
    const opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    els.regionFilter.appendChild(opt);
  }
}

function valueForView(uni) {
  if (state.view === "the") return uni.theRank;
  if (state.view === "qs") return uni.qsRank;
  if (state.view === "arwu") return uni.arwuRank;
  return uni.avgRank;
}

function getFilteredData() {
  return rankingData.filter((uni) => {
    const query = state.search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      uni.name.toLowerCase().includes(query) ||
      uni.country.toLowerCase().includes(query);
    const matchesCountry = !state.country || uni.country === state.country;
    const matchesRegion = !state.region || uni.region === state.region;
    const rankValue = valueForView(uni);
    const min = state.minRank ? Number(state.minRank) : null;
    const max = state.maxRank ? Number(state.maxRank) : null;
    const matchesMin = min === null || rankValue >= min;
    const matchesMax = max === null || rankValue <= max;
    return matchesSearch && matchesCountry && matchesRegion && matchesMin && matchesMax;
  });
}

function sortData(data) {
  return [...data].sort((a, b) => {
    const av = a[state.sortKey];
    const bv = b[state.sortKey];
    if (typeof av === "string") {
      const cmp = av.localeCompare(bv);
      return state.sortDir === "asc" ? cmp : -cmp;
    }
    const cmp = av - bv;
    return state.sortDir === "asc" ? cmp : -cmp;
  });
}

function paginateData(data) {
  const totalPages = Math.max(1, Math.ceil(data.length / state.pageSize));
  if (state.page > totalPages) state.page = totalPages;
  const start = (state.page - 1) * state.pageSize;
  const end = start + state.pageSize;
  return {
    rows: data.slice(start, end),
    totalPages,
  };
}

function rankCell(uni, key) {
  if (state.view === "all") return String(uni[key]);
  if (state.view === "the" && key !== "theRank") return "-";
  if (state.view === "qs" && key !== "qsRank") return "-";
  if (state.view === "arwu" && key !== "arwuRank") return "-";
  return String(uni[key]);
}

function renderTable() {
  const filtered = getFilteredData();
  const sorted = sortData(filtered);
  const { rows, totalPages } = paginateData(sorted);

  els.resultCount.textContent = `${filtered.length} universit${filtered.length === 1 ? "y" : "ies"} found`;
  els.pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
  els.prevPage.disabled = state.page <= 1;
  els.nextPage.disabled = state.page >= totalPages;

  els.tableBody.innerHTML = "";
  for (const uni of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="sticky-col">
        <input type="checkbox" data-id="${uni.id}" ${state.compareIds.includes(uni.id) ? "checked" : ""} />
      </td>
      <td><a href="/university/${uni.id}" data-profile-link="${uni.id}">${uni.name}</a></td>
      <td>${uni.country}</td>
      <td>${uni.region}</td>
      <td>${rankCell(uni, "theRank")}</td>
      <td>${rankCell(uni, "qsRank")}</td>
      <td>${rankCell(uni, "arwuRank")}</td>
      <td>${uni.avgRank}</td>
    `;
    els.tableBody.appendChild(tr);
  }
}

function renderCompare() {
  const selected = rankingData.filter((u) => state.compareIds.includes(u.id));
  if (selected.length < 2) {
    els.compareWrap.classList.add("hidden");
    els.compareState.textContent = "Select at least 2 universities to compare.";
    return;
  }

  els.compareState.textContent = `Comparing ${selected.length} universities`;
  els.compareWrap.classList.remove("hidden");
  els.compareBody.innerHTML = "";
  for (const uni of selected) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${uni.name}</td>
      <td>${uni.country}</td>
      <td>${uni.theRank}</td>
      <td>${uni.qsRank}</td>
      <td>${uni.arwuRank}</td>
      <td>${uni.avgRank}</td>
    `;
    els.compareBody.appendChild(tr);
  }
}

function prettyBreakdown(obj) {
  const entries = Object.entries(obj).filter(([k]) => k !== "rank" && k !== "overall");
  return entries
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => ` ${m}`).replace(/^./, (m) => m.toUpperCase())}: ${value}`)
    .join(" | ");
}

function openProfileById(id, push = true) {
  const uni = rankingData.find((u) => u.id === Number(id));
  if (!uni) return;

  els.profileName.textContent = uni.name;
  els.profileMeta.textContent = `${uni.country} • ${uni.region} • Avg Rank ${uni.avgRank}`;
  els.profileBreakdownBody.innerHTML = `
    <tr>
      <td>THE</td>
      <td>${uni.rankings.the.rank}</td>
      <td>${uni.rankings.the.overall}</td>
      <td>${prettyBreakdown(uni.rankings.the)}</td>
    </tr>
    <tr>
      <td>QS</td>
      <td>${uni.rankings.qs.rank}</td>
      <td>${uni.rankings.qs.overall}</td>
      <td>${prettyBreakdown(uni.rankings.qs)}</td>
    </tr>
    <tr>
      <td>Shanghai Ranking</td>
      <td>${uni.rankings.arwu.rank}</td>
      <td>${uni.rankings.arwu.overall}</td>
      <td>${prettyBreakdown(uni.rankings.arwu)}</td>
    </tr>
  `;
  els.profileView.classList.remove("hidden");
  if (push) window.history.pushState({}, "", `/university/${uni.id}`);
}

function closeProfile(push = true) {
  els.profileView.classList.add("hidden");
  if (push) window.history.pushState({}, "", "/");
}

function handleRoute() {
  const match = window.location.pathname.match(/^\/university\/(\d+)$/);
  if (match) {
    openProfileById(Number(match[1]), false);
  } else {
    closeProfile(false);
  }
}

function render() {
  renderTable();
  renderCompare();
  updateSortIndicators();
}

function updateSortIndicators() {
  for (const th of els.sortableHeaders) {
    const key = th.getAttribute("data-sort");
    th.classList.remove("sort-asc", "sort-desc");
    if (key === state.sortKey) {
      th.classList.add(state.sortDir === "asc" ? "sort-asc" : "sort-desc");
    }
  }
}

function setPage(page) {
  state.page = Math.max(1, page);
  render();
}

function bindEvents() {
  els.search.addEventListener("input", (e) => {
    state.search = e.target.value;
    setPage(1);
  });
  els.countryFilter.addEventListener("change", (e) => {
    state.country = e.target.value;
    setPage(1);
  });
  els.regionFilter.addEventListener("change", (e) => {
    state.region = e.target.value;
    setPage(1);
  });
  els.providerView.addEventListener("change", (e) => {
    state.view = e.target.value;
    setPage(1);
  });
  els.rankMin.addEventListener("input", (e) => {
    state.minRank = e.target.value;
    setPage(1);
  });
  els.rankMax.addEventListener("input", (e) => {
    state.maxRank = e.target.value;
    setPage(1);
  });

  els.prevPage.addEventListener("click", () => setPage(state.page - 1));
  els.nextPage.addEventListener("click", () => setPage(state.page + 1));

  els.resetBtn.addEventListener("click", () => {
    state.search = "";
    state.country = "";
    state.region = "";
    state.view = "all";
    state.minRank = "";
    state.maxRank = "";
    state.page = 1;

    els.search.value = "";
    els.countryFilter.value = "";
    els.regionFilter.value = "";
    els.providerView.value = "all";
    els.rankMin.value = "";
    els.rankMax.value = "";
    render();
  });

  for (const th of els.sortableHeaders) {
    th.addEventListener("click", () => {
      const key = th.getAttribute("data-sort");
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        state.sortDir = "asc";
      }
      render();
    });
  }

  els.tableBody.addEventListener("change", (e) => {
    const target = e.target;
    if (target.tagName !== "INPUT" || target.type !== "checkbox") return;
    const id = Number(target.getAttribute("data-id"));
    if (target.checked) {
      if (state.compareIds.length >= 5) {
        target.checked = false;
        return;
      }
      state.compareIds.push(id);
    } else {
      state.compareIds = state.compareIds.filter((x) => x !== id);
    }
    renderCompare();
  });

  els.tableBody.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-profile-link]");
    if (!link) return;
    e.preventDefault();
    openProfileById(Number(link.getAttribute("data-profile-link")));
  });

  els.compareClear.addEventListener("click", () => {
    state.compareIds = [];
    render();
  });

  els.profileBack.addEventListener("click", () => closeProfile());
  window.addEventListener("popstate", handleRoute);
}

initFilters();
bindEvents();
render();
handleRoute();

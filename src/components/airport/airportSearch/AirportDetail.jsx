import { create } from "zustand";
import airportData from "../../../api/airportListData";

const allPrices = airportData.map((a) => a.price);
const ABS_MIN_PRICE = Math.min(...allPrices);
const ABS_MAX_PRICE = Math.max(...allPrices);
const STEP = 1000;

const airportAliasMap = {
  김포: ["김포", "김포공항", "김포 국제공항", "GMP"],
  인천: [
    "인천",
    "인천공항",
    "인천 국제공항",
    "인천 국제공항 - 터미널 2",
    "ICN",
  ],
  제주: ["제주", "제주공항", "제주 국제공항", "CJU"],
  방콕: ["방콕", "수완나품", "수완나품 국제공항", "BKK"],
  싱가포르: ["싱가포르", "창이", "창이 국제공항", "SIN"],
  다낭: ["다낭", "다낭 국제공항", "DAD"],
  오사카: ["오사카", "간사이 국제공항", "KIX"],
  괌: ["괌", "괌 국제공항", "GUM"],
  후쿠오카: ["후쿠오카", "후쿠오카 국제공항", "FUK"],
  코타키나발루: ["코타키나발루", "코타키나발루 국제공항", "BKI"],
  나트랑: ["나트랑", "깜라인", "나트랑 깜라인 국제공항", "CXR"],
};

const normalizeAirport = (name) => {
  if (!name) return "";
  const lower = name.trim().toLowerCase();
  for (const [key, aliases] of Object.entries(airportAliasMap)) {
    if (aliases.some((alias) => alias.toLowerCase().includes(lower))) {
      return key;
    }
  }
  return lower;
};

const useAirportStore = create((set, get) => ({
  airports: airportData,
  airportDetails: airportData,
  priceMin: ABS_MIN_PRICE,
  priceMax: ABS_MAX_PRICE,
  STEP,

  filters: {
    mode: "roundtrip",
    direct: null,
    airline: [],
    baggage: null,
    priceRange: [ABS_MIN_PRICE, ABS_MAX_PRICE],
    segments: [],
    dates: [],
    people: 1,
    seat: "일반석",
  },

  setFilters: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...patch,
      },
    })),

  setFilter: (patch) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...patch,
      },
    })),

  setPriceRange: (min, max) =>
    set((state) => ({
      filters: {
        ...state.filters,
        priceRange: [min, max],
      },
    })),

  resetFilter: () =>
    set({
      filters: {
        mode: "roundtrip",
        direct: null,
        airline: [],
        baggage: null,
        priceRange: [ABS_MIN_PRICE, ABS_MAX_PRICE],
        segments: [],
        dates: [],
        people: 1,
        seat: "일반석",
      },
    }),

  getAirportById: (id) => get().airports.find((a) => a.id === id),

  // ✅ 메인 검색 필터
  getFilteredAirports: () => {
    const { airports, filters } = get();
    const [minP, maxP] = filters.priceRange;

    return airports.filter((a) => {
      if (a.price < minP || a.price > maxP) return false;
      if (filters.direct !== null && a.direct !== filters.direct) return false;
      if (filters.airline.length > 0 && !filters.airline.includes(a.airline))
        return false;
      if (filters.baggage && a.baggage !== filters.baggage) return false;

      if (filters.segments?.length > 0) {
        const seg = filters.segments[0];
        const userFrom = normalizeAirport(seg.from);
        const userTo = normalizeAirport(seg.to);
        const dataFrom = normalizeAirport(a.departureAirport);
        const dataTo = normalizeAirport(a.arrivalAirport);

        if (userFrom && userFrom !== dataFrom) return false;
        if (userTo && userTo !== dataTo) return false;
      }

      return true;
    });
  },

  // ✅ 상세 검색 필터 (좌석 + 인원 추가됨)
  getFilteredAirportDetails: () => {
    const { airportDetails, filters } = get();
    const [minP, maxP] = filters.priceRange;

    return airportDetails.filter((a) => {
      if (a.price < minP || a.price > maxP) return false;
      if (filters.direct !== null && a.direct !== filters.direct) return false;
      if (filters.airline.length > 0 && !filters.airline.includes(a.airline))
        return false;
      if (filters.baggage && a.baggage !== filters.baggage) return false;

      if (filters.segments?.length > 0) {
        const seg = filters.segments[0];
        const userFrom = normalizeAirport(seg.from);
        const userTo = normalizeAirport(seg.to);
        const dataFrom = normalizeAirport(a.departureAirport);
        const dataTo = normalizeAirport(a.arrivalAirport);

        if (userFrom && userFrom !== dataFrom) return false;
        if (userTo && userTo !== dataTo) return false;
      }

      // ✅ 좌석 및 인원 조건
      if (
        !a.seatAvailability ||
        !a.seatAvailability[filters.seat] ||
        a.seatAvailability[filters.seat] < filters.people
      ) {
        return false;
      }

      return true;
    });
  },
}));

export default useAirportStore;

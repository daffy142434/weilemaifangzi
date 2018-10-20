const map = {
  cn: "中国",
  us: "美国",
  ca: "加拿大",
  jp: "日本",
  uk: "英国",
  de: "德国",
  es: "西班牙",
  fr: "法国",
  it: "意大利",
};
export default function getCountryNameByStationCode(stationCode) {
  return map[stationCode] || '';
};

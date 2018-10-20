export default function getDomainSuffixByStationCode(stationCode) {
  const stationCodeMap = {
    us: 'com',
    mx: 'com.mx',
    uk: 'co.uk',
    jp: 'co.jp'
  }
  const domainSuffix = stationCodeMap[stationCode.toLowerCase()] || stationCode.toLowerCase();
  return domainSuffix;
}

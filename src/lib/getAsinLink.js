import getDomainSuffixByStationCode from '@/lib/getDomainSuffixByStationCode';

export default function getAsinLink(stationCode, asin) {
  const domainSuffix = getDomainSuffixByStationCode(stationCode);
  return `http://www.amazon.${domainSuffix}/dp/${asin}`;
}

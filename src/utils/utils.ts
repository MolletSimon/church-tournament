export const formatTeamName = (t: string) =>
  t
    .replaceAll(' ', '_')
    .replaceAll('(', '_')
    .replaceAll(')', '_')
    .replaceAll('É', 'E');
export const formatTeamNameFullInfos = (t: string) => 
  'fullInfos_' + formatTeamName(t);
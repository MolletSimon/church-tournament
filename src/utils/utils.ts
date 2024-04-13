export const formatTeamName = (t: string) =>
  t.replaceAll(' ', '_').replaceAll('(', '_').replaceAll(')', '_');

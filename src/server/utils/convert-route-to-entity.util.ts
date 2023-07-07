const mapping: Record<string, string> = {
  'life-goals': 'life_goal',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

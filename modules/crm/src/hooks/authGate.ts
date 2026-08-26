export function shouldKeepLoading(loading: boolean, timedOut: boolean) {
  return loading && !timedOut;
}

export function shouldShowOfflineHome(loading: boolean, timedOut: boolean, hasUser: boolean) {
  return timedOut && !loading && !hasUser;
}

interface UtagWindow extends Window {
  utag?: {
    cfg: {
      domain: string,
    },
  },
}

export const getDomain = (window: UtagWindow) => {
  return window.utag?.cfg?.domain ?? window.location.hostname;
};

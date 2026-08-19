export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'legendwebsites.co.uk') {
      url.hostname = 'www.legendwebsites.co.uk';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};

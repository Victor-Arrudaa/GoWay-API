import mcache from 'memory-cache';

const cache = (duration) => {
  return (req, res, next) => {
    const key = 'cache-' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.send(JSON.parse(cachedBody));
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      mcache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};

export default cache;
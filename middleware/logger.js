const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log("----- Incoming Request -----");
  console.log("Time:", timestamp);
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Body:", req.body);
  }

  next();
};

module.exports = logger;
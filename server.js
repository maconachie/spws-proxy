// Libraries
const cors = require("cors");
const express = require("express");
const httpntlm = require("httpntlm");

// Create express App
const app = express();

// Config file
const config = __dirname.includes("node_modules")
  ? require("../../spws.proxy.config")
  : require("./config");

// Middleware
app.use(cors());
app.use(express.text({ type: "text/*" }));

// Routes
app.get("*", forward);
app.post("*", forward);

// Get arguments from command line
const args = process.argv.reduce((object, arg) => {
  if (!arg.includes("=")) return object;
  let [key, value] = arg.split("=");
  object[key] = value;
  return object;
}, {});

function forward(req, res) {
  // Get target url (remove and leading slashes)
  let url = req.url.replace(/^\//, "");

  // Create corect url
  if (!url.toLocaleLowerCase().startsWith("http:/")) url = config.baseUrl + url;

  // Create headers object
  const headers = ["accept", "Content-Type", "soapaction"].reduce(
    (object, header) => {
      // Get header value
      const value = req.get(header);
      // If value is truthy, assign to object
      if (value) object[header] = value;
      // Return object
      return object;
    },
    {}
  );

  // Create payload
  let payload = {
    url,
    headers: { ...headers },
  };

  // If the method is a post request
  if (req.method === "POST") {
    payload.body = req.body;
    res.type("application/xml");
  }

  // Get username and password
  const username = req.get("username") || args.username || config.username;
  const password = req.get("password") || args.password || config.password;

  // Post the request
  httpntlm[req.method === "POST" ? "post" : "get"](
    {
      ...payload,
      ...{
        username,
        password,
        domain: config.domain,
      },
    },
    (error, response) => {
      // Get response body
      const body = (response || {}).body || "";

      // If logging is enabled
      if (
        config.logging &&
        config.logging.responses &&
        args.logging !== false
      ) {
        // Log payload
        console.log(
          "------------------------------------------------Response------------------------------------------------"
        );
        console.log({
          url,
          request: payload.body,
          response: body,
          error,
        });
      }

      // Send error
      if (error) return res.send(error);
      // Else, send body
      return res.send(body);
    }
  );
}

app.listen(config.port, config.host, () =>
  console.log(`Server ready and listening at ${config.host}:${config.port}`)
);

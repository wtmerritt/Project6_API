const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('Request received');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
    res.json({message: 'You request was successful'});
});

module.exports = app;



// mongoose.connect("mongodb://localhost:27017/testdb");
// const db = mongoose.connection;

// db.on("error", (err) => {
//   console.log(err);
// });

// db.once("open", () => {
//   console.log("Databse Connection Established");
// });

// const app = express();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

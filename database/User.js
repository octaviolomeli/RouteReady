const mongoose = require("mongoose");

// User Schema
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  entry0: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
  entry1: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
  entry2: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
  entry3: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
  entry4: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
  entry5: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
  entry6: {
    id: {type: String},
    vehicle: {type: String},
    line: {type: String},
    direction: {type: String},
    stop: {type: String},
    arrival: {type: String},
    possible: {type: String},
    min_to_walk: {type: String}
  },
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
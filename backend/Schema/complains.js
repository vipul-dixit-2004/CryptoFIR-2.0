const { default: mongoose } = require("mongoose");

const ComplainSchema = new mongoose.Schema({
  applicant_name: String,
  complain: String,
  blockIndex: Number,
  mob: String,
  aadhaar_no: String,
  police_station_code: String,
  complainCode: String,
  dateOFApplication: {
    type: Date,
    default: Date.now,
  },
});
const Complains = mongoose.model("complains", ComplainSchema);
module.exports = Complains;

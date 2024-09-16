const Complains = require("../Schema/complains");
const { encryptData } = require("../Utils/utils");
const { fetchCount } = require("../contract");

async function createComplain(req, res) {
  try {
    const { applicant_name, complain, mob, aadhaar_no, police_station_code } =
      req.body;
    const encryptedCompain = encryptData(complain);
    const blockIndex = await fetchCount();
    const complainCode = `CFIR${blockIndex}${mob % 100}`;
    const response = await Complains.create({
      applicant_name,
      complain: encryptedCompain,
      blockIndex,
      complainCode,
      mob,
      aadhaar_no,
      police_station_code,
    });
    console.log(response);
    res
      .status(200)
      .json({ complainId: response._id, complain: response.complain });
  } catch (error) {
    console.log(error);
  }
}

const deleteComplain = async (req, res) => {
  const complainId = req.params.id;

  const deleted = await Complains.deleteOne({ _id: complainId });

  res.status(200).json({ status: deleted });
};

const fetchAll = async (req, res) => {
  try {
    const result = await fetchRecords();
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
  }
};

const findByNameOrCode = async (req, res) => {
  try {
    const { q } = req.query;
    const records = await fetchRecords();
    const result = records.filter(
      (record) =>
        record.applicant_name.toLowerCase().includes(q.toLowerCase()) ||
        record.mob == q ||
        record.complainCode.toLowerCase() == q.toLowerCase()
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const fetchRecords = async () => {
  try {
    const records = await Complains.find();
    return records;
  } catch (error) {
    console.log(error);
    return error;
  }
};
module.exports = {
  createComplain,
  deleteComplain,
  fetchAll,
  findByNameOrCode,
};

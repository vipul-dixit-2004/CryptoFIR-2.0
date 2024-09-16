import { useState, useEffect } from "react";
import axios from "axios";
import { Web3 } from "web3";
import FIR_Records from "../FIR_Records.json";
import Navbar from "./Navbar";

export default function FileFIR() {
  const [suspectCheck, setSuspectCheck] = useState(false);
  const [doubleCheck, setDoubleCheck] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          // console.log(accounts);
          setAccount(accounts[0]);
          // console.log(account);
          // Get contract instance
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = FIR_Records.networks[networkId];
          console.log(networkId, deployedNetwork);
          if (true) {
            const instance = new web3.eth.Contract(
              FIR_Records.abi,
              "0x0220064b95733a670f00ce4e71ef6dd54dc0452e"
            );
            setContract(instance);
          } else {
            console.error("Smart contract not deployed to detected network.");
          }
        } catch (error) {
          console.error("User denied account access or other error:", error);
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        console.log("No Wallet");
      } else {
        console.log("No Wallet");
      }
    };

    init();
  }, []);
  async function submitFormHandler(e) {
    e.preventDefault();
    if (contract) {
      const inputclass = document.getElementsByClassName("inputclass");

      const object = {};
      for (let i = 0; i <= 21; i++) {
        if (!suspectCheck) {
          if (i <= 5) {
            object[i] = inputclass[i].value.trim();
          } else if (i >= 6 && i <= 9) {
            object[i] = null;
          } else {
            object[i] = inputclass[i - 4].value.trim();
          }
        } else {
          object[i] = inputclass[i].value;
        }
      }

      try {
        const applicant_name = object[0] + " " + object[1];
        const complainString = JSON.stringify(object);
        const mob = object[2];
        const aadhaar_no = object[5];
        const police_station_code = object[18] + object[19];
        const response = await axios.post("/createComplain", {
          applicant_name,
          complain: complainString,
          mob,
          aadhaar_no,
          police_station_code,
        });
        console.log(response);
        const { complain, complainId } = response.data;

        setLoading(true);
        let status = await insertRecord(complain, complainId);
        if (!status) {
          setLoading(false);
          errorDeleteRecord(complainId);
          setError(true);
          alert("An Error occured!!!");
        } else {
          setLoading(false);
          console.log(status);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function insertRecord(encComplain, complainId) {
    try {
      const inject = await contract.methods
        .createComplain(complainId, encComplain)
        .send({ from: account });
      console.log(inject);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async function errorDeleteRecord(complainId) {
    await axios.delete(`/api/delete/${complainId}`);
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold text-white">Loading....</h1>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="min-w-full h-full bg-black">
            <div className="p-8 max-w-4xl mx-auto bg-slate-900 ">
              <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={submitFormHandler}>
                  <h1 className="text-3xl font-bold mb-4">
                    First Investigation Report
                  </h1>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      Informer Details
                    </h2>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label
                            htmlFor="informername"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="informername"
                            placeholder="First Name"
                            className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            srequired
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            id="informerlastname"
                            placeholder="Last Name"
                            className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="informerphone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="informerphone"
                          placeholder="Phone"
                          maxLength="10"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="informeremail"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="informeremail"
                          placeholder="Email"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="informeraddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="informeraddress"
                          placeholder="Address"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="informeradhaar"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Adhaar Number
                        </label>
                        <input
                          type="text"
                          id="informeradhaar"
                          placeholder="Adhaar Number"
                          maxLength="12"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      onChange={() => setSuspectCheck(!suspectCheck)}
                      id="suspectcheck"
                      className="mr-2"
                    />
                    <label
                      htmlFor="suspectcheck"
                      className="text-sm text-gray-700"
                    >
                      Do you have a suspect
                    </label>
                  </div>

                  {suspectCheck && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">
                        Suspect Details
                      </h2>
                      <div className="space-y-4">
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <label
                              htmlFor="suspectname"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="suspectname"
                              placeholder="First Name"
                              className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              id="suspectlastname"
                              placeholder="Last Name"
                              className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="suspectaddress"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            id="suspectaddress"
                            placeholder="Address"
                            className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="suspectothers"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Others
                          </label>
                          <input
                            type="text"
                            id="suspectothers"
                            placeholder="Eg. Phone, Description etc"
                            className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      Crime Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="crimetype"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Type of Crime
                        </label>
                        <input
                          type="text"
                          id="crimetype"
                          placeholder="Type of Crime"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="crimedate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date of Crime
                        </label>
                        <input
                          type="date"
                          id="crimedate"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="crimetime"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Time of Crime
                        </label>
                        <input
                          type="time"
                          id="crimetime"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="crimeplace"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Place of Crime
                        </label>
                        <input
                          type="text"
                          id="crimeplace"
                          placeholder="Place of Crime"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="crimedescription"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="crimedescription"
                          placeholder="Description"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        ></textarea>
                      </div>

                      <div>
                        <label
                          htmlFor="Section"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Section
                        </label>
                        <input
                          type="text"
                          id="Section"
                          placeholder="Section"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="distance"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Distance from Police station
                        </label>
                        <input
                          type="text"
                          id="distance"
                          placeholder="Distance from Police station"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="Others"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Others
                        </label>
                        <textarea
                          id="Others"
                          placeholder="Other Details"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      Station Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="stationname"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="stationname"
                          placeholder="Station Name"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="stationnumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Station Number
                        </label>
                        <input
                          type="text"
                          id="stationnumber"
                          placeholder="Station Number"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="stationaddress"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="stationaddress"
                          placeholder="Station Address"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="stationphone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="stationphone"
                          maxLength={10}
                          placeholder="Station Phone"
                          className="inputclass mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          srequired
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="declaration"
                      onChange={() => setDoubleCheck(!doubleCheck)}
                      className="mr-2"
                    />
                    <label
                      htmlFor="declaration"
                      className="text-sm text-gray-700"
                    >
                      I hereby declare that all the information provided above
                      is correct to the best of my knowledge.
                    </label>
                  </div>

                  {doubleCheck && (
                    <div className="text-center">
                      <button
                        id="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

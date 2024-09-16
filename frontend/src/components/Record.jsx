import React from "react";
import docImage from "../assets/file.png";

function Record({ details }) {
  return (
    <>
      <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <img class="rounded-t-lg w-60" src={docImage} alt="" />
        <div class="p-5">
          <a href={`./FIR/applicantName/${details.applicant_name}`}>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {details.applicant_name}
            </h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {details.police_station_code}
          </p>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {details.dateOFApplication}
          </p>
        </div>
      </div>
    </>
  );
}

export default Record;

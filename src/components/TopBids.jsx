import React from "react";

function TopBids({ bids }) {
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString("en-US", {
      weekday: "long", // e.g., "Monday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "August"
      day: "numeric", // e.g., "27"
      hour: "2-digit", // e.g., "02"
      minute: "2-digit", // e.g., "05"
      second: "2-digit", // e.g., "09"
    });
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-bold">
                Bidder
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-bold">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-bold">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id} className="bg-white border-b">
                <td className="px-4 py-2 text-gray-700">{bid.bidderId}</td>
                <td className="px-4 py-2 text-gray-700">${bid.bidAmount}</td>
                <td className="px-4 py-2 text-gray-700">
                  {formatDate(bid.bidTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopBids;

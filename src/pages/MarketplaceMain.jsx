import { React, useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import ArtworkDisplay from "../components/ArtworkDisplay";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import NumberInput from "../components/NumberInput";
import { addBidToFirestore, fetchBidsRealtime } from "../utils/Firebase";
function MarketplaceMain() {
  const artworkId = useParams();
  const location = useLocation();
  const artFromState = location.state?.art;
  const userId = useRef(localStorage.getItem("userId"));
  const [bids, setBids] = useState([]);
  const {
    data: art,
    error,
    isLoading,
  } = useQuery(
    ["artworkDetails", artworkId],
    () => fetchArtworkDetails(artworkId),
    { enabled: !artFromState, initialData: artFromState }
  );

  const [currentBid, setCurrentBid] = useState(art.valuation); // State for holding bids
  useEffect(() => {
    const unsub = fetchBidsRealtime(artworkId, setBids);
    return () => unsub();
  }, [artworkId]);
  const fetchArtworkDetails = async (artworkId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_GET_ARTWORK_DETAILS}?artworkId=${artworkId}`
      );

      return response.data;
    } catch (error) {
      console.log("Error fetching artwork details:", error);
      throw new Error("Failed to fetch artwork details");
    }
  };

  const handleBidChange = (newBid) => {
    setCurrentBid(newBid);
  };
  // const addBid = async (bidData) => {
  //   const response = await axios.post(
  //     `${import.meta.env.VITE_APP_POST_ADD_BID}`,
  //     bidData
  //   );
  //   return response.data;
  // };
  const mutation = useMutation(addBidToFirestore, {
    onSuccess: (data) => {
      console.log("Bid data added successfully");
    },
    onError: (error) => {
      console.log("Error submitting bid");
    },
  });
  const handleBidSubmission = () => {
    const bidData = {
      parentRefId: art.marketplaceItemId,
      artworkId: art.artworkId,
      bidderId: userId.current,
      bidAmount: currentBid,
      bidTime: new Date().toISOString(),
    };
    console.log(bidData);
    mutation.mutate(bidData);
  };

  return (
    <div className=" p-4 w-full">
      <div className="w-full flex   mb-4 justify-center">
        <ArtworkDisplay art={art} />
        <div className="flex-col mx-4 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{art.title}</h1>
          <p className="mt-2 text-lg">{art.description}</p>
          <div className="mt-4">
            by
            <br />
            <Link to={`/artist/${art.userName}`} state={{ art }}>
              <div className="text-blue-500 hover:underline">
                {`${art.firstName} ${art.lastName} (@${art.userName})`}
              </div>
            </Link>
          </div>
          <div className="flex">
            <NumberInput
              initialValue={art.valuation}
              step={art.minIncrement}
              onChange={handleBidChange}
            />
          </div>
          <button
            onClick={handleBidSubmission}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceMain;

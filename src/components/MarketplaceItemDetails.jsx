import { React, useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import ArtworkDisplay from "./ArtworkDisplay";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import NumberInput from "./NumberInput";
import TopBids from "./TopBids";
import { db } from "../utils/Firebase";

import {
  onSnapshot,
  collection,
  query,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
function MarketplaceItemDetails() {
  const artworkId = useParams();
  const location = useLocation();
  const artFromState = location.state?.art;
  const highestBid = useRef(0);
  const latestBidderId = useRef(0);
  const [currentBid, setCurrentBid] = useState(artFromState?.valuation || 0); // State for holding bids - need to set current bid
  const userId = useRef(localStorage.getItem("userId"));
  const [bids, setBids] = useState([]);

  //fetching specific artwork data start
  const {
    data: art,
    error,
    isLoading,
  } = useQuery(
    ["artworkDetails", artworkId],
    () => fetchArtworkDetails(artworkId),

    { enabled: !artFromState, initialData: artFromState }
  );
  const fetchArtworkDetails = async (artworkId) => {
    console.log("inside fetch, before call");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_GET_ARTWORK_DETAILS}?artworkId=${artworkId}`
      );
      setCurrentBid(response.data.valuation);
      console.log("from inside feth artworkdetail", currentBid);
      return response.data;
    } catch (error) {
      console.log("Error fetching artwork details:", error);
      throw new Error("Failed to fetch artwork details");
    }
  };

  //fetching specific artwork data end

  useEffect(() => {
    if (!art) return;
    const itemRef = doc(db, "items", art.marketplaceItemId.toString());
    const bidsCollectionRef = collection(itemRef, "bids");

    const q = query(bidsCollectionRef, orderBy("bidAmount", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBids = [];
      snapshot.forEach((doc) => {
        fetchedBids.push({ id: doc.id, ...doc.data() });
      });

      setBids(fetchedBids);
      console.log(fetchedBids);
      // Update the current bid with the highest bid value
      highestBid.current =
        fetchedBids.length > 0 ? fetchedBids[0].bidAmount : currentBid;
      latestBidderId.current = fetchedBids[0]?.bidderId;
    });

    return () => unsubscribe();
  }, [art]);

  const handleBidChange = (newBid) => {
    setCurrentBid(newBid);
  };

  const mutation = useMutation(
    (bidData) =>
      axios.post(import.meta.env.VITE_APP_POST_ADDBIDTOFIRESTORE, {
        marketplaceItemId: art.marketplaceItemId,
        bidData: bidData,
        highestBid: highestBid.current,
      }),
    {
      onSuccess: (data) => {
        console.log("Bid data added successfully", data);
      },
      onError: (error) => {
        let errorMessage = "Error submitting bid";
        if (error.response?.status === 400) {
          errorMessage = error.response.data.error;
        }
        console.log(errorMessage);
      },
    }
  );
  const handleBidSubmission = () => {
    const bidData = {
      artworkId: art.artworkId,
      bidderId: userId.current,
      bidAmount: currentBid,
      bidTime: new Date().toISOString(),
    };
    console.log("bid data is", bidData, "highest bid is ", highestBid.current);

    // error handling scenarios
    if (bidData.bidAmount < highestBid.current + art?.minIncrement) {
      console.log(
        "Bid needs to be greater than current highest bid + min increment"
      );
    } else if (bidData.bidderId === latestBidderId.current) {
      console.log("Same bidder cannot bid consecutively!");
    } else {
      mutation.mutate(bidData);
    }
    // error handling scenarios
  };

  return (
    <div className=" p-4 w-full">
      <div className="w-full flex   mb-4 justify-center">
        {!isLoading && (
          <>
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
              {/* Use the TopBids component to display top bids */}
              <TopBids bids={bids} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MarketplaceItemDetails;

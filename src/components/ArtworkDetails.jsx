import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import ArtworkDisplay from "./ArtworkDisplay";
import axios from "axios";
import PopupMenu from "./PopupMenu";
import Recommendation from "./Recommendation";
import MarketplaceModal from "./MarketplaceModal";

const ArtworkDetails = () => {
  const { artworkId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artistId, setArtistId] = useState("");
  const userId = useRef(localStorage.getItem("userId"));

  //code to deal with modals for marketplace start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitMarketplaceData = (marketplaceData) => {
    marketplaceData.artworkId = artworkId;
    mutation.mutate(marketplaceData);
  };

  const addToMarketplace = async (marketplaceData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_POST_MARKET_PLACE_DATA}`,
      marketplaceData
    );
    return response.data;
  };

  const mutation = useMutation(addToMarketplace, {
    onSuccess: (data) => {
      console.log("Marketplace data submitted successfully:", data);
      closeModal();
    },
    onError: (error) => {
      console.error("Error submitting marketplace data:", error);
    },
  });
  //code to deal with modals for marketplace end

  const artFromState = location.state?.art;
  const fetchArtworkDetails = async (artworkId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_GET_ARTWORK_DETAILS}?artworkId=${artworkId}`
      );
      setArtistId(response.data.artistId.toString());
      return response.data;
    } catch (error) {
      console.error("Error fetching artwork details:", error);
      throw new Error("Failed to fetch artwork details");
    }
  };

  const {
    data: art,
    error,
    isLoading,
  } = useQuery(
    ["artworkDetails", artworkId],
    () => fetchArtworkDetails(artworkId),
    {
      enabled: !artFromState,
      initialData: artFromState,
    }
  );

  useEffect(() => {
    if (artFromState) {
      setArtistId(artFromState.artistId.toString());
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching artwork details: {error.message}</div>;

  const manageOptions = [
    { option: "Edit", handleClick: "edit" },
    { option: "Add to Collection", handleClick: "add" },
    { option: "Add to Marketplace", handleClick: "addToMarketplace" },
  ];
  const addOptions = [{ option: "Collection", handleClick: "add" }];

  const handleOptionClick = (option) => {
    if (option.handleClick === "edit") {
      navigate(`edit`);
    } else if (option.handleClick === "add") {
      // Handle 'add' functionality here
      console.log("Add option clicked");
    } else if (option.handleClick === "addToMarketplace") {
      //Handle adding to marketplace here
      console.log("Adding to marketplace");
      openModal();
    }
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/discover")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        {userId.current === artistId ? (
          <PopupMenu options={manageOptions} onOptionClick={handleOptionClick}>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Manage
            </button>
          </PopupMenu>
        ) : (
          <PopupMenu options={addOptions} onOptionClick={handleOptionClick}>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </PopupMenu>
        )}
      </div>
      <div className="w-full flex flex-col md:flex-row mb-4 justify-center">
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
        </div>
      </div>
      <Recommendation artistId={artistId} artworkId={art.artworkId} />
      <MarketplaceModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSubmit={handleSubmitMarketplaceData}
      />
    </div>
  );
};

export default ArtworkDetails;

import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import EmptyImg from "../../assets/react.svg";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({from: null, to: null});
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log(
        "An unexpected error occured. Please try again!",
        error.message
      );
    }
  };

  // get user info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        //set user info if data exist
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        //clear storage if unauathorized

        localStorage.clear();
        navigate("/login"); // Redirect to login
      }
    }
  };

  //Handle Edit Story click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  // handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // handle update favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        if(filterType === 'search' && searchQuery){
          onSearchStory(searchQuery);
        }else if(filterType === 'date'){
          filterStoriesByDate(dateRange);
        }else{
          getAllTravelStories();
        }

      }
    } catch (error) {
      console.log(
        "An unexpected error occured. Please try again!",
        error.message
      );
    }
  };

  // Delete story

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get(`/search`, {
        params: {
          query,
        },
      });
      console.log("API Response:", response.data.stories);
      if (response.data && response.data.stories) {
        console.log(response.data.stories);

        setFilterType("search");
        setAllStories(response.data.stories);
        console.log("Stories set to:", response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  // Handle Filter travel story by date range
  const filterStoriesByDate = async(day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if(startDate && endDate) {
        const response = await axiosInstance.get('/travel-stories/filter', {
          params: {startDate, endDate},
        });

        if(response.data && response.data.stories){
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  }

  // Handle Date range select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  }

  const resetFilter = () => {
    setDateRange({from: null, to: null});
    setFilterType("");
    getAllTravelStories();
  }
  
  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10 px-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />
        <div className="flex gap-7">
          <div className="flex-1">
            {console.log("Rendering stories:", allStories)}
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={EmptyImg}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>

          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-0">
                <DayPicker captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add and edit Travel Story Model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-2xl p-5 overflow-y-auto scrollbar"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* view traver story model */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-2xl p-5 overflow-y-auto scrollbar"
      >
        <ViewTravelStory
          type={openViewModal.type}
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;

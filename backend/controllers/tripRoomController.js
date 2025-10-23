import TripRooms from "../models/TripRooms";

const getTripRoomMessage = async(req, res, next) => {
    const {userId} = req.user;
    const {tripId} = req.params;

    if(!tripId){
        res.status(400).json({
            message: "TripId is required"
        })
    }
}
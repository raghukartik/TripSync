import dotenv from "dotenv";
dotenv.config();
import { mailer } from "../utils/mailer.js";
import InvitationModel from "../models/Invitation.js";
import User from "../models/User.js";
import { inviteEmailTemplate } from "../utils/inviteEmailTemplate.js";

export const sendInvitationEmail = async ({
  email,
  token,
  tripName,
  inviterName,
  expiresAt,
}) => {
  const inviteLink = `${process.env.CLIENT_URL}/invite/accept?token=${token}`;
  console.log(process.env.CLIENT_URL)
  const html = inviteEmailTemplate({
    appLink: process.env.CLIENT_URL,
    inviterName,
    tripName,
    inviteLink,
    expiryTime: expiresAt.toLocaleString(),
  });

  await mailer.sendMail({
    from: `"TripSync" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You're invited to join "${tripName}" on TripSync`,
    html,
  });
};

export const validateInvitationRequest = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        valid: false,
        reason: "Token is required",
      });
    }

    const invitation = await InvitationModel.findOne({
      token,
      status: "PENDING",
    });

    if (!invitation) {
      return res.status(404).json({
        valid: false,
        reason: "Invalid or already used invitation",
      });
    }

    if (invitation.expiresAt < new Date()) {
      return res.status(410).json({
        valid: false,
        reason: "Invitation expired",
      });
    }

    const user = await User.findOne({ email: invitation.email });
    const isAuthenticated = !!req.user;
    return res.status(200).json({
      valid: true,
      email: invitation.email,
      accountExists: !!user,
      isAuthenticated: !!req.user,
      tripId: invitation.tripId,
    });
  } catch (error) {
    console.error("validateInvitationRequest error:", error);
    return res.status(500).json({
      valid: false,
      message: "Error validating invitation",
    });
  }
};

export const getPendingInvitation = async(req, res) => {
  try{
    const {userId} = req.user;
    console.log(userId);
    if(!userId){
      return res.status("404").json({
        message: "user is not logged in!"
      })
    }

    const user = await User.findOne({_id: userId});
    
    const invitation = await InvitationModel.find({email: user.email, status: "PENDING"}).populate({
      path: "invitedBy",
      select: "name email"
    });

    if(!invitation){
      res.status(200).json({
        message: "No pending invitations found"
      })
    }

    return res.status(200).json({
      invitation
    })

  }catch(error){
    console.error("validateInvitationRequest error:", error);
    return res.status(500).json({
      valid: false,
      message: "Error validating invitation",
    });
  }
}

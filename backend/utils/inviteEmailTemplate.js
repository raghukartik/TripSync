export const inviteEmailTemplate = ({
  appLink,
  inviterName,
  tripName,
  inviteLink,
  expiryTime
}) => {
  return `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              font-size: 14px;
              color: #111827;
              line-height: 1.5;
              max-width: 600px;
              margin: 0 auto;">

    <a href="${appLink}" target="_blank" style="text-decoration: none;">
      <img
        src="https://your-cdn.com/logo.png"
        alt="TripSync"
        style="height: 32px; margin-bottom: 16px;"
      />
    </a>

    <div style="border-top: 1px solid #eaeaea; padding-top: 16px;">
      <p>You’ve been invited to collaborate on a trip.</p>

      <p>
        <strong>${inviterName}</strong> has invited you to join the trip
        <strong>${tripName}</strong> on <strong>TripSync</strong>.
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${inviteLink}"
          target="_blank"
          style="
            display: inline-block;
            padding: 12px 18px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          "
        >
          Accept Invitation
        </a>
      </div>

      <p>
        This invitation will expire on <strong>${expiryTime}</strong>.
      </p>

      <p style="color: #6b7280;">
        If you don’t have a TripSync account yet, you’ll be guided to create one
        before joining the trip.
      </p>

      <p style="color: #6b7280;">
        If you were not expecting this invitation, you can safely ignore this email.
        This link is single-use and will expire automatically.
      </p>

      <p style="margin-top: 20px;">
        Thanks,<br />
        <strong>TripSync Team</strong>
      </p>
    </div>
  </div>
  `;
};

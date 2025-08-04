import React from "react";
import "./DoctorCard.css";

const DoctorCard = ({ name, specialty, imageSrc, onView }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-info">
        <img src={imageSrc} alt={name} className="avatar" />
        <div>
          <p>{name}</p>
          <p className="subtitle">{specialty}</p>
        </div>
      </div>
      <button className="btn small primary" onClick={onView}>
        View
      </button>
    </div>
  );
};

export default DoctorCard;

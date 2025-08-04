import React, { useRef } from "react";
import "./ReportPage.css";
import ProductCard from "./ProductCard";
import DoctorCard from "./DoctorCard";
import html2pdf from "html2pdf.js";

const ReportPage = () => {

  const leftPanelRef = useRef();

  const handleDownloadPDF = () => {
    const element = leftPanelRef.current;
    const opt = {
      margin: 0.5,
      filename: "PreDiagnosisReport.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const recommendedProducts = [
    {
      name: "Vitamin B Complex",
      price: "$12.89",
      image: "https://via.placeholder.com/40x60?text=B",
      rating: 4.5
    },
    {
      name: "Ice Pack Gel filled",
      price: "$9.99",
      image: "https://via.placeholder.com/40x60?text=Ice",
      rating: 4.0
    },
    {
      name: "Acetaminophen 500 mg",
      price: "$5.99",
      image: "https://via.placeholder.com/40x60?text=A",
      rating: 3.5
    }
  ];

   const suggestedDoctors = [
    {
      name: "Dr. Sarah Collins",
      specialty: "General Practitioner",
      image: "https://via.placeholder.com/40",
    },
    {
      name: "Dr. Adam Knowles",
      specialty: "Orthopedic",
      image: "https://via.placeholder.com/40",
    },
  ];

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-column">
      <div className="panel left-panel" ref={leftPanelRef}>
        <h2 className="title">🩺 Pre-Diagnosis Report</h2>

        <div className="section">
          <h3>Possible Causes</h3>
          <ul>
            <li>Tension headache</li>
            <li>Migraine</li>
          </ul>
        </div>

        <div className="section">
          <h3>Red Flags <span className="icon-red-flag">🚩</span> </h3>
          <p>None identified.</p>
        </div>

        <div className="section">
          <h3>Tests Suggested</h3>
          <ul>
            <li>Physical examination</li>
          </ul>
        </div>

        <div className="section">
          <h3>Doctor Recommendation</h3>
          <p className="note">
            This report is for informational purposes only and is not a substitute for professional medical advice.
          </p>
          <p className="note">
            This report is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>

      </div>
        <div className="button-group">
          <button className="btn outline" onClick={handleDownloadPDF}>Download PDF</button>
        </div>
        </div>

      {/* Right Panel */}
      <div className="panel right-panel">
        <div className="section header-row">
          <h3>Recommended Products</h3>
          {/* <a href="#" className="see-all">See all</a> */}
        </div>

        {recommendedProducts.map((product, index) => (
          <ProductCard
            key={index}
            imageSrc={product.image}
            title={product.name}
            subtitle={product.price}
            rating={product.rating}
            buttonLabel="Add to cart"
            onClick={() => console.log(`Added ${product.name} to cart`)}
          />
        ))}

        <div className="section doctor-suggestion">
          <h4>Suggested Doctors</h4>
          {suggestedDoctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              name={doctor.name}
              specialty={doctor.specialty}
              imageSrc={doctor.image}
              onView={() => console.log(`Viewing ${doctor.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;

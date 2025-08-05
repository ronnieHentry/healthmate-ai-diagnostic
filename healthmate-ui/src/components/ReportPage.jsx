import React, { useRef, useState } from "react";
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
      image: "https://www.appleseedsulverston.co.uk/wp-content/uploads/2020/12/natures-aid-vitamin-b-complex-100-p230-1025_image.png",
      rating: 4.5
    },
    {
      name: "Ice Pack Gel filled",
      price: "$9.99",
      image: "https://m.media-amazon.com/images/I/81GKoSa00aL._SL1500_.jpg",
      rating: 4.0
    },
    {
      name: "Acetaminophen 500 mg",
      price: "$5.99",
      image: "https://images.heb.com/is/image/HEBGrocery/001695755",
      rating: 3.5
    },
    {
      name: "Vitamin D3",
      price: "$12.89",
      image: "https://i5.walmartimages.com/asr/455b66d0-4399-4826-bc2a-44dc224f4417.deffc79dd659426118296361098b328c.jpeg",
      rating: 4.5
    },
    {
      name: "Cold-Go Tablets",
      price: "$9.99",
      image: "https://www.torquepharma.com/wp-content/uploads/2021/08/NEW_COLD_GO_TABLETS.png",
      rating: 4.0
    },
    {
      name: "Paracetamol 500 mg",
      price: "$5.99",
      image: "https://tse2.mm.bing.net/th/id/OIP.R_SYA34g2dikbYtO-5OMPgHaIp?rs=1&pid=ImgDetMain&o=7&rm=3",
      rating: 3.5
    },
    {
      name: "Vitamin C",
      price: "$12.89",
      image: "https://tse3.mm.bing.net/th/id/OIP.-TzrjCqaQ2ZFiBpgoGPNhQHaHa?w=185&h=185&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
      rating: 4.5
    },
    {
      name: "Cough Syrup",
      price: "$9.99",
      image: "https://m.media-amazon.com/images/I/918pLpn6fKL._SL1500_.jpg",
      rating: 4.0
    },
    {
      name: "Otrivin",
      price: "$5.99",
      image: "https://tse2.mm.bing.net/th/id/OIP.yDVXgg6w-He0OTSq1JocmgHaHb?w=193&h=194&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
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

  // Carousel logic for doctors
  const doctorsCarouselRef = useRef();
  const scrollDoctors = (dir) => {
    const el = doctorsCarouselRef.current;
    if (el) {
      const scrollAmount = 220;
      el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    }
  };

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
      <div className="panel right-panel" >
        <div className="header-row">
          <h3>Recommended Products</h3>
        </div>

        <div className="product-grid">
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
        </div>

        <div className="doctor-suggestion">
          <h3>Suggested Doctors</h3>
          <div className="doctors-carousel-wrapper">
            <button className="carousel-arrow left" onClick={() => scrollDoctors(-1)}>&lt;</button>
            <div className="doctors-carousel" ref={doctorsCarouselRef}>
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
            <button className="carousel-arrow right" onClick={() => scrollDoctors(1)}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;

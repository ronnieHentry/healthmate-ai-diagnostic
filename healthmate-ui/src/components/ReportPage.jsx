
import React, { useRef, useState, useEffect } from "react";
import "./ReportPage.css";
import ProductCard from "./ProductCard";
import DoctorCard from "./DoctorCard";
import html2pdf from "html2pdf.js";
import { Skeleton, Typography, Paper, Box, Alert, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";


import axios from "axios";
import Section from "./Section";


const ReportPage = () => {
  const leftPanelRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location?.state?.sessionId;

  // Diagnosis data state
  const [loading, setLoading] = useState(true);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      if (!sessionId) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post("http://localhost:8000/api/diagnosis", {
          session_id: sessionId,
        });
        setDiagnosisData(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosis();
    // eslint-disable-next-line
  }, [sessionId]);

// ...rest of the component remains unchanged...

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



  // Carousel logic for doctors
  const doctorsCarouselRef = useRef();
  const scrollDoctors = (dir) => {
    const el = doctorsCarouselRef.current;
    if (el) {
      const scrollAmount = 220;
      el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    }
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
  // Loading state
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
  if (loading) {
    return (
      <div className="container">
        <div className="left-column">
          <div className="panel left-panel" style={{ minHeight: 480 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🩺 Generating your report...
            </Typography>
            {[...Array(2)].map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton height={24} width="40%" />
                <Skeleton height={18} width="90%" />
                <Skeleton height={18} width="80%" />
                <Skeleton height={18} width="70%" />
                <Skeleton height={18} width="40%" />
                <Skeleton height={18} width="20%" />
                <Skeleton height={18} width="60%" />
                <Skeleton height={18} width="70%" />
              </Box>
            ))}
            <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "flex-end" }}>
              <Skeleton variant="rectangular" width={120} height={36} />
              <Skeleton variant="rectangular" width={120} height={36} />
            </Stack>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="header-row">
            <Skeleton width={180} height={32} />
          </div>
          <div className="product-grid">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={180} height={220} sx={{ borderRadius: 2, m: 1 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !diagnosisData) {
    return (
      <div className="container">
        <div className="left-column">
          <div className="panel left-panel" style={{ minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Alert severity="error">
              Failed to generate diagnosis. Please try again later.
            </Alert>
          </div>
        </div>
        <div className="panel right-panel">
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
        </div>
      </div>
    );
  }

  // Diagnosis data loaded
  const { diagnosis_structured } = diagnosisData;

  // Define sections dynamically
  const sections = [
    { title: "Possible Causes", items: diagnosis_structured?.possible_causes },
    { title: "Red Flags", items: diagnosis_structured?.red_flags, fallback: "None identified." },
    { title: "Tests Suggested", items: diagnosis_structured?.tests_suggested },
    { title: "Doctor Recommendation", content: diagnosis_structured?.doctor_recommendation },
    { title: "Doctor's Summary", content: diagnosis_structured?.doctor_summary },
  ];

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-column">
        <div className="panel left-panel" ref={leftPanelRef}>
          <h2 className="title">🩺 Pre-Diagnosis Report</h2>
          {sections.map((section, index) => (
            <Section key={index} title={section.title} items={section.items} content={section.content} fallback={section.fallback} />
          ))}
        </div>
        <div className="button-group">
          <button className="btn outline" onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </div>

      {/* Right Panel (unchanged) */}
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



}
export default ReportPage;

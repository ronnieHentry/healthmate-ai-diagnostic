
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

  // Prevent double API call (e.g., in React Strict Mode) by using a ref
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!sessionId) return;
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    const fetchDiagnosis = async () => {
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


  // No separate state for recommendedProducts; will use from diagnosisData
  // Suggested doctors state
  // No separate state for suggestedDoctors; will use from diagnosisData
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
  const { diagnosis_structured, recommended_products = [], suggested_doctors = [] } = diagnosisData;


  // Helper to capitalize first letter of a string
  const capitalizeFirst = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Capitalize all items in a list (if array)
  const capItems = (arr) => Array.isArray(arr) ? arr.map(capitalizeFirst) : arr;

  // Define sections dynamically, including dietary recommendations, with capitalized items
  const sections = [
    { title: "Possible Causes", items: capItems(diagnosis_structured?.possible_causes) },
    { title: "Red Flags", items: capItems(diagnosis_structured?.red_flags), fallback: "None identified." },
    { title: "Tests Suggested", items: capItems(diagnosis_structured?.tests_suggested) },
    { title: "Doctor Recommendation", content: diagnosis_structured?.doctor_recommendation },
    { title: "Dietary Recommendations", items: capItems(diagnosis_structured?.dietary_recommendations), fallback: "No specific dietary advice." },
    { title: "Summary", content: diagnosis_structured?.doctor_summary },
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
          {recommended_products.length === 0
            ? [...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={180}
                  height={220}
                  sx={{ borderRadius: 2, m: 1 }}
                />
              ))
            : recommended_products.map((product, index) => (
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
              {suggested_doctors.length === 0
                ? [...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      width={180}
                      height={60}
                      sx={{ borderRadius: 2, m: 1 }}
                    />
                  ))
                : suggested_doctors.map((doctor, index) => (
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

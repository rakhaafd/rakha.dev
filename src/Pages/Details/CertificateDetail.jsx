import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOpenInNew, MdArrowBack } from "react-icons/md";
import { FaCertificate, FaAward, FaUser, FaCalendarAlt, FaShieldAlt, FaLaptopCode, FaCheckCircle, FaBuilding, FaRegCalendarAlt } from "react-icons/fa";
import Button from "../../Elements/Button";

export default function CertificateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/assets/certificate.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load certificate.json");
        return res.json();
      })
      .then((data) => {
        const certificateId = parseInt(id);
        const foundCertificate = data.find(cert => cert.id === certificateId);
        
        if (foundCertificate) {
          setCertificate(foundCertificate);
        } else {
          setError("Certificate not found");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate("/certificates");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryIcon = (category) => {
    if (category.includes("Cyber Security")) return <FaShieldAlt className="text-[var(--color-accent)]" />;
    if (category.includes("Awarding")) return <FaAward className="text-[var(--color-accent)]" />;
    return <FaLaptopCode className="text-[var(--color-accent)]" />;
  };

  const getImagePath = (imagePath) => {
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^\.\.?\/+/, '/');
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  };

  if (isLoading) {
    return (
      <section className="relative py-16 px-4 sm:py-20 sm:px-8 lg:px-12 min-h-screen">
        <div className="mt-5 max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors duration-300 mb-8"
          >
            <MdArrowBack className="text-lg" />
            <span>Back</span>
          </button>
          
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !certificate) {
    return (
      <section className="relative py-16 px-4 sm:py-20 sm:px-8 lg:px-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors duration-300 mb-8"
          >
            <MdArrowBack className="text-lg" />
            <span>Back</span>
          </button>
          
          <div className="text-center text-gray-400 py-20 bg-gradient-to-b from-[#1e1e1e] to-[#181818] rounded-2xl border border-[#2a2a2a]">
            <FaCertificate className="text-6xl mx-auto mb-4 text-gray-600" />
            <p className="text-2xl mb-2">Certificate Not Found</p>
            <p className="text-gray-500">The certificate you're looking for doesn't exist.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 px-4 sm:py-20 sm:px-8 lg:px-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="cursor-pointer mt-5 flex items-center gap-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors duration-300 mb-8 group"
        >
          <MdArrowBack className="text-lg transition-transform" />
          <span>Back to Certificates</span>
        </button>

        <div className="bg-gradient-to-b from-[#1e1e1e] to-[#181818] rounded-2xl border border-[#2a2a2a] overflow-hidden">
          {certificate.image && (
            <div className="relative w-full h-[400px] bg-[#0a0a0a] flex items-center justify-center p-8">
              {!imageError ? (
                <img
                  src={getImagePath(certificate.image)}
                  alt={certificate.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <FaCertificate className="text-8xl text-gray-600 block mx-auto mb-4" />
                    <span className="text-sm text-gray-500">Certificate image not available</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-8 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {certificate.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {certificate.issuer && (
                <div className="bg-[#242424] rounded-xl p-4 border border-[#323232]">
                  <p className="text-xs text-gray-500 mb-1">Issuer</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <FaBuilding className="text-[var(--color-accent)]" />
                    {certificate.issuer}
                  </p>
                </div>
              )}

              {certificate.date && (
                <div className="bg-[#242424] rounded-xl p-4 border border-[#323232]">
                  <p className="text-xs text-gray-500 mb-1">Issued Date</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <FaRegCalendarAlt className="text-[var(--color-accent)]" />
                    {formatDate(certificate.date)}
                  </p>
                </div>
              )}
            </div>

            {certificate.details && (
              <div className="mb-8">
                <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  Details
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {certificate.details}
                </p>
              </div>
            )}

            {certificate.category && certificate.category.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-semibold text-lg mb-3">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {certificate.category.map((cat, index) => (
                    <span
                      key={index}
                      className="bg-[#242424] border border-[#323232] text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-[var(--color-accent)]/20 transition-colors flex items-center gap-2"
                    >
                      {getCategoryIcon(cat)}
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4 border-t border-[#2a2a2a]">
              {certificate.link && (
                <Button
                  icon={<MdOpenInNew className="text-lg" />}
                  text="View Certificate"
                  variant="solid"
                  onClick={() => window.open(certificate.link, "_blank")}
                  className="px-6 py-3"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
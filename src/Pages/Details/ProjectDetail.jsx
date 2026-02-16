import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOpenInNew, MdArrowBack, MdArrowForward, MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FaCode, FaCalendarAlt, FaUser, FaUsers, FaCheckCircle, FaLaptopCode } from "react-icons/fa";
import Button from "../../Elements/Button";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetch("/assets/project.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load project.json");
        return res.json();
      })
      .then((data) => {
        const projectId = parseInt(id);
        const foundProject = data.find(p => p.id === projectId);

        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found");
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
    navigate("/projects");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTypeIcon = (type) => {
    return type?.toLowerCase() === "team" ? <FaUsers /> : <FaUser />;
  };

  const nextImage = () => {
    if (project?.image && currentImageIndex < project.image.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
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
        <div className="max-w-4xl mx-auto">
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

  if (error || !project) {
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
            <p className="text-6xl mb-4">😕</p>
            <p className="text-2xl mb-2">Project Not Found</p>
            <p className="text-gray-500">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </section>
    );
  }

  const images = Array.isArray(project.image) ? project.image : [project.image];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];
  const hasImageError = imageErrors[currentImageIndex];

  return (
    <section className="relative py-16 px-4 sm:py-20 sm:px-8 lg:px-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="cursor-pointer mt-5 flex items-center gap-2 text-gray-400 hover:text-[var(--color-accent)] transition-colors duration-300 mb-8 group"
        >
          <MdArrowBack className="text-lg transition-transform" />
          <span>Back to Projects</span>
        </button>

        <div className="bg-gradient-to-b from-[#1e1e1e] to-[#181818] rounded-2xl border border-[#2a2a2a] overflow-hidden">
          {images.length > 0 && (
            <div className="relative w-full h-[400px] group/image">
              {!hasImageError ? (
                <img
                  src={getImagePath(currentImage)}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(currentImageIndex)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl text-gray-600 block mb-2">📁</span>
                    <span className="text-sm text-gray-500">Image not available</span>
                  </div>
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className={`
                      absolute left-4 top-1/2 -translate-y-1/2
                      bg-black/50 hover:bg-black/70
                      text-white rounded-full p-3
                      transition-all duration-300
                      opacity-0 group-hover/image:opacity-100
                      disabled:opacity-0 disabled:cursor-not-allowed
                      backdrop-blur-sm
                    `}
                  >
                    <MdArrowBackIos className="text-xl" />
                  </button>

                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className={`
                      absolute right-4 top-1/2 -translate-y-1/2
                      bg-black/50 hover:bg-black/70
                      text-white rounded-full p-3
                      transition-all duration-300
                      opacity-0 group-hover/image:opacity-100
                      disabled:opacity-0 disabled:cursor-not-allowed
                      backdrop-blur-sm
                    `}
                  >
                    <MdArrowForwardIos className="text-xl" />
                  </button>
                </>
              )}

              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${index === currentImageIndex
                          ? 'bg-[var(--color-accent)] w-6'
                          : 'bg-[var(--color-subtext)]'
                        }
                      `}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-8 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {project.title}
              </h1>
              {project.status && (
                <span className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm border border-[var(--color-accent)]/30 flex items-center gap-2">
                  <FaCheckCircle />
                  {project.status}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {project.date && (
                <div className="bg-[#242424] rounded-xl p-4 border border-[#323232]">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <FaCalendarAlt className="text-[var(--color-accent)]" />
                    {formatDate(project.date)}
                  </p>
                </div>
              )}

              {project.type && (
                <div className="bg-[#242424] rounded-xl p-4 border border-[#323232]">
                  <p className="text-xs text-gray-500">Project Type</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <span className="text-[var(--color-accent)]">
                      {getTypeIcon(project.type)}
                    </span>
                    {project.type}
                  </p>
                </div>
              )}

              {project.role && (
                <div className="bg-[#242424] rounded-xl p-4 border border-[#323232]">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm text-white flex items-center gap-2">
                    <FaLaptopCode className="text-[var(--color-accent)]" />
                    {project.role}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">Description</h2>
              <p className="text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.details && (
              <div className="mb-8">
                <h2 className="text-white font-semibold text-lg mb-3">Details</h2>
                <p className="text-gray-400 leading-relaxed">
                  {project.details}
                </p>
              </div>
            )}

            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-semibold text-lg mb-3">Key Features</h2>
                <ul className="space-y-2">
                  {project.keyFeatures.map((feature, index) => (
                    <li key={index} className="text-gray-400 flex items-start gap-3">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <span className="text-gray-400 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technology && project.technology.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-semibold text-lg mb-3">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technology.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-[#242424] border border-[#323232] text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-[var(--color-accent)]/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4 border-t border-[#2a2a2a]">
              {project.link && (
                <Button
                  icon={<MdOpenInNew className="text-lg" />}
                  text="Live Project"
                  variant="solid"
                  onClick={() => window.open(project.link, "_blank")}
                  className="px-6 py-3"
                />
              )}
              {project.github && (
                <Button
                  icon={<FaCode className="text-lg" />}
                  text="Source Code"
                  variant="outline"
                  onClick={() => window.open(project.github, "_blank")}
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
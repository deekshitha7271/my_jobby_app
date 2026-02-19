import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../Components/Header";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const JobItemDetails = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const navigate = useNavigate();

  const getJobDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/jobs/${id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const job = data.job_details;
      const updatedJob = {
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
        skills: job.skills,
        lifeAtCompany: job.life_at_company,
      };
      setJobDetails(updatedJob);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getJobDetails();
    
  }, [id]);

  const renderLoadingView = () => (
    <div className="job-details-loader-container">
      <div className="loader"></div>
    </div>
  );

  const renderFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-img"
      />
      <h1 className="job-details-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-details-failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="job-details-retry-btn" onClick={getJobDetails}>
        Retry
      </button>
    </div>
  );

  const renderJobDetails = () => (
    <div className="job-details-card">
      <div className="job-details-header">
        <img
          src={jobDetails.companyLogoUrl}
          alt="job details company logo"
          className="job-details-company-logo"
        />
        <div>
          <h1 className="job-details-title">{jobDetails.title}</h1>
          <div className="job-details-rating">
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-icon"
            />
            <p>{jobDetails.rating}</p>
          </div>
        </div>
      </div>
      <div className="job-details-info">
        <p className="job-details-location">{jobDetails.location}</p>
        <p className="job-details-employment-type">{jobDetails.employmentType}</p>
        <p className="job-details-package">{jobDetails.packagePerAnnum}</p>
      </div>
      <hr className="job-details-divider" />
      <div className="job-details-desc-header">
        <h2 className="job-details-desc-title">Description</h2>
        <a
          href={jobDetails.companyWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="job-details-company-link"
        >
          Visit <span className="job-details-company-link-icon">🔗</span>
        </a>
      </div>
      <p className="job-details-description">{jobDetails.jobDescription}</p>
      <h3 className="job-details-section-title">Skills</h3>
      <ul className="job-details-skills-list">
        {jobDetails.skills.map(skill => (
          <li key={skill.name} className="job-details-skill-item">
            <img
              src={skill.image_url}
              alt={skill.name}
              className="job-details-skill-img"
            />
            <p>{skill.name}</p>
          </li>
        ))}
      </ul>
      <h3 className="job-details-section-title">Life at Company</h3>
      <div className="job-details-life-at-company">
        <p className="job-details-life-desc">{jobDetails.lifeAtCompany.description}</p>
        <img
          src={jobDetails.lifeAtCompany.image_url}
          alt="life at company"
          className="job-details-life-img"
        />
      </div>
    </div>
  );

  const renderSwitch = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderJobDetails();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="job-details-bg">
      <Header />
      {renderSwitch()}
    </div>
  );
};

export default JobItemDetails;
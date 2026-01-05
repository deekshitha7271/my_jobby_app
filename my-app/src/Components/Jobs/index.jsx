import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../Components/Header";
import "./index.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Sample filter options (use your own if needed)
const employmentTypesList = [
  { label: "Full Time", employmentTypeId: "FULLTIME" },
  { label: "Part Time", employmentTypeId: "PARTTIME" },
  { label: "Freelance", employmentTypeId: "FREELANCE" },
  { label: "Internship", employmentTypeId: "INTERNSHIP" },
];

const salaryRangesList = [
  { salaryRangeId: "1000000", label: "10 LPA and above" },
  { salaryRangeId: "2000000", label: "20 LPA and above" },
  { salaryRangeId: "3000000", label: "30 LPA and above" },
  { salaryRangeId: "4000000", label: "40 LPA and above" },
];

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Jobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [searchInput, setSearchInput] = useState("");
  const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([]);
  const [activeSalaryRange, setActiveSalaryRange] = useState("");
  const navigate = useNavigate();

  const getJobs = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const employmentTypeQuery = activeEmploymentTypes.join(",");
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeQuery}&minimum_package=${activeSalaryRange}&search=${searchInput}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      const updatedJobs = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
      }));
      setJobsList(updatedJobs);
      setApiStatus(apiStatusConstants.success);
    } else {
      console.log("API Error:", data, url);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getJobs();
    
  }, [activeEmploymentTypes, activeSalaryRange]);

  const onChangeSearchInput = event => {
    setSearchInput(event.target.value);
  };

  const onClickSearch = () => {
    getJobs();
  };

  const onChangeEmploymentType = event => {
    const { value, checked } = event.target;
    setActiveEmploymentTypes(prev =>
      checked
        ? [...prev, value]
        : prev.filter(type => type !== value)
    );
  };

  const onChangeSalaryRange = event => {
    setActiveSalaryRange(event.target.value);
  };

  const renderFilters = () => (
    <div className="jobs-filters">
      <div className="filter-group">
        <h3 className="filter-title">Type of Employment</h3>
        <ul className="filter-list">
          {employmentTypesList.map(type => (
            <li key={type.employmentTypeId}>
              <input
                type="checkbox"
                id={type.employmentTypeId}
                value={type.employmentTypeId}
                checked={activeEmploymentTypes.includes(type.employmentTypeId)}
                onChange={onChangeEmploymentType}
              />
              <label htmlFor={type.employmentTypeId}>{type.label}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-group">
        <h3 className="filter-title">Salary Range</h3>
        <ul className="filter-list">
          {salaryRangesList.map(range => (
            <li key={range.salaryRangeId}>
              <input
                type="radio"
                id={range.salaryRangeId}
                name="salary"
                value={range.salaryRangeId}
                checked={activeSalaryRange === range.salaryRangeId}
                onChange={onChangeSalaryRange}
              />
              <label htmlFor={range.salaryRangeId}>{range.label}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderJobsList = () => {
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-desc">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      );
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li
            key={job.id}
            className="job-item"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <img
              src={job.companyLogoUrl}
              alt="company logo"
              className="job-company-logo"
            />
            <div className="job-title-rating">
              <h1 className="job-title">{job.title}</h1>
              <div className="job-rating">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
                <p>{job.rating}</p>
              </div>
            </div>
            <div className="job-details">
              <p className="job-location">{job.location}</p>
              <p className="job-employment-type">{job.employmentType}</p>
              <p className="job-package">{job.packagePerAnnum}</p>
            </div>
            <hr className="job-divider" />
            <h2 className="job-desc-title">Description</h2>
            <p className="job-description">{job.jobDescription}</p>
          </li>
        ))}
      </ul>
    );
  };

  const renderLoadingView = () => (
    <div className="jobs-loader-container">
      <div className="loader"></div>
    </div>
  );

  const renderFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="jobs-retry-btn" onClick={getJobs}>
        Retry
      </button>
    </div>
  );

  const renderJobs = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderJobsList();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="jobs-bg">
      <Header />
      <div className="jobs-body">
        <aside>{renderFilters()}</aside>
        <main>
          <div className="jobs-search-bar">
            <input
              type="search"
              className="jobs-search-input"
              value={searchInput}
              onChange={onChangeSearchInput}
              placeholder="Search"
              onKeyDown={e => { if (e.key === "Enter") onClickSearch(); }}
            />
            <button
              type="button"
              className="jobs-search-icon-btn"
              onClick={onClickSearch}
              data-testid="searchButton"
              aria-label="search"
            >
              <i className="fa fa-search search-icon"></i>
            </button>
          </div>
          {renderJobs()}
        </main>
      </div>
    </div>
  );
};

export default Jobs;
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import "./index.css";

const Home = () => {
  const navigate = useNavigate();

  const onFindJobs = () => {
    navigate("/jobs");
  };

  return (
    <div className="home-bg">
      <Header />
      <div className="home-content">
        <h1 className="home-title">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button className="find-jobs-btn" onClick={onFindJobs}>
          Find Jobs
        </button>
      </div>
      
    </div>
  );
};

export default Home;
import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );

        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchSubmissions();
    }
  }, [problemId]);


  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";
      case "wrong":
        return "badge-error";
      case "error":
        return "badge-warning";
      case "pending":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  
  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Submission History
      </h2>

      {submissions.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Language</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Test Cases</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub, index) => (
                <tr key={sub._id}>
                  <td>{index + 1}</td>

                  <td className="font-mono">{sub.language}</td>

                  <td>
                    <span
                      className={`badge ${getStatusColor(sub.status)}`}
                    >
                      {sub.status.charAt(0).toUpperCase() +
                        sub.status.slice(1)}
                    </span>
                  </td>

                  <td className="font-mono">
                    {sub.runtime} sec
                  </td>

                  <td className="font-mono">
                    {formatMemory(sub.memory)}
                  </td>

                  <td className="font-mono">
                    {sub.testCasesPassed}/{sub.testCasesTotal}
                  </td>

                  <td>{formatDate(sub.createdAt)}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {selectedSubmission && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Submitted Code
          </h3>

          <pre className="bg-gray-200 p-4 rounded overflow-x-auto">
            {selectedSubmission.code}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
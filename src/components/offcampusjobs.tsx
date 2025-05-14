import React, { useState, useEffect } from 'react';
import { fetchJobs1 } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select'; // Update as per your actual Select component

const JOBS_PER_PAGE = 6;

  export const OffCampusJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    country: '',
    remote: false,
    search: ''
  });
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobs1(filters);
      setJobs(data);
      setCurrentPage(1); // Reset to first page on filter change
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Pagination Logic
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIdx = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobs.slice(startIdx, startIdx + JOBS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading && <div className="text-center py-8">Loading jobs...</div>}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No jobs found matching your criteria
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map(job => (
          <Card key={job._id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start mb-4">
                {job.employer_logo && (
                  <img
                    src={job.employer_logo}
                    alt={job.employer_name}
                    className="w-16 h-16 object-contain mr-4"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{job.job_title}</h3>
                  <p className="text-gray-600">{job.employer_name}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Location:</span> {job.formatted_location}
                  {job.job_is_remote && (
                    <Badge className="ml-2">Remote</Badge>
                  )}
                </p>

                {job.formatted_salary && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Salary:</span> {job.formatted_salary}
                  </p>
                )}

                <p className="text-gray-500 text-sm">
                  Posted {job.days_ago === 0 ? 'today' : `${job.days_ago} days ago`}
                </p>
              </div>

              <div className="line-clamp-3 text-gray-700 mb-4">
                {job.job_description}
              </div>

              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Now
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx + 1}
              onClick={() => handlePageChange(idx + 1)}
              variant={currentPage === idx + 1 ? 'default' : 'outline'}
            >
              {idx + 1}
            </Button>
          ))}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};



// src/components/FeedbackForm.js

import { useState } from 'preact/hooks';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    question2: '',
    question3: '',
    question4: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const lambdaUrl = process.env.PREACT_APP_LAMBDA_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionSuccess(true);
        setFormData({
          name: '',
          email: '',
          rating: 0,
          question2: '',
          question3: '',
          question4: '',
        });
      } else {
        setErrorMessage(result.error || 'Failed to submit feedback.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting feedback.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center p-5">
                <h3 className="card-title mb-3">Thank You!</h3>
                <p className="text-muted">Your feedback has been submitted successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 className="card-title text-center mb-4">Share Your Feedback</h2>
              <p className="text-muted text-center mb-4">Help us improve our services by providing your valuable feedback.</p>

              {errorMessage && (
                <div className="alert alert-danger mb-4">{errorMessage}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">Name (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email (optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">Rating</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= formData.rating ? 'selected' : ''}`}
                        onClick={() => handleStarClick(star)}
                        role="button"
                        aria-label={`${star} stars`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="question2" className="form-label">What did you like most about our service?</label>
                  <textarea
                    className="form-control"
                    id="question2"
                    name="question2"
                    value={formData.question2}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us what you liked"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="question3" className="form-label">What can we improve?</label>
                  <textarea
                    className="form-control"
                    id="question3"
                    name="question3"
                    value={formData.question3}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Share your suggestions"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="question4" className="form-label">
                    Would you recommend us to others?
                  </label>
                  <select
                    className="form-select"
                    id="question4"
                    name="question4"
                    value={formData.question4}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;

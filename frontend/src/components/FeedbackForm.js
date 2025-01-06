import { useState } from 'preact/hooks';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', rating: 0, question2: '', question3: '', question4: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const lambdaUrl = process.env.PREACT_APP_LAMBDA_URL;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleStarClick = (rating) => setFormData({ ...formData, rating });

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

      if (response.ok) {
        setSubmissionSuccess(true);
        setFormData({ name: '', email: '', rating: 0, question2: '', question3: '', question4: '' });
      } else {
        setErrorMessage((await response.json()).error || 'Failed to submit feedback.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 text-center p-5">
          <h3>Thank You!</h3>
          <p>Your feedback has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4 p-md-5">
        <h2 className="text-center mb-4">Share Your Feedback</h2>
        <p className="text-muted text-center mb-4">Help us improve our services by providing your feedback.</p>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          {['name', 'email'].map((field) => (
            <div className="mb-4" key={field}>
              <label htmlFor={field} className="form-label">{`${field.charAt(0).toUpperCase() + field.slice(1)} (optional)`}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                className="form-control"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}

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

          {['question2', 'question3'].map((q, i) => (
            <div className="mb-4" key={q}>
              <label htmlFor={q} className="form-label">
                {i === 0 ? 'What did you like most about our service?' : 'What can we improve?'}
              </label>
              <textarea
                className="form-control"
                id={q}
                name={q}
                value={formData[q]}
                onChange={handleChange}
                rows="3"
                placeholder={i === 0 ? 'Tell us what you liked' : 'Share your suggestions'}
              />
            </div>
          ))}

          <div className="mb-4">
            <label htmlFor="question4" className="form-label">Would you recommend us to others?</label>
            <select className="form-select" id="question4" name="question4" value={formData.question4} onChange={handleChange} required>
              <option value="" disabled>Select an option</option>
              {['Yes', 'No', 'Maybe'].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

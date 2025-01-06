import React, { useState, useEffect, useRef } from 'react'; 
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import './ReviewForm.css';

function ReviewForm({ id }) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const commentInputRef = useRef(null); 

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus(); 
    }
  }, []);

  return (
    <Formik
      initialValues={{ rating: userRating, comment: '' }}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        fetch(`http://localhost:3001/reviews/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: values.rating, comment: values.comment, product: id }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setUserRating(0);
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            resetForm();
          }, 3000);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        setSubmitting(false);
      }}
      validate={values => {
        const errors = {};
        if (!values.comment.trim()) {
          errors.comment = 'Komentarz nie może być pusty';
        }
        return errors;
      }}
    >
      {({ isSubmitting }) => (
        <Form className="review-form">
          <StarRatingInput userRating={userRating} setUserRating={setUserRating} hoverRating={hoverRating} setHoverRating={setHoverRating} /> 
          <Field as="textarea" name="comment" innerRef={commentInputRef} /> {/* Ref do pola wprowadzania komentarza */}
          <ErrorMessage name="comment" component="div" />
          <button type="submit" disabled={isSubmitting}>
            Dodaj opinię
          </button>
          {submitted && <div>Opinia została dodana!</div>}
        </Form>
      )}
    </Formik>
  );
}

function StarRatingInput({ userRating, setUserRating, hoverRating, setHoverRating }) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue('rating', userRating);
  }, [userRating, setFieldValue]);

  return (
    <div className="star-rating">
      {Array(5).fill().map((_, i) => (
        <span 
          className={`star ${i < userRating ? 'star-selected' : i < hoverRating ? 'star-hover' : 'star-default'}`}
          key={i} 
          onClick={() => {setUserRating(i + 1); setHoverRating(0);}} 
          onMouseEnter={() => setHoverRating(i + 1)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {i < userRating || i < hoverRating ? '🌟' : '⭐'}
        </span>
      ))}
    </div>
  );
}

export default ReviewForm;
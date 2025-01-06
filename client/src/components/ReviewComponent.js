import React from 'react';

function Review({ review }) {
  return (
    <div>
      <p>Rating: {review.rating}</p>
      <p>Comment: {review.comment}</p>
    </div>
  );
}

export default Review;
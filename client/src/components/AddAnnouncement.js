import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';

function AddAnnouncement() {
  // Set states
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/clubs', {
      credentials: 'include' // Ensure credentials are included
    })
      .then(response => response.json())
      .then(data => setClubs(data));
  }, []);

  // Define the Initial values
  const formik = useFormik({
    initialValues: {
      content: '',
      club: '',
    },

    // Validate input fields using Yup
    validationSchema: Yup.object({
      content: Yup.string().required('Required'),
      club: Yup.string().required('Required'),
    }),

    // Define the create announcement logic
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const selectedClub = clubs.find(club => club.name === values.club);
      if (!selectedClub) {
        setErrors({ club: 'Invalid club selection' });
        return;
      }
      const clubId = selectedClub.id;
      fetch('http://127.0.0.1:5000/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure credentials are included
        body: JSON.stringify({ ...values, club_id: clubId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Announcement created successfully') {
            navigate('/mainpage');
          } else {
            alert('Error creating announcement');
          }
        })
        .catch(error => {
          console.error('Error creating announcement:', error);
          alert('Error creating announcement');
        });
    },
  });

  return (
    <div className="signup">
      <div className="btn btn-back">
        <Link to="/">
          <i className="fa-solid fa-arrow-left-long"></i>
        </Link>
      </div>
      <div className="form-container starter">
        <form onSubmit={formik.handleSubmit}>
          <h1>Add an announcement</h1>
          <h2 className="emoji">🎉</h2>
          <div className="form-group">
            <input
              id="content"
              name="content"
              type="text"
              placeholder="Content"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
            />
          </div>
          {formik.touched.content && formik.errors.content ? (
            <div className="error">{formik.errors.content}</div>
          ) : null}
          <div className="form-group">
            <select
              id="club"
              name="club"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.club}
            >
              <option value="">Select a club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.name}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
          {formik.touched.club && formik.errors.club ? (
            <div className="error">{formik.errors.club}</div>
          ) : null}

          <div className="btnn">
            <button type="submit" className="login-btn" disabled={formik.isSubmitting}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAnnouncement;

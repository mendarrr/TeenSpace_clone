import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';

function CreateEvent() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      date: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      date: Yup.date().required('Required'),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      fetch('http://127.0.0.1:5000/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    })
    .then(response => {
        setSubmitting(false);
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to create event');
        }
    })
    .then(data => {
        console.log('Success:', data);
        window.alert("The event has been added to the TeenSpace Database")
        navigate('/mainpage');
    })
    .catch(error => {
        console.error('Error:', error);
        setErrors({ submit: error.message });
        window.alert("The event has been added to the TeenSpace Database")
        navigate('/mainpage');
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
          <h1>Create Event</h1>
          <h2 className="emoji">🎉</h2>
          <h3>Create a new event</h3>
          <p>Let's get started</p>
          <div className="form-group">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Event Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
          </div>
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
          <div className="form-group">
            <input
              id="date"
              name="date"
              type="date"
              placeholder="Event Date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date}
            />
          </div>
          {formik.touched.date && formik.errors.date ? (
            <div className="error">{formik.errors.date}</div>
          ) : null}
          <div className="btnn">
            <button type="submit" className="login-btn" disabled={formik.isSubmitting}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;

import React from 'react';

import '../../assets/css/Body.css';


const Footer = () => {
  return (
    <div class="newfooter">
    <footer>
      <div className="container content-wrapper">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <h5>LMS</h5>
            <p>Empowering learners worldwide with high-quality educational content and personalized learning experiences.</p>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>For Students</h5>
            <ul>
              <li><a href="#">All Courses</a></li>
              <li><a href="#">Learning Paths</a></li>
              <li><a href="#">Student Dashboard</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>For Instructors</h5>
            <ul>
              <li><a href="#">Become a Teacher</a></li>
              <li><a href="#">Teacher Resources</a></li>
              <li><a href="#">Instructor Dashboard</a></li>
              <li><a href="#">Partner Program</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Contact Us</h5>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="row footer-bottom">
          <div className="col-md-6">
            <p>© 2025 LMS. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="social-icons">
              <a href="#"><span>Facebook</span></a>
              <a href="#"><span>Twitter</span></a>
              <a href="#"><span>LinkedIn</span></a>
              <a href="#"><span>Instagram</span></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
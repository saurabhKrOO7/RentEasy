import { useState, useEffect } from "react";
import {
  FaLock,
  FaUser,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { IoIosMail } from "react-icons/io";
import "./Register.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User successfully registered");
    } catch (error) {
      toast.error(error.data);
      console.log(error);
    }
  };
  return (
    <>
      <div className="background"></div>
      <div className="containers">
        <div className="item">
          <h2 className="logo">rentEase</h2>
          <div className="text-item">
            <h2>
              Welcome! <br />
              <span>To Our Channel</span>
            </h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et
              quaerat est qui unde.
            </p>
            <div className="social-icon">
              <Link
                to="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="i" />
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="i" />
              </Link>
              <Link
                to="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="i" />
              </Link>
              <Link
                to="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="i" />
              </Link>
              <Link
                to="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="i" />
              </Link>
            </div>
          </div>
        </div>
        <div className="login-section">
          <div className="form-box register">
            <form action="">
              <h2>Sign Up</h2>

              <div className="input-box">
                <span className="icon">
                  <FaUser />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Name</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <IoIosMail />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <FaLock />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
              </div>
              {/* <div className="radio">
                <div>
                  <input
                    type="radio"
                    name="fav_language"
                    value="lender"
                    checked={role === "lender"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label>Lender</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="fav_language"
                    value="renter"
                    checked={role === "renter"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label>Renter</label>
                </div>
                <br />
              </div> */}
              <br />
              <div className="remember-password">
                <label>
                  <input type="checkbox" />I agree with this statment{" "}
                </label>
              </div>
              <button className="btn" onClick={handleFormSubmit}>
                Sign Up
              </button>
              <div className="create-account">
                <p>
                  Already Have An Account?{" "}
                  <Link to="/login" className="nav__logo">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;

import { useEffect, useRef, useContext } from "react";
import validator from "validator";
import { useHistory } from "react-router-dom";
import axios from "axios";
import withModal from "../common/Modal";
import SignUp from "../register/SignUp";
import Context from "../../context";
import logo from "./resource/logo-icon.png";
import facebook from "./resource/facebook.png";
import google from "./resource/google.png";
import linkedin from "./resource/linkedin.png";

const Login = (props) => {
  const { toggleModal } = props;

  const { setUser, setIsLoading, cometChat } = useContext(Context);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const history = useHistory();

  useEffect(() => {
    const authenticatedUser = JSON.parse(localStorage.getItem("auth"));
    if (authenticatedUser) {
      history.push("/");
    }
  }, [history]);

  const getInputs = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    return { email, password };
  };

  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  const loginCometChat = async (user) => {
    const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
    return await cometChat.login(user.id, authKey);
  };

  const signin = async (email, password) => {
    const url = "https://m1lky-meet-server.vercel.app/api/users/login";
    return await axios.post(url, { email: email, password: password });
  };

  const login = async () => {
    const { email, password } = getInputs();
    if (isUserCredentialsValid(email, password)) {
      try {
        setIsLoading(true);
        const authenticatedUser = await signin(email, password);
        const cometChatAccount = await loginCometChat({
          id: authenticatedUser.data.uid,
        });
        if (cometChatAccount) {
          localStorage.setItem("auth", JSON.stringify(authenticatedUser.data));
          setUser(authenticatedUser.data);
          setIsLoading(false);
          history.push("/");
        } else {
          alert("Failure to log in, please try again");
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        alert("Failure to log in, please try again");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="first-screen">
      <div className="row align-items-lg-center">
        <div className="col-lg-5 block-center">
          <a href="#">
            <img src={logo} alt="logo-icon" className="w-40" />
          </a>
        </div>
        <div className="col-lg-7">
          <div className="form">
            <h4 style={{ margin: "30px 0" }}> Log in </h4>
            <input
              className="position-relative text_placeholder"
              type="text"
              placeholder="example@gmail.com"
              ref={emailRef}
            />
            <p className="title-input find-pos"> Email </p>
            <input
              className="position-relative text_placeholder"
              type="password"
              placeholder=""
              ref={passwordRef}
            />
            <p className="title-input find-pos"> Password </p>
            <a href="#">
              <button
                type="button"
                className="btn btn-large mb-20"
                style={{ marginTop: "0" }}
                onClick={login}
              >
                {" "}
                LOG IN{" "}
              </button>
            </a>
            {/* <a href="#" className="forgot-password">
              {" "}
              Forget password?{" "}
            </a> */}
            {/* <div className="d-flex align-items-lg-center mt-15 justify-content-center">
              <hr class="w-30" />
              <p className="s2" style={{ margin: "15px 50px" }}>
                {" "}
                OR YOU CAN LOG IN WITH{" "}
              </p>
              <hr class="w-30" />
            </div> */}
            {/* <div className="d-flex justify-content-lg-between mt-2 mb-3">
              <div className="col-lg-3 option-signin">
                <a href="https://fb.com">
                  <img src={facebook} className="w-25 p-2" /> Facebook{" "}
                </a>
              </div>
              <div className="col-lg-3 option-signin">
                <a href="https://google.com">
                  <img src={google} className="w-25 p-2" /> Google{" "}
                </a>
              </div>
              <div className="col-lg-3 option-signin">
                <a href="https://linkedin.com">
                  <img src={linkedin} className="w-25 p-2" /> LinkedIn{" "}
                </a>
              </div>
            </div> */}
            <p
              style={{
                display: "inline-block",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              {" "}
              Are you a new <strong>M1LKY MEET</strong> member?{" "}
            </p>{" "}
            <a onClick={() => toggleModal(true)}>
              <span className="note">Sign up now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withModal(SignUp)(Login);

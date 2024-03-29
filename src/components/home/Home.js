import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import Header from "../common/Header";
import Create from "./Create";
import Join from "./Join";
import Context from "../../context";

const Home = () => {
  const [meetings, setMeetings] = useState([]);

  const { user, setIsLoading, hasNewMeeting, setMeeting } = useContext(Context);

  const [isCreateShown, setIsCreateShown] = useState(false);
  const [isJoinShown, setIsJoinShown] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (user) {
      loadMeetings();
    }
  }, [user, hasNewMeeting]);

  const loadMeetings = async () => {
    if (user) {
      setIsLoading(true);
      const url = `https://m1lky-meet-server.vercel.app/api/meetings/${user.uid}`;
      const response = await axios.get(url);
      const meetings = response.data;
      setMeetings(() => meetings);
      setIsLoading(false);
    }
  };

  const toggleCreate = (isShown) => {
    setIsCreateShown(() => isShown);
  };

  const toggleJoin = (isShown) => {
    setIsJoinShown(() => isShown);
  };

  const goMeeting = (meeting) => () => {
    setMeeting(meeting);
    localStorage.setItem("meeting", JSON.stringify(meeting));
    history.push("/meeting");
  };

  return (
    <>
      <Header toggleCreate={toggleCreate} toggleJoin={toggleJoin} />
      <div className="main">
        <h3 style={{ textAlign: "center", paddingTop: "20px" }}>
          Your Created Meetings
        </h3>
        <div className="main__list">
          {meetings &&
            meetings.map((meeting) => (
              <div className="main__list-item" key={meeting._id}>
                <h3>{meeting.title}</h3>
                <p className="main__meeting-id">Meeting ID: {meeting.uid}</p>
                <button
                  className="main__meeting-start"
                  onClick={goMeeting(meeting)}
                >
                  Start
                </button>
              </div>
            ))}
        </div>
        {isCreateShown && <Create toggleCreate={toggleCreate} />}
        {isJoinShown && <Join toggleJoin={toggleJoin} />}
      </div>
    </>
  );
};
export default Home;

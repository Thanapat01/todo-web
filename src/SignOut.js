import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  let [cookies, removeCookie] = useCookies(["tokens"]);
  let navigate = useNavigate();

  useEffect(() => {
    removeCookie("tokens");
    navigate("/signin");
  }, []);

  return (
    <div>
      <center>
        <h1>กำลังออกจากระบบ</h1>
      </center>
    </div>
  );
}

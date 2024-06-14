import axios from "axios";
const getCurrenTime = async function () {
  const headers = {
    "Content-Type": "Aplication/json",
    Authorization: localStorage.getItem("token"),
    uid: localStorage.getItem("uid"),
  };
  try {
    const response = await axios.get("http://localhost:3000/api/getTime", {
      headers: headers,
    });
    const currTime = response.data.time;
    console.log(currTime);
    return currTime;
  } catch (error) {
    console.log(error);
    return error.response.status;
  }
};

export { getCurrenTime };

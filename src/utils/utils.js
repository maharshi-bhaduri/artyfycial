import axios from "axios";


const getCurrenTime = async function () {
  const headers = {
    "Content-Type": "Aplication/json",
    Authorization: localStorage.getItem("token"),
    uid: localStorage.getItem("uid"),
  };
  try {
    const response = await axios.get(import.meta.env.VITE_APP_GET_TIME, {
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

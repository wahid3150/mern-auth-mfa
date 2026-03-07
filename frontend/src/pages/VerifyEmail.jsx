import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../main";
import Loading from "../Loading";

const VerifyEmail = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const params = useParams();

  const [loading, setLoading] = useState(true);

  async function verifyUser() {
    try {
      const { data } = await axios.post(
        `${server}/api/user/verify/${params.token}`,
      );
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-50 m-auto mt-12">
          {successMessage && (
            <p className="text-green-500 text-2xl">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-2xl">{errorMessage}</p>
          )}
        </div>
      )}
    </>
  );
};

export default VerifyEmail;

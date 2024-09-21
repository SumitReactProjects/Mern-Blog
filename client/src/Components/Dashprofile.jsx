import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userslice.js";
import { useDispatch } from "react-redux";

const Dashprofile = () => {
  const { currentUser } = useSelector((state) => state.user);
  // use Ref
  const filePickerRef = useRef();
  // setting image file and URL
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadingError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  // console.log(imageFileUploadingProgress, imageFileUploadingError);
  const handleImageChange = async (e) => {
    setImageFileUploadError(null);
    // Selecting file from input Feilds
    const file = e.target.files[0];
    // Check the file exist or not if exist
    if (file) {
      // set image
      setImageFile(file);
      // and create its URL
      setImageFileURL(URL.createObjectURL(file));
    }
  };
  // console.log(imageFile, imageFileURL);
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // console.log("image Uploading...");
    const storage = getStorage(app);

    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not Upload Image (File Must be less than 2MB) "
        );
        setImageFileUploadingProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
          setImageFileURL(getDownloadURL);
          setFormData({ ...formData, profilePhoto: getDownloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };
  console.log(currentUser);
  return (
    <div className="mx-auto max-w-lg w-full p-3">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center mx-auto cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62,152,199,${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            ></CircularProgressbar>
          )}
          <img
            src={imageFileURL || currentUser.profilePhoto}
            alt="User"
            className={`w-full h-full rounded-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadingError && (
          <Alert color="failure">{imageFileUploadingError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="********"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update Profile
        </Button>
      </form>
      <div className="flex items-center justify-between text-red-500 my-4">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">SignOut</span>
      </div>
    </div>
  );
};

export default Dashprofile;

import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice.js";

export const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  // Local state for form inputs
  const [image, setImage] = useState(currentUser?.avatar || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError ] = useState(false); 
  const [userListings, setUserListings] = useState([]);
  // --- Upload image to Cloudinary ---
  const handleFileUpload = async (file) => {
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary environment variables are missing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFilePercentage(percent);
          },
        }
      );

      setImage(res.data.secure_url);
      setFileUploadError(false);
      setFilePercentage(100);

      // Update Redux immediately to reflect new avatar in header
      dispatch(
        updateUserSuccess({
          ...currentUser,
          avatar: res.data.secure_url,
        })
      );
    } catch (err) {
      console.error("Cloudinary error:", err.response?.data || err);
      alert("Image upload failed");
      setFileUploadError(true);
      setFilePercentage(0);
    }
  };

  // --- Handle input change ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "username") setUsername(value);
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);

    console.log({
      username: id === "username" ? value : username,
      email: id === "email" ? value : email,
      password: id === "password" ? value : password,
      avatar: image,
    });
  };

  // --- Submit profile update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    dispatch(updateUserStart());

    const updatedData = {
      username,
      email,
      password: password || undefined,
      avatar: image,
    };

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async ( ) => {
     try {
        dispatch(deleteUserStart());
        const res = await fetch (`/api/user/delete/${currentUser._id}`,{
           method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserFailure(data));
     } catch (error) {
       dispatch(deleteUserSuccess(error.message));
     }
  };

const handleSignOut = async() =>{
       try {
        dispatch(signOutUserStart()); 
         const res = await fetch('/api/auth/signout');
         const data = await res.json();
         if(data.success === false){
          dispatch(deleteUserFailure(data.message));
          return;
         }
         dispatch(deleteUserSuccess(data));
       } catch (error) {
          dispatch(deleteUserFailure(data.message));
       }
  };

const handleShowListings = async ( ) => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json(); 
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
   
    } catch (error) {
      setShowListingsError (true);
    }
};

const handleListingDelete = async (listingId) => {
   try {
     const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
     });
     const data = await res.json();
     if(data.success === false)
      {
        console.log(data.message);
        return;
      } 
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
   } catch (error) {
     console.log(error.message);
   }
}; 

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />

        {/* Clickable avatar */}
        <img
          onClick={() => fileRef.current.click()}
          className={`rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 ${
            loading ? "opacity-50" : ""
          }`}
          src={image || "/default-avatar.png"}
          alt="profile"
        />

        {/* Upload progress / error */}
        {fileUploadError && (
          <p className="text-red-700 text-center mt-2">Error uploading image</p>
        )}
        {filePercentage > 0 && filePercentage < 100 && !fileUploadError && (
          <p className="text-green-700 text-center mt-2">
            Uploading: {filePercentage}%
          </p>
        )}
        {filePercentage === 100 && !fileUploadError && (
          <p className="text-green-700 text-center mt-2">
            Image successfully uploaded
          </p>
        )}
        <p className="text-sm text-gray-500 text-center">Image must be less than 2MB</p>

        {/* Form fields */}
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          value={username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg
        uppercase text-center hover:opacity-95" to={'/create-listing'} >
           Create Listing
        </Link>
      </form>

      {/* Success message */}
      {updateSuccess && (
        <p className="text-green-700 mt-5 text-center">
          User updated successfully!
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-700 mt-5 text-center">{error}</p>
      )}

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser}  className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
        <p className="text-red-700 mt-5" >{error ? error : ''}</p>
        <p className="text-green-700 mt-5">{updateSuccess ? 'User is Updated successfully' : ''}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full" >Show Listing</button> 
        <p className="text-red-700 mt-5">{showListingsError ? 'Error showing Listing' : ''}</p>
       
       {userListings && userListings.length > 0 && 
       <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
        {userListings.map((listing) => ( 
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
             <Link to={`/listing/${listing._id}`} >
             <img className="h-16 w-16 object-contain " src={listing.imageUrls[0]} alt="listing Cover" />
             </Link> 
             <Link className=" text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`} >
             <p>{listing.name}</p>
             </Link>
             <div className=" flex flex-col items-center ">
               <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
               <Link to={`/update-listing/${listing._id}`}>
               <button className="text-green-700 uppercase">Edit</button>
               </Link>
             </div>
          </div>
         ))}
       </div> 
       }
    </div>
  );
};

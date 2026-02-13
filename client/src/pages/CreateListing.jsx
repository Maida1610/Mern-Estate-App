import  {  useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const {currentUser} = useSelector(state => state.user);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [error, setError] = useState(false);
  const [ loading, setLoading] = useState(false);
  const navigate = useNavigate();
   
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "sale",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    imageUrls: [],
  });
  console.log(formData);
  // ================= IMAGE SUBMIT =================
  const handleImageSubmit = async () => {
    if (
      files.length === 0 ||
      files.length + formData.imageUrls.length > 6
    ) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }

    setUploading(true);
    setImageUploadError("");

    try {
      const promises = files.map((file) => storeImage(file));
      const urls = await Promise.all(promises);

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
    } catch (error) {
      setImageUploadError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= CLOUDINARY =================
  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = new FormData();
        data.append("file", file);
        data.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        data.append("folder", "listings");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const result = await res.json();
        resolve(result.secure_url);
      } catch (err) {
        reject(err);
      }
    });
  };

  // ================= DELETE IMAGE =================
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
    }
  };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // basic validations
    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      return;
    }

    if (+formData.discountPrice > +formData.regularPrice) {
      setError("Discount price must be lower than regular price");
      return;
    }

    setLoading(true);
    setError(false);

    const res = await fetch("/api/listing/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
     },
      credentials: "include", 
      body: JSON.stringify({
        ...formData,
        userRef: currentUser._id, // ⭐ backend expects userRef
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || data.success === false) {
      setError(data.message || "Unauthorized");
      return;
    }

    // success
    console.log("Listing created:", data);
     navigate(`/listing/${data._id}`);

  } catch (error) {
    setLoading(false);
    setError(error.message);
  }
};



  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength='62'
            minLength='10'
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            type = 'text'
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                checked={formData.type === "sale"}
                onChange={handleChange}
                className="w-5"
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                checked={formData.type === "rent"}
                onChange={handleChange}
                className="w-5"
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="w-5"
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

           
  <div className="flex items-center gap-2">
    <input
      className="p-3 border border-gray-300 rounded-lg"
      type="number"
      id="bedrooms"
      min="1"
      max="10"
      required
      value={formData.bedrooms}
      onChange={handleChange}
    />
    <p>Beds</p>
  </div>

  <div className="flex items-center gap-2">
    <input
      className="p-3 border border-gray-300 rounded-lg"
      type="number"
      id="bathrooms"
      min="1"
      max="10"
      required
      value={formData.bathrooms}
      onChange={handleChange}
    />
    <p>Baths</p>
  </div>

  <div className="flex items-center gap-2">
    <input
      className="p-3 border border-gray-300 rounded-lg"
      type="number"
      id="regularPrice"
      min="50"
      max="1000000"
      required
      value={formData.regularPrice}
      onChange={handleChange}
    />
    <div className="flex flex-col items-center">
      <p>Regular Price</p>
      <span className="text-xs">($ / month)</span>
    </div>
  </div>

  <div className="flex items-center gap-2">
    <input
      className="p-3 border border-gray-300 rounded-lg"
      type="number"
      id="discountPrice"
      min="50"
      max="1000000"
      required
      value={formData.discountPrice}
      onChange={handleChange}
    />
    <div className="flex flex-col items-center">
      <p>Discounted Price</p>
      <span className="text-xs">($ / month)</span>
    </div>
  </div>
         </div>


        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images
            <span className="font-normal text-gray-600 ml-2">
              (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border rounded w-full"
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-700 text-sm">
              {imageUploadError}
            </p>
          )}

          {formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
            </div>
          ))}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase">
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
           {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

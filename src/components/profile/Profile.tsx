import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { clearProfile, editProfile, fetchProfile } from "../../store/profileSlice";
import { useParams } from "react-router-dom";
import { apiFiles } from "../../api/api";

const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { user, status } = useSelector((state: RootState) => state.profile);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        avatar: null as File | null,
    });

     const uploadFiles = async (files: File[]): Promise<any[]> => {
            const uploadedFiles: any[] = [];
    
            for (const file of files) {
                const extension = file.name.split('.').pop() || '';

                const type = file.type || 'application/octet-stream';
                const metadata = {
                    name: file.name,
                    type: type,
                    extension: extension,
                    userId: Cookies.get("id"),
                };
    
    
                const fileFormData = new FormData();
                fileFormData.append("metadata", new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                fileFormData.append("file", file);
                fileFormData.append("isAvatar", "false");
    
                const response = await fetch(`${apiFiles}?isAvatar=true`, {
                    method: "POST",
                    body: fileFormData,
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                });
    
                if (!response.ok) {
                    console.error("Failed to upload file:", file.name);
                    throw new Error(`File upload failed for ${file.name}`);
                }
    
                const fileDescriptor = await response.json();
                uploadedFiles.push(fileDescriptor);
            }
    
            return uploadedFiles;
        };

    useEffect(() => {
        if (username) {
            dispatch(fetchProfile({ username }));
        }
    }, [dispatch, username]);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                avatar: null,
            });
        }
    }, [user]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const updatedFormData = new FormData();
    
        updatedFormData.append("username", formData.username || "");
        if (formData.avatar && typeof formData.avatar === "string") {
            updatedFormData.append("avatar", formData.avatar);
        }
    
        dispatch(
            editProfile({
                username: user.username,
                upDatedData: updatedFormData,
            })
        );
    
        setIsEditing(false);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            try {
                const uploadedFiles = await uploadFiles(files);
                if (uploadedFiles.length > 0) {
                    const avatarPath = uploadedFiles[0].path;
                    setFormData((prev) => ({
                        ...prev,
                        avatar: avatarPath,
                    }));
                }
            } catch (error) {
                console.error("Ошибка загрузки файлов:", error);
            }
        }
    };

    if (status === "loading") return <p>Loading...</p>;
    if (!user) return <p>No profile data found</p>;
    
    return(
        <section className="h-100 gradient-custom-2">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center">
                    <div className="col col-lg-9 col-xl-8">
                        <div className="card">
                            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "300px" }}>
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px"}}>
                                <img
                                    src={
                                        formData.avatar
                                            ? URL.createObjectURL(formData.avatar)
                                            : user?.avatar?.path || "/assets/default-avatar.png"
                                    }
                                    alt="Generic placeholder image"
                                    className="rounded-circle img-fluid" style={{ width: '150px', height: '150px', objectFit: 'cover', zIndex: "1"  }}
                                />
                                {isEditing && (
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{display: "block", marginBottom: "10px"}}
                                        className="input_upload"
                                    />
                                )}
                                    <button  type="button" 
                                        data-mdb-button-init data-mdb-ripple-init 
                                        className="btn btn-outline-light text-light me-2 mt-4" 
                                        data-mdb-ripple-color="dark" style={{ zIndex: "1"}}
                                        onClick={handleEditClick}>
                                        Edit profile
                                    </button>
                                </div>
                                <div className="ms-3" style={{marginTop: "130px"}}>
                                {isEditing ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Username"
                                            className="form-control mb-2"
                                        />
                                        <button className="btn btn-success" onClick={handleSave}>
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h5>{user.username}</h5>
                                        <p>{user.email}</p>
                                    </>
                                )}          
                                </div>
                        </div>
                        <div className="p-4 text-black bg-body-tertiary">
                            <div className="d-flex justify-content-end text-center py-1 text-body">
                                <div>
                                    <p className="mb-1 h5">{user.friends}</p>
                                    <p className="small text-muted mb-0">Friends</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4 text-black">
                            <div className="mb-5  text-body">
                                <p className="lead fw-normal mb-1">About</p>
                                <div className="p-4 bg-body-tertiary">
                                    <p className="font-italic mb-1">{user.roles.name}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4 text-body">
                                <p className="lead fw-normal mb-0">Recent posts</p>
                            </div>
                            <div className="row g-2">
                                {/* <div className="col mb-2">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp" alt="image 1"
                                    className="w-100 rounded-3"/>
                                </div> */}
                                {/* {news.map((article) => (
                                    <div key={article.id} className="col mb-2 w-300 p-4 bg-body-tertiary">
                                        <h4>{article.title}</h4>
                                        <small className="mt-1">{new Date(article.date).toLocaleString()}</small>
                                        <p className="font-italic mb-1 mt-2">{article.content}</p>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default Profile;
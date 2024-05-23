import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";
import { Link } from "react-router-dom";
import "../PagesCss/Home.css"; // Adjust the path as per your directory structure
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from "react-bootstrap";


function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      window.location = "/login";
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          if (response.data && response.data.listOfPosts && response.data.likedPosts) {
            setListOfPosts(response.data.listOfPosts);
            setLikedPosts(
              response.data.likedPosts.map((like) => {
                return like.PostId;
              })
            );
          } else {
            console.error("API response is missing expected data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                window.location = `/post/${value.id}`;
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;

// 2nd version
// function Home() {
//   const [listOfPosts, setListOfPosts] = useState([]);
//   const [likedPosts, setLikedPosts] = useState([]);
//   const { authState } = useContext(AuthContext);

//   useEffect(() => {
//     if (!localStorage.getItem("accessToken")) {
//       window.location = "/login";
//     } else {
//       axios
//         .get("http://localhost:3001/posts", {
//           headers: { accessToken: localStorage.getItem("accessToken") },
//         })
//         .then((response) => {
//           if (response.data && response.data.listOfPosts && response.data.likedPosts) {
//             setListOfPosts(response.data.listOfPosts);
//             setLikedPosts(
//               response.data.likedPosts.map((like) => {
//                 return like.PostId;
//               })
//             );
//           } else {
//             console.error("API response is missing expected data.");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }
//   }, []);

//   const likeAPost = (postId) => {
//     axios
//       .post(
//         "http://localhost:3001/likes",
//         { PostId: postId },
//         { headers: { accessToken: localStorage.getItem("accessToken") } }
//       )
//       .then((response) => {
//         setListOfPosts(
//           listOfPosts.map((post) => {
//             if (post.id === postId) {
//               if (response.data.liked) {
//                 return { ...post, Likes: [...post.Likes, 0] };
//               } else {
//                 const likesArray = post.Likes;
//                 likesArray.pop();
//                 return { ...post, Likes: likesArray };
//               }
//             } else {
//               return post;
//             }
//           })
//         );

//         if (likedPosts.includes(postId)) {
//           setLikedPosts(
//             likedPosts.filter((id) => {
//               return id !== postId;
//             })
//           );
//         } else {
//           setLikedPosts([...likedPosts, postId]);
//         }
//       });
//   };

//   return (
//     <div className="container mt-5">
//       {listOfPosts.map((value, key) => {
//         return (
//           <div key={key} className="card mb-3">
//             <div className="card-header">
//               <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
//             </div>
//             <div className="card-body">
//               <h5 className="card-title">{value.title}</h5>
//               <p className="card-text">{value.postText}</p>
//               <button
//                 onClick={() => likeAPost(value.id)}
//                 className={`btn ${likedPosts.includes(value.id) ? 'btn-primary' : 'btn-secondary'}`}
//               >
//                 Like <span className="badge bg-light text-dark">{value.Likes.length}</span>
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default Home;

// //V3 
// function Home() {
//   const [listOfPosts, setListOfPosts] = useState([]);
//   const [likedPosts, setLikedPosts] = useState([]);
//   const { authState } = useContext(AuthContext);

//   useEffect(() => {
//     if (!localStorage.getItem("accessToken")) {
//       window.location = "/login";
//     } else {
//       axios
//         .get("http://localhost:3001/posts", {
//           headers: { accessToken: localStorage.getItem("accessToken") },
//         })
//         .then((response) => {
//           if (response.data && response.data.listOfPosts && response.data.likedPosts) {
//             setListOfPosts(response.data.listOfPosts);
//             setLikedPosts(
//               response.data.likedPosts.map((like) => {
//                 return like.PostId;
//               })
//             );
//           } else {
//             console.error("API response is missing expected data.");
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }
//   }, []);

//   const likeAPost = (postId) => {
//     axios
//       .post(
//         "http://localhost:3001/likes",
//         { PostId: postId },
//         { headers: { accessToken: localStorage.getItem("accessToken") } }
//       )
//       .then((response) => {
//         setListOfPosts(
//           listOfPosts.map((post) => {
//             if (post.id === postId) {
//               if (response.data.liked) {
//                 return { ...post, Likes: [...post.Likes, 0] };
//               } else {
//                 const likesArray = post.Likes;
//                 likesArray.pop();
//                 return { ...post, Likes: likesArray };
//               }
//             } else {
//               return post;
//             }
//           })
//         );

//         if (likedPosts.includes(postId)) {
//           setLikedPosts(
//             likedPosts.filter((id) => {
//               return id !== postId;
//             })
//           );
//         } else {
//           setLikedPosts([...likedPosts, postId]);
//         }
//       });
//   };

//   return (
//     <div className="container mt-5">
//       {listOfPosts.map((value, key) => {
//         return (
//           <Card key={key} className="mb-3">
//             <Card.Header>
//               <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
//             </Card.Header>
//             <Card.Body>
//               <Card.Title>{value.title}</Card.Title>
//               <Card.Text>{value.postText}</Card.Text>
//               <Button
//                 onClick={() => likeAPost(value.id)}
//                 variant={likedPosts.includes(value.id) ? 'primary' : 'secondary'}
//               >
//                 Like <span className="badge bg-light text-dark">{value.Likes.length}</span>
//               </Button>
//             </Card.Body>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }

// export default Home;

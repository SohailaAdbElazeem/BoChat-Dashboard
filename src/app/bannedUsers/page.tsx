// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
// import { useEffect, useState } from "react";

// function BannedUsers() {
//   const [banned, setBanned] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     // console.log(document.cookie);
// console.log(localStorage);

//     if (!token) return;

//     fetch("https://bo-chat.space/dashboard/bannedUsers", {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     })
//     .then(res => res.json())
//     .then(data => {
//       console.log(data);
//       setBanned(data);
//     })
//     .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       {banned.length > 0 ? (
//         <ul>
//           {banned.map((user: any) => (
//             <li key={user.id}>{user.username}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No banned users</p>
//       )}
//     </div>
//   );
// }

// export default BannedUsers;

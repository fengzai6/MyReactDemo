// import { useState, useTransition } from "react";

// export const UseTransition = () => {
//   const [name, setName] = useState<string>("React18");
//   const [msg, setMsg] = useState<string>("");

//   const [isPending, startTransition] = useTransition();

//   const updateName = (data: string) => {
//     return new Promise<void | string>((resolve) => {
//       const error = Math.random() > 0.5;

//       setTimeout(() => {
//         if (error) {
//           resolve("Update failed");
//         } else {
//           resolve();
//         }
//       }, 2000);
//     });
//   };

//   // react 19
//   // const handleSubmit = () => {
//   //   startTransition(async () => {
//   //     const res = await updateName(name);

//   //     if (res) {
//   //       setMsg(res);
//   //     } else {
//   //       setMsg("Update success");
//   //     }
//   //   });
//   // };

//   return (
//     <div>
//       <input
//         name="name"
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       {/* <Button onClick={handleSubmit} loading={isPending}>
//         Change Name
//       </Button> */}
//       <p>msg:{msg}</p>
//     </div>
//   );
// };

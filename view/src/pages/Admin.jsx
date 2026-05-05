import { useEffect, useState } from "react";
import { getTickets, startTicket, doneTicket } from "../services/api";


function Admin() {
 const [tickets, setTickets] = useState([]);
 const [selectedBusiness, setSelectedBusiness] = useState(""); // 🔥 NY


 useEffect(() => {
   getTickets().then(data => setTickets(data));
 }, []);


 const handleStart = async (id) => {
   await startTicket(id);
   getTickets().then(setTickets);
 };


 const handleDone = async (id) => {
   await doneTicket(id);
   getTickets().then(setTickets);
 };


 const businesses = [...new Set(tickets.map(t => t.business))];


 const filteredTickets = selectedBusiness
   ? tickets.filter(t => t.business === selectedBusiness)
   : tickets;


 return (
   <div>
     <h2>Admin Panel</h2>


     <select
       value={selectedBusiness}
       onChange={(e) => setSelectedBusiness(e.target.value)}
     >
       <option value="">All businesses</option>
       {businesses.map((b, index) => (
         <option key={index} value={b}>
           {b}
         </option>
       ))}
     </select>


     <br /><br />


     {filteredTickets.length === 0 && (
       <p>No tickets found</p>
     )}


     {filteredTickets.map((t) => (
       <div key={t.id}>
         <p><b>User:</b> {t.user}</p>
         <p><b>Business:</b> {t.business}</p>
         <p><b>Message:</b> {t.message}</p>
         <p><b>Status:</b> {t.status}</p>


         <button
           onClick={() => handleStart(t.id)}
           disabled={t.status !== "waiting"}
         >
           Start
         </button>


         <button
           onClick={() => handleDone(t.id)}
           disabled={t.status !== "active"}
         >
           Done
         </button>


         <hr />
       </div>
     ))}
   </div>
 );
}


export default Admin;

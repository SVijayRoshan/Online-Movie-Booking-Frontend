import{c as d,j as e,e as c,f as o}from"./index-YhsNIgvP.js";import{u as m,H as x}from"./Header-CL76FjJX.js";import{B as h,a as p}from"./button-Duyd6bEY.js";import{P as f}from"./ProtectedRoute-BkExmAMJ.js";import{C as r}from"./card-CfP9Vloi.js";import{B as j}from"./badge-BNxsIBJT.js";import{C as u}from"./calendar-VtQJu4ZQ.js";import{C as v}from"./clock-NVaRpnqF.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=d("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=d("Ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]]);function y({booking:t}){const a=()=>{const s=window.open("","_blank");s&&(s.document.write(`
        <html>
          <head>
            <title>Ticket - ${t.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .ticket { max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
              h1 { text-align: center; }
              .info { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <h1>${t.movieTitle||"Movie Ticket"}</h1>
              <div class="info"><strong>Booking ID:</strong> ${t.id}</div>
              <div class="info"><strong>Theatre:</strong> ${t.theatre}</div>
              <div class="info"><strong>Date:</strong> ${new Date(t.showDate||"").toLocaleDateString()}</div>
              <div class="info"><strong>Time:</strong> ${t.showTime}</div>
              <div class="info"><strong>Seats:</strong> ${t.seats.map(i=>i.id).join(", ")}</div>
              <div class="info"><strong>Total:</strong> ₹${t.total.toLocaleString("en-IN")}</div>
            </div>
          </body>
        </html>
      `),s.document.close(),s.print())};return e.jsxs(r,{className:"p-6 hover-elevate",children:[e.jsxs("div",{className:"flex items-start justify-between mb-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-lg","data-testid":`text-movie-${t.id}`,children:t.movieTitle||"Movie"}),e.jsxs("p",{className:"text-sm text-muted-foreground","data-testid":`text-booking-id-${t.id}`,children:["Booking ID: ",t.id]})]}),e.jsx(j,{variant:"secondary",children:"Confirmed"})]}),e.jsxs("div",{className:"space-y-2 text-sm mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(g,{className:"w-4 h-4 text-muted-foreground"}),e.jsx("span",{"data-testid":`text-theatre-${t.id}`,children:t.theatre})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(u,{className:"w-4 h-4 text-muted-foreground"}),e.jsx("span",{"data-testid":`text-date-${t.id}`,children:t.showDate?new Date(t.showDate).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):""})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(v,{className:"w-4 h-4 text-muted-foreground"}),e.jsx("span",{"data-testid":`text-time-${t.id}`,children:t.showTime})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(n,{className:"w-4 h-4 text-muted-foreground"}),e.jsxs("span",{"data-testid":`text-seats-${t.id}`,children:["Seats: ",t.seats.map(s=>s.id).join(", ")]})]})]}),e.jsxs("div",{className:"flex items-center justify-between pt-4 border-t",children:[e.jsx("div",{className:"text-lg font-bold","data-testid":`text-total-${t.id}`,children:o(t.total)}),e.jsx(h,{variant:"outline",size:"sm",onClick:a,"data-testid":`button-print-${t.id}`,children:"Print Ticket"})]})]})}function N(){const{user:t}=c(),{data:a,isLoading:s}=m({queryKey:["/api/bookings",t==null?void 0:t.id],queryFn:()=>p.getBookings(t.id),enabled:!!t});return e.jsxs("div",{className:"min-h-screen bg-background",children:[e.jsx(x,{}),e.jsxs("main",{className:"max-w-5xl mx-auto px-4 py-8",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h1",{className:"text-3xl font-bold mb-2","data-testid":"text-user-name",children:["Welcome, ",t==null?void 0:t.name,"!"]}),e.jsx("p",{className:"text-muted-foreground","data-testid":"text-user-email",children:t==null?void 0:t.email})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-semibold mb-6",children:"Your Bookings"}),s?e.jsx("div",{className:"space-y-4",children:Array.from({length:3}).map((i,l)=>e.jsx("div",{className:"h-48 bg-muted rounded-lg animate-pulse"},l))}):a&&a.length>0?e.jsx("div",{className:"space-y-4",children:a.map(i=>e.jsx(y,{booking:i},i.id))}):e.jsxs(r,{className:"p-12 text-center",children:[e.jsx(n,{className:"w-12 h-12 mx-auto text-muted-foreground mb-4"}),e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"No bookings yet"}),e.jsx("p",{className:"text-muted-foreground",children:"Start exploring movies and make your first booking!"})]})]})]})]})}function S(){return e.jsx(f,{children:e.jsx(N,{})})}export{S as default};

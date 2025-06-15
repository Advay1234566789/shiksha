import { HiDesktopComputer,HiCalendar,HiHome,HiLibrary,HiClipboard,HiChatAlt,HiLightBulb,HiDocument,HiChatAlt2,HiUsers,HiClipboardCheck
} from "react-icons/hi";

export const SidebarData = [
   {
     icon: <HiHome/>,
     heading: "Dashboard",
     path: "/learnerdash",
     cName: 'sidebartext'
   },
   {
       icon: <HiDesktopComputer/>,
       heading: "My Courses",
       path: "/mycourses",
       cName: 'sidebartext'
     },
   {
       icon: <HiDocument/>,
       heading: "Self Assessment",
       path: "/selfassessment",
       cName: 'sidebartext'
   },
   {
       icon:< HiChatAlt/>,
       heading: "Doubts & Discussions",
      //  path: "/dd",
       path: "/dnd",
       cName: 'sidebartext'
     },
   {
       icon: <HiUsers/>,
       heading: "Join Forum",
       path: "/forum",
       cName: 'sidebartext'
     },
     {
       icon: <HiClipboardCheck/>,
       heading: "Blogs",
       path: "/blogs",
       cName: 'sidebartext'
     },
     {
       icon: <HiLightBulb/>,
       heading: "Learning Tree",
       path: "/learningtree",
       cName: 'sidebartext'
     },
     {
       icon: <HiCalendar/>,
       heading: "Newsletter",
       path: "/newsletter",
       cName: 'sidebartext'
     },

]
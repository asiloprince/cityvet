import {
  FaPeopleArrows,
  FaUserFriends,
  FaPiggyBank,
  FaChartLine,
  // FaFileAlt,
  FaCalendarCheck,
  FaEdit,
} from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";

const links = [
  {
    id: 1,
    title: "Main",
    listLinks: [
      {
        id: 1,
        title: "Dashboard",
        url: "/",
        icon: <RiDashboardFill />,
      },
      {
        id: 2,
        title: "Dispersal",
        url: "/dispersal",
        icon: <FaPeopleArrows />,
      },
    ],
  },
  {
    id: 2,
    title: "List",
    listLinks: [
      {
        id: 1,
        title: "Livestock",
        url: "/livestocks",
        icon: <FaPiggyBank />,
      },
      {
        id: 2,
        title: "Benefeciaries",
        url: "/beneficiaries",
        icon: <FaUserFriends />,
      },
    ],
  },
  {
    id: 3,
    title: "General",
    listLinks: [
      {
        id: 1,
        title: "Calendar",
        url: "/calendar",
        icon: <FaCalendarCheck />,
      },
    ],
  },
  {
    id: 4,
    title: "Manage Team",
    listLinks: [
      {
        id: 1,
        title: "Team",
        url: "/roles",
        icon: <FaEdit />,
      },
    ],
  },
  {
    id: 5,
    title: "Analytics",
    listLinks: [
      {
        id: 1,
        title: "Statistics",
        url: "/statistics",
        icon: <FaChartLine />,
      },
      // {
      //   id: 2,
      //   title: "Logs",
      //   url: "/logs",
      //   icon: <FaFileAlt />,
      // },
    ],
  },
];

export default links;

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "react-router-dom";

import { Menu, Moon, Sun, User } from "lucide-react";
import Profile from "./profile";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export const sheetItems = [
    {
        id: 1,
        link: "/profile",
        label: "Profile"
    },
    {
        id: 2,
        link: "/management",
        label: "Management"
    },
    {
        id: 3,
        link: "/logout",
        label: "Logout"
    },
]

function ProfileSheet () {
    const { theme, setTheme } = useTheme();
    return (
        <Sheet>
            <SheetTrigger><span className="flex w-40 p-2 mx-4 hover:bg-accent rounded-lg focus:bg-[#82ca9d] focus:text-white focus:font-semibold text-xs"> <User className="h-4 w-4 mr-2 "/> Profile </span></SheetTrigger>
            <SheetContent className=" flex flex-col">
                <SheetHeader>
                    <SheetTitle>Hello There, { `{username}` }</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-between h-screen">
                    <div className="flex items-center justify-end mx-5 mt-5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        area-label="Toggle Theme"
                    >
                        <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
                        <span className="sr-only">Toggle Theme</span>
                    </Button>
                    </div>
                    <div className="flex justify-center mb-40">
                        <Profile>
                        </Profile>
                    </div>
                    <nav className="w-56">
                    {sheetItems.map((links) => (
                        <Link
                        to = {links.link}
                        key = {links.id}
                        className="flex flex-col m-1 p-1 pl-3 border-b-2 hover:bg-accent hover:text-accent-foreground rounded-lg focus:underline">
                        {links.label}
                        </Link>
                    ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ProfileSheet;
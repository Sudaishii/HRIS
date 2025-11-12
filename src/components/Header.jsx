import React from "react";
import { ChevronLeftIcon, SearchIcon, Sun, Moon, BellIcon } from "lucide-react";
import PropTypes from "prop-types";
import { Cn } from "../utils/cn.js";
import { useTheme } from "../assets/hooks/use-theme.jsx";

export const Header = ({ collapsed, setCollapsed }) => {
  
  const {theme, setTheme} = useTheme();

  return (
    <header
      className={Cn(
        "fixed top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-md transition-all duration-300 dark:bg-slate-900",
        collapsed ? "md:left-[70px] left-0 md:w-[calc(100%-70px)] w-full" : "md:left-[250px] left-0 md:w-[calc(100%-250px)] w-full"
      )}
    >
      <div className="flex items-center gap-x-3" style={{paddingLeft: "1rem"}}>
           <button className="btn-ghost size=10" onClick={() => setCollapsed(!collapsed)}>
              <ChevronLeftIcon className={collapsed && "rotate-180"}/>
           </button>
           <div className="input">
              <SearchIcon size={20} style={{marginLeft: "0.5rem"}} className="text-slate-300"/>
              <input 
                type="text" 
                placeholder="Search... "
                name="search"
                id="search"
                className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                />

           </div>
      </div>
      <div className="flex items-center gap-x-3" style={{paddingRight: "1rem"}}>
            <button
              className="btn-ghost w-10 h-10 flex items-center justify-center"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
          <Sun
            size={20}
            className="dark:hidden" 
          />

          <Moon 
            size={20}
            className="hidden dark:block"
          />
        </button>
        <button className="btn-ghost size-10">
          <BellIcon size={20} />
        </button>
        <button className="size-10 overflow-hidden rounded-full">
          <img
            src="https://i.pravatar.cc/300"
            alt="User Avatar"
            className="size-full object-cover"
          />

        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

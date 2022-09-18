import React, { useContext } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FlipIcon from "@material-ui/icons/Flip";
import SettingsIcon from '@material-ui/icons/Settings';
import ChildCareIcon from "@material-ui/icons/ChildCare";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { AppContext } from "adapter";
import { makeStyles } from "@material-ui/styles";
import { Divider, Drawer } from "@material-ui/core";

import { Profile, SidebarNav } from "./components";

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up("lg")]: {
      marginTop: 64,
      height: "calc(100% - 64px)"
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { user } = useContext(AppContext);
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: "概览",
      href: "/dashboard",
      icon: <DashboardIcon/>
    },
    {
      title: "IP白名单",
      href: "/whitelist",
      icon: <FlipIcon/>
    },{
      title: "访问日志",
      href: "/accessLog",
      icon: <LibraryBooksIcon/>
    },{
      title: "账单",
      href: "/bill",
      icon: <ReceiptIcon/>
    },
    {
      title: "终端列表",
      href: "/endpointList",
      icon: <ImportantDevicesIcon/>
    }
  ];

  if (user.isAdmin) {
    pages.push({
      title: "系统设置",
      href: "/config",
      icon: <SettingsIcon/>
    });
    pages.push({
      title: "账号信息",
      href: "/account",
      icon: <ChildCareIcon/>
    });

  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile/>
        <Divider className={classes.divider}/>
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
